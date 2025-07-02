import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user-schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { VerifyAccountDto } from './dto/verify-account-dto';
import { UserVerification } from './schemas/user-verification-schema';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  ESignInMethods,
  Role,
  TSendVerificationCodeReturn,
  TUserReturn,
} from './types';
import { GetAllUsersDto } from './dto/get-all-users-dto';
import { SendSignUpRequestDto } from './dto/send-signup-request';
import {
  ResendSignupCode,
  ResendSignupCodeDto,
} from './dto/resend-signup-code-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as bcrypt from 'bcryptjs';

enum EMAIL_TEMPLATE_IDS {
  LOGIN_CODE_REQ = 'd-5ba849b1bed04a47874f167fb030ba28',
  SIGNUP_CODE_REQ = 'd-ad274d1c2d0a4611a637d1da1e702f85',
  UPDATE_EMAIL_CODE_REQ = 'd-67ec90fd6ba44702a5b32edad99fec9a',
}

type EmailTemplateProperties = {
  receiverEmail: string;
  code?: string;
  template_id: EMAIL_TEMPLATE_IDS;
  username: string;
};

@Injectable()
export class AuthService {
  private readonly CODE_EXPIRATION = 10; // minutes

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(UserVerification.name)
    private userVerification: Model<UserVerification>,

    private jwtService: JwtService,

    private configService: ConfigService,

    private cloudinaryService: CloudinaryService,
  ) {}

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendEmail(emailProperties: EmailTemplateProperties) {
    const ENVIROMENT = this.configService.get('ENVIROMENT');
    if (ENVIROMENT === 'development') {
      return;
    }
    const { receiverEmail, code, template_id, username } = emailProperties;
    const API_KEY = this.configService.get('SENDGRID_API_KEY');
    const SENDER_EMAIL = this.configService.get('SENDGRID_SENDER_EMAIL');

    let subject = '';
    switch (template_id) {
      case EMAIL_TEMPLATE_IDS.LOGIN_CODE_REQ:
        subject = 'Login Code Request';
        break;
      case EMAIL_TEMPLATE_IDS.SIGNUP_CODE_REQ:
        subject = 'Signup Code Request';
        break;
      case EMAIL_TEMPLATE_IDS.UPDATE_EMAIL_CODE_REQ:
        subject = 'Update Email Request';
        break;
    }

    let code1, code2, code3, code4, code5, code6;
    if (code) {
      code1 = code.charAt(0);
      code2 = code.charAt(1);
      code3 = code.charAt(2);
      code4 = code.charAt(3);
      code5 = code.charAt(4);
      code6 = code.charAt(5);
    }

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email: receiverEmail }],
              dynamic_template_data: {
                subject: subject,
                first_name: username,
                code1: code1,
                code2: code2,
                code3: code3,
                code4: code4,
                code5: code5,
                code6: code6,
              },
            },
          ],
          from: { email: SENDER_EMAIL },
          subject: subject,
          template_id: template_id,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Email sending failed');
    }
  }

  private async sendPhoneSms({
    phone,
    message,
  }: {
    phone: string;
    message: string;
  }) {
    const ENVIROMENT = this.configService.get('ENVIROMENT');
    if (ENVIROMENT === 'development') {
      return;
    }
    const ACCOUNT_SID = this.configService.get('TWILIO_ACCOUNT_SID');
    const AUTH_TOKEN = this.configService.get('TWILIO_AUTH_TOKEN');
    const FROM_PHONE = this.configService.get('TWILIO_FROM_PHONE_NUMBER');

    // const MESSAGE_BODY = `Your Luxury verification code is: ${code}`;
    const TWILIO_URL = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const data = new URLSearchParams({
      To: phone,
      From: FROM_PHONE,
      Body: message,
    });

    try {
      await axios.post(TWILIO_URL, data, {
        auth: {
          username: ACCOUNT_SID,
          password: AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException('SMS sending failed');
    }
  }

  private isUserAllowedOnPlatform(userVerification: UserVerification): boolean {
    if (!userVerification?.isSignupCompleted) {
      throw new UnauthorizedException('Signup not completed');
    }
    return true;
  }

  private isEnteredCodeValid(
    code: string,
    userVerification: UserVerification,
    type: 'email' | 'phone',
  ) {
    if (type === 'email') {
      if (userVerification.emailVerificationCode !== code) {
        throw new UnauthorizedException('Invalid email verification code');
      }
      const expirationTime =
        (userVerification?.emailCodeSentAt?.getTime() || 0) +
        this.CODE_EXPIRATION * 60 * 1000;
      if (expirationTime < new Date().getTime()) {
        throw new BadRequestException('Email verification code expired');
      }
    } else {
      if (userVerification.phoneVerificationCode !== code) {
        throw new UnauthorizedException('Invalid phone verification code');
      }
      const expirationTime =
        (userVerification?.phoneCodeSentAt?.getTime() || 0) +
        this.CODE_EXPIRATION * 60 * 1000;
      if (expirationTime < new Date().getTime()) {
        throw new BadRequestException('Phone verification code expired');
      }
    }
  }

  private isResendCodeAllowed(userVerification: UserVerification) {
    // check if last code sent time is less than 1 minute
    const emailCodeExpirationTime =
      (userVerification?.emailCodeSentAt?.getTime() || 0) + 1 * 60 * 1000;
    const phoneCodeExpirationTime =
      (userVerification?.phoneCodeSentAt?.getTime() || 0) + 1 * 60 * 1000;

    if (emailCodeExpirationTime > new Date().getTime()) {
      throw new HttpException(
        {
          message: 'Email verification code already sent',
          emailCodeSentAt: userVerification?.emailCodeSentAt?.getTime() || 0,
        },
        429,
      );
    }
    if (phoneCodeExpirationTime > new Date().getTime()) {
      throw new HttpException(
        {
          message: 'Phone verification code already sent',
          phoneCodeSentAt: userVerification?.phoneCodeSentAt?.getTime() || 0,
        },
        429,
      );
    }
  }

  async sendSignupRequest(
    sendSignUpRequestDto: SendSignUpRequestDto,
  ): Promise<TSendVerificationCodeReturn> {
    const { name, email, phone, password } = sendSignUpRequestDto;
    // get user by email or phone
    const existingUser = await this.userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    const userVerification = await this.userVerification.findOne({
      userId: existingUser?._id,
    });
    if (existingUser) {
      if (userVerification.isSignupCompleted) {
        throw new ConflictException('User already exist');
      }

      this.isResendCodeAllowed(userVerification);
    }

    const emailVerificationCode = this.generateRandomCode();
    const phoneVerificationCode = this.generateRandomCode();

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.sendEmail({
      receiverEmail: email,
      code: emailVerificationCode,
      username: name,
      template_id: EMAIL_TEMPLATE_IDS.SIGNUP_CODE_REQ,
    });
    await this.sendPhoneSms({
      phone: phone,
      message: `Your Baia verification code is: ${phoneVerificationCode}`,
    });

    const user = await this.userModel.findOneAndUpdate(
      { email: email, phone: phone },
      {
        name,
        email,
        phone,
        password: hashedPassword,
        signInMethod: ESignInMethods.PASSWORD,
      },
      { upsert: true, new: true },
    );

    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        emailVerificationCode: emailVerificationCode,
        phoneVerificationCode: phoneVerificationCode,
        emailCodeSentAt: new Date().getTime(),
        phoneCodeSentAt: new Date().getTime(),
        isSignupCompleted: false,
      },
      { upsert: true, new: true },
    );

    return {
      message: 'Signup request sent',
      emailCodeSentAt: new Date().getTime(),
      phoneCodeSentAt: new Date().getTime(),
    };
  }

  async verifyAccountSignup(
    verifyAccountDto: VerifyAccountDto,
  ): Promise<{ message: string; token: string }> {
    const { email, phone, emailCode, phoneCode } = verifyAccountDto;

    // Find user by email and phone
    const user = await this.userModel.findOne({
      email: email,
      phone: phone,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });

    if (!userVerification) {
      throw new NotFoundException('User verification not found');
    }

    // Verify email code
    this.isEnteredCodeValid(emailCode, userVerification, 'email');

    // Verify phone code
    this.isEnteredCodeValid(phoneCode, userVerification, 'phone');

    // Update both email and phone verification status and mark signup as completed
    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        isEmailVerified: true,
        isPhoneVerified: true,
        isSignupCompleted: true,
      },
    );
    // issue JWT token
    const token = this.jwtService.sign({ id: user._id });

    return { message: 'Account verified successfully', token: token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { emailOrPhone, password } = loginDto;
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user signed up with password method
    if (user.signInMethod !== ESignInMethods.PASSWORD) {
      throw new UnauthorizedException(
        `This account was created using ${user.signInMethod} sign-in. Please use the appropriate login method.`,
      );
    }

    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });

    this.isUserAllowedOnPlatform(userVerification);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  async googleLogin(): Promise<{ token: string }> {
    // Verify Google ID token (you'll need to implement this based on your Google OAuth setup)
    const googleUser = await this.verifyGoogleToken();

    if (!googleUser) {
      throw new UnauthorizedException('Invalid Google token');
    }

    // Check if user already exists
    let user = await this.userModel.findOne({ email: googleUser.email });

    if (user) {
      // User exists, check if they signed up with Google
      if (user.signInMethod !== ESignInMethods.GOOGLE) {
        throw new UnauthorizedException(
          `This email is already registered with ${user.signInMethod} sign-in. Please use the appropriate login method.`,
        );
      }

      // Update user info if needed
      await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          name: googleUser.name,
          avatar: googleUser.picture,
        },
      );
    } else {
      // Create new user
      user = await this.userModel.create({
        name: googleUser.name,
        email: googleUser.email,
        phone: googleUser.phone, // Google users might not have phone initially
        signInMethod: ESignInMethods.GOOGLE,
      });

      // Create user verification record (Google users are pre-verified)
      await this.userVerification.create({
        userId: user._id,
        isEmailVerified: true,
        isPhoneVerified: false, // Phone verification might be required later
        isSignupCompleted: true,
      });
    }

    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  private async verifyGoogleToken(): Promise<any> {
    // This is a placeholder implementation
    // You'll need to implement actual Google token verification
    // using Google's OAuth2 API or a library like google-auth-library
    try {
      // For now, we'll return a mock implementation
      // In production, you should verify the token with Google
      // You would typically use something like:
      // const ticket = await client.verifyIdToken({
      //   idToken,
      //   audience: GOOGLE_CLIENT_ID,
      // });
      // const payload = ticket.getPayload();
      // For now, return null to indicate verification is needed
      return null;
    } catch (error) {
      console.error('Google token verification failed:', error);
      return null;
    }
  }

  async getUser({ user }): Promise<TUserReturn> {
    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });

    return {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: userVerification.isEmailVerified,
      isPhoneVerified: userVerification.isPhoneVerified,
      createdAt: user.createdAt,
      avatar: user.avatar,
      isPartnerApplicationSubmitted:
        userVerification.isPartnerApplicationSubmitted,
      isPartnerApplicationApproved:
        userVerification.isPartnerApplicationApproved,
    };
  }

  async resendLoginCode(
    resendLoginCode: ResendSignupCode,
  ): Promise<TSendVerificationCodeReturn> {
    const { emailOrPhone } = resendLoginCode;
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });

    this.isUserAllowedOnPlatform(userVerification);
    this.isResendCodeAllowed(userVerification);
    if (emailOrPhone.includes('@')) {
      const verificationCode = this.generateRandomCode();
      await this.sendEmail({
        receiverEmail: user.email,
        username: user.name,
        code: verificationCode,
        template_id: EMAIL_TEMPLATE_IDS.LOGIN_CODE_REQ,
      });
      await this.userVerification.findOneAndUpdate(
        { userId: user._id },
        {
          emailVerificationCode: verificationCode,
          emailCodeSentAt: new Date(),
        },
      );

      return {
        message: 'Email verification code sent.',
        emailCodeSentAt: new Date().getTime(),
      };
    } else {
      const verificationCode = this.generateRandomCode();
      await this.sendPhoneSms({
        phone: emailOrPhone,
        message: `Your Luxury verification code is: ${verificationCode}`,
      });
      await this.userVerification.findOneAndUpdate(
        { userId: user._id },
        {
          phoneVerificationCode: verificationCode,
          phoneCodeSentAt: new Date(),
        },
      );

      return {
        message: 'Phone verification code sent.',
        phoneCodeSentAt: new Date().getTime(),
      };
    }
  }

  async resendSignupCode(
    resendSignupCodeDto: ResendSignupCodeDto,
  ): Promise<TSendVerificationCodeReturn> {
    const { email, phone } = resendSignupCodeDto;
    const user = await this.userModel.findOne({
      email: email,
      phone: phone,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });
    if (!userVerification) {
      throw new NotFoundException('User verification not found');
    }
    if (userVerification.isSignupCompleted) {
      throw new ConflictException('User already exist');
    }
    this.isResendCodeAllowed(userVerification);

    const emailVerificationCode = this.generateRandomCode();
    const phoneVerificationCode = this.generateRandomCode();
    await this.sendEmail({
      receiverEmail: email,
      code: emailVerificationCode,
      username: user.name,
      template_id: EMAIL_TEMPLATE_IDS.SIGNUP_CODE_REQ,
    });
    await this.sendPhoneSms({
      phone: phone,
      message: `Your Baia verification code is: ${phoneVerificationCode}`,
    });
    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        emailVerificationCode: emailVerificationCode,
        phoneVerificationCode: phoneVerificationCode,
        emailCodeSentAt: new Date().getTime(),
        phoneCodeSentAt: new Date().getTime(),
      },
    );
    return {
      message: 'Signup verification codes resent',
      emailCodeSentAt: new Date().getTime(),
      phoneCodeSentAt: new Date().getTime(),
    };
  }

  async sendUpdateEmailCode(
    userId: string,
    email: string,
  ): Promise<{ message: string }> {
    // make sure email is not already in use
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const verificationCode = this.generateRandomCode();
    await this.sendEmail({
      receiverEmail: email,
      code: verificationCode,
      username: user.name,
      template_id: EMAIL_TEMPLATE_IDS.UPDATE_EMAIL_CODE_REQ,
    });

    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        emailVerificationCode: verificationCode,
        emailCodeSentAt: new Date(),
      },
    );

    return {
      message: 'Email verification code sent.',
    };
  }

  async sendUpdatePhoneCode(
    userId: string,
    phone: string,
  ): Promise<{ message: string }> {
    // make sure phone is not already in use
    const existingUser = await this.userModel.findOne({ phone: phone });
    if (existingUser) {
      throw new ConflictException('Phone already in use');
    }

    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });

    this.isResendCodeAllowed(userVerification);

    const verificationCode = this.generateRandomCode();
    await this.sendPhoneSms({
      phone,
      message: `Your Luxury verification code is: ${verificationCode}`,
    });
    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        phoneVerificationCode: verificationCode,
        phoneCodeSentAt: new Date(),
      },
    );

    return {
      message: 'Phone verification code sent.',
    };
  }

  async editUser(userId: string, editUserDto: EditUserDto, avatarUrl?: string) {
    const { name, email, phone, emailCode, phoneCode } = editUserDto;

    if (avatarUrl) {
      // delete old avatar
      const user = await this.userModel.findOne({ _id: userId });
      if (user.avatar) {
        await this.cloudinaryService.deleteImage(user.avatar);
      }
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          avatar: avatarUrl,
        },
      );
      return {
        message: 'User updated successfully',
      };
    } else if (name) {
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          name,
        },
        { new: true },
      );
      return {
        message: 'User updated successfully',
      };
    } else if (email && emailCode) {
      const user = await this.userModel.findOne({ _id: userId });
      const userVerification = await this.userVerification.findOne({
        userId: user._id,
      });
      this.isEnteredCodeValid(emailCode, userVerification, 'email');
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          email,
        },
      );
      return {
        message: 'User updated successfully',
      };
    } else if (phone && phoneCode) {
      const user = await this.userModel.findOne({ _id: userId });
      const userVerification = await this.userVerification.findOne({
        userId: user._id,
      });
      this.isEnteredCodeValid(phoneCode, userVerification, 'phone');
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          phone,
        },
      );
      return {
        message: 'User updated successfully',
      };
    }
  }

  async applyForPartner(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userVerification = await this.userVerification.findOne({
      userId: user._id,
    });
    // user needs to be verified first
    this.isUserAllowedOnPlatform(userVerification);

    if (userVerification.isPartnerApplicationSubmitted) {
      throw new ConflictException('Partner application already submitted');
    }

    // Update the verification record to mark the application as submitted
    await this.userVerification.findOneAndUpdate(
      { userId: user._id },
      {
        isPartnerApplicationSubmitted: true,
      },
    );
    //TODO: send email as confirmation

    return { message: 'Partner application submitted successfully' };
  }

  // apis for admin and asuper admin
  async getUsers(
    getAllUsersDto: GetAllUsersDto,
  ): Promise<{ users: TUserReturn[]; totalCount: number } | void> {
    let { keyword, limit = 10, offset = 0 } = getAllUsersDto;
    const { role } = getAllUsersDto;

    limit = limit && Number(limit);
    offset = offset && Number(offset);
    keyword = keyword && keyword.trim().replace('+', '');

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'userverifications',
          localField: '_id',
          foreignField: 'userId',
          as: 'verification',
        },
      },
      {
        $unwind: {
          path: '$verification',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'usermetadatas', // Note: MongoDB typically pluralizes collection names
          localField: '_id',
          foreignField: 'userId',
          as: 'metadata',
        },
      },
      {
        $unwind: {
          path: '$metadata',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'purchases',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
            { $count: 'total' },
          ],
          as: 'creatorsClaimedData',
        },
      },
      {
        $addFields: {
          creatorsClaimed: {
            $ifNull: [{ $arrayElemAt: ['$creatorsClaimedData.total', 0] }, 0],
          },
        },
      },
      // Add a $lookup stage to join the Referral collection
      {
        $lookup: {
          from: 'referrals',
          localField: '_id',
          foreignField: 'referredUser',
          as: 'referralInfo',
        },
      },
      {
        $unwind: {
          path: '$referralInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'referralInfo.referrer',
          foreignField: '_id',
          as: 'referrerInfo',
        },
      },
      {
        $unwind: {
          path: '$referrerInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          referredBy: {
            name: '$referrerInfo.name',
            email: '$referrerInfo.email', // Include email
            phone: '$referrerInfo.phone',
            _id: '$referrerInfo._id',
            referredAt: '$referralInfo.createdAt', // Include referredAt in the referredBy object
          },
        },
      },
    ];

    const matchConditions: any = {};

    if (keyword) {
      matchConditions['$or'] = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword.toLowerCase(), $options: 'i' } },
        { phone: { $regex: keyword.toLowerCase(), $options: 'i' } },
        { telegramOrWhatsapp: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (role) {
      matchConditions.role = { $in: [role] };
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push({
      $facet: {
        totalCount: [{ $count: 'count' }],
        users: [
          { $skip: offset },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              telegramOrWhatsapp: 1,
              creatorsManaged: 1,
              monthlyGrossRevenue: 1,
              role: 1,
              createdAt: 1,
              updatedAt: 1,
              isEmailVerified: '$verification.isEmailVerified',
              isPhoneVerified: '$verification.isPhoneVerified',
              isSignupCompleted: '$verification.isSignupCompleted',
              creatorsClaimed: 1,
              credits: 1,
              referredBy: 1, // Include referredBy field
              // Include exact UserMetadata fields from your schema
              'metadata.ip': 1,
              'metadata.browser': 1,
              'metadata.os': 1,
              'metadata.platform': 1,
              'metadata.version': 1,
              'metadata.source': 1,
              'metadata.lastSeen': 1,
            },
          },
        ],
      },
    });

    // Execute the aggregation
    const [result] = await this.userModel.aggregate(pipeline);

    result.users = result.users.map((user) => {
      return {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        telegramOrWhatsapp: user.telegramOrWhatsapp,
        creatorsManaged: user.creatorsManaged,
        monthlyGrossRevenue: user.monthlyGrossRevenue,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        creatorsClaimed: user.creatorsClaimed,
        credits: user.credits,
        createdAt: user.createdAt,
        referralCode: user.referralCode,
        referredBy: user.referredBy, // Include referredBy in the final response
        // Include the exact UserMetadata fields
        metadata: user.metadata
          ? {
              ip: user.metadata.ip,
              browser: user.metadata.browser,
              os: user.metadata.os,
              platform: user.metadata.platform,
              version: user.metadata.version,
              source: user.metadata.source,
              lastSeen: user.metadata.lastSeen,
            }
          : null,
      };
    });

    return {
      users: result.users,
      totalCount: result.totalCount[0]?.count || 0,
    };
  }
  async getPartnerApplications() {
    // get users with isPartnerApplicationSubmitted true and isPartnerApplicationApproved false, also populate userInfo
    const userverifications = await this.userVerification
      .find({
        isPartnerApplicationSubmitted: true,
        isPartnerApplicationApproved: false,
      })
      .populate('userId');
    // now map it to return only required fields
    return userverifications.map((userVerification) => {
      const user: any = userVerification.userId;
      return {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: userVerification.isEmailVerified,
        isPhoneVerified: userVerification.isPhoneVerified,
        createdAt: user.createdAt,
        avatar: user.avatar,
        isPartnerApplicationSubmitted:
          userVerification.isPartnerApplicationSubmitted,
        isPartnerApplicationApproved:
          userVerification.isPartnerApplicationApproved,
      };
    });
  }

  async approvePartnerApplication(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role.includes(Role.PARTNER)) {
      throw new Error('User is already a partner');
    }
    const userVerification = await this.userVerification.findOne({
      userId: userId,
    });
    if (!userVerification) {
      throw new Error('User has not applied for partner');
    }
    if (userVerification.isPartnerApplicationApproved) {
      throw new Error('User is already a partner');
    }
    await this.userVerification.findOneAndUpdate(
      { userId: userId },
      { isPartnerApplicationApproved: true },
    );
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { role: Role.PARTNER } },
    );
    return {
      message: 'Partner application approved',
    };
  }

  async getPartners() {
    const users = await this.userModel.find({ role: { $in: [Role.PARTNER] } });
    return users.map((user) => {
      return {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      };
    });
  }
}
