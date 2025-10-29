import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  SecurityGuard,
  SecurityGuardDocument,
  SecurityGuardStatus,
} from './schemas/security-guard-schema';
import {
  CreateSecurityGuardDto,
  UpdateSecurityGuardDto,
  SecurityGuardLoginDto,
  GetSecurityGuardsQueryDto,
} from './dto/security-guard.dto';
import { User } from './schemas/user-schema';

@Injectable()
export class SecurityGuardService {
  constructor(
    @InjectModel(SecurityGuard.name)
    private securityGuardModel: Model<SecurityGuardDocument>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate a random password for security guards
   */
  private generateRandomPassword(): string {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  /**
   * Send security guard credentials via email
   */
  private async sendCredentialsEmail(
    email: string,
    name: string,
    username: string,
    password: string,
  ): Promise<void> {
    const ENVIRONMENT = this.configService.get('ENVIRONMENT');
    if (ENVIRONMENT === 'development') {
      console.log(`Security Guard Credentials for ${name}:`);
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      return;
    }

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email }],
              dynamic_template_data: {
                first_name: name,
                username: username,
                password: password,
              },
            },
          ],
          from: { email: this.configService.get('SENDGRID_SENDER_EMAIL') },
          subject: 'Your Security Guard Login Credentials',
          template_id: 'd-security-guard-credentials', // You'll need to create this template
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('SENDGRID_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Error sending security guard credentials email:', error);
      throw new Error('Failed to send credentials email');
    }
  }

  /**
   * Send security guard credentials via SMS
   */
  private async sendCredentialsSms(
    phone: string,
    name: string,
    username: string,
    password: string,
  ): Promise<void> {
    const ENVIRONMENT = this.configService.get('ENVIRONMENT');
    if (ENVIRONMENT === 'development') {
      console.log(
        `SMS for ${name}: Username: ${username}, Password: ${password}`,
      );
      return;
    }

    try {
      const ACCOUNT_SID = this.configService.get('TWILIO_ACCOUNT_SID');
      const AUTH_TOKEN = this.configService.get('TWILIO_AUTH_TOKEN');
      const FROM_PHONE = this.configService.get('TWILIO_FROM_PHONE_NUMBER');

      const message = `Hello ${name}, your security guard credentials are: Username: ${username}, Password: ${password}. Please keep these secure.`;

      const data = new URLSearchParams({
        To: phone,
        From: FROM_PHONE,
        Body: message,
      });

      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
        data,
        {
          auth: {
            username: ACCOUNT_SID,
            password: AUTH_TOKEN,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      console.error('Error sending security guard credentials SMS:', error);
      throw new Error('Failed to send credentials SMS');
    }
  }

  /**
   * Create a new security guard
   */
  async createSecurityGuard(
    createDto: CreateSecurityGuardDto,
    partnerId: string,
  ): Promise<{
    securityGuard: SecurityGuard;
    credentials: { username: string; password: string };
  }> {
    const { name, username, email, phone, assignedProductIds = [] } = createDto;

    // Check if username already exists
    const existingUsername = await this.securityGuardModel.findOne({
      username,
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.securityGuardModel.findOne({ email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone already exists
    const existingPhone = await this.securityGuardModel.findOne({ phone });
    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    // Verify partner exists
    const partner = await this.userModel.findById(partnerId);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // Generate random password
    const generatedPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create security guard
    const securityGuard = new this.securityGuardModel({
      name,
      username,
      password: hashedPassword,
      email,
      phone,
      partnerId: new Types.ObjectId(partnerId),
      assignedProductIds: assignedProductIds.map(
        (id) => new Types.ObjectId(id),
      ),
      createdBy: new Types.ObjectId(partnerId),
    });

    const savedSecurityGuard = await securityGuard.save();

    // Send credentials via email and SMS
    try {
      await Promise.all([
        this.sendCredentialsEmail(email, name, username, generatedPassword),
        this.sendCredentialsSms(phone, name, username, generatedPassword),
      ]);
    } catch (error) {
      console.error('Error sending credentials:', error);
      // Don't throw error here, just log it - security guard is still created
    }

    return {
      securityGuard: savedSecurityGuard,
      credentials: {
        username,
        password: generatedPassword,
      },
    };
  }

  /**
   * Get security guards for a partner
   */
  async getSecurityGuardsForPartner(
    partnerId: string,
    query: GetSecurityGuardsQueryDto,
  ): Promise<{
    securityGuards: SecurityGuard[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { status, page = '1', limit = '20' } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { partnerId: new Types.ObjectId(partnerId) };
    if (status) {
      filter.status = status;
    }

    // Get total count
    const total = await this.securityGuardModel.countDocuments(filter);

    // Get paginated results
    const securityGuards = await this.securityGuardModel
      .find(filter)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return {
      securityGuards,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    };
  }

  /**
   * Get security guard by ID
   */
  async getSecurityGuardById(
    id: string,
    partnerId: string,
  ): Promise<SecurityGuard> {
    const securityGuard = await this.securityGuardModel
      .findOne({
        _id: new Types.ObjectId(id),
        partnerId: new Types.ObjectId(partnerId),
      })
      .select('-password')
      .lean();

    if (!securityGuard) {
      throw new NotFoundException('Security guard not found');
    }

    return securityGuard;
  }

  /**
   * Update security guard
   */
  async updateSecurityGuard(
    id: string,
    updateDto: UpdateSecurityGuardDto,
    partnerId: string,
  ): Promise<SecurityGuard> {
    const securityGuard = await this.securityGuardModel.findOne({
      _id: new Types.ObjectId(id),
      partnerId: new Types.ObjectId(partnerId),
    });

    if (!securityGuard) {
      throw new NotFoundException('Security guard not found');
    }

    // Check for conflicts if updating username, email, or phone
    if (updateDto.username && updateDto.username !== securityGuard.username) {
      const existingUsername = await this.securityGuardModel.findOne({
        username: updateDto.username,
        _id: { $ne: new Types.ObjectId(id) },
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateDto.email && updateDto.email !== securityGuard.email) {
      const existingEmail = await this.securityGuardModel.findOne({
        email: updateDto.email,
        _id: { $ne: new Types.ObjectId(id) },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateDto.phone && updateDto.phone !== securityGuard.phone) {
      const existingPhone = await this.securityGuardModel.findOne({
        phone: updateDto.phone,
        _id: { $ne: new Types.ObjectId(id) },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Hash password if provided
    if (updateDto.password) {
      const hashedPassword = await bcrypt.hash(updateDto.password, 10);
      updateDto.password = hashedPassword;
    }

    // Convert product IDs to ObjectIds if provided
    if (updateDto.assignedProductIds) {
      updateDto.assignedProductIds = updateDto.assignedProductIds.map(
        (id) => new Types.ObjectId(id),
      ) as any;
    }

    const updatedSecurityGuard = await this.securityGuardModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { ...updateDto },
        { new: true },
      )
      .select('-password');

    return updatedSecurityGuard;
  }

  /**
   * Delete security guard
   */
  async deleteSecurityGuard(id: string, partnerId: string): Promise<boolean> {
    const result = await this.securityGuardModel.deleteOne({
      _id: new Types.ObjectId(id),
      partnerId: new Types.ObjectId(partnerId),
    });

    return result.deletedCount > 0;
  }

  /**
   * Security guard login
   */
  async login(loginDto: SecurityGuardLoginDto): Promise<{
    token: string;
  }> {
    const { username, password } = loginDto;
    const identifier = (username || '').trim();

    // Find security guard by username OR email OR phone
    const securityGuard = await this.securityGuardModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier },
      ],
    });
    if (!securityGuard) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if security guard is active
    if (securityGuard.status !== SecurityGuardStatus.ACTIVE) {
      throw new UnauthorizedException('Security guard account is not active');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      securityGuard.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.securityGuardModel.findByIdAndUpdate(securityGuard._id, {
      lastLoginAt: new Date(),
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      id: securityGuard._id,
      type: 'security_guard',
      partnerId: securityGuard.partnerId,
      lang: securityGuard.language || 'en',
    });

    return {
      token,
    };
  }

  /**
   * Get security guard profile
   */
  async getSecurityGuardProfile(id: string): Promise<SecurityGuard> {
    const securityGuard = await this.securityGuardModel
      .findById(id)
      .select('-password')
      .lean();

    if (!securityGuard) {
      throw new NotFoundException('Security guard not found');
    }

    return securityGuard;
  }

  /**
   * Update security guard profile
   */
  async updateSecurityGuardProfile(
    id: string,
    updateDto: Partial<UpdateSecurityGuardDto>,
  ): Promise<SecurityGuard> {
    // Hash password if provided
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    const updatedSecurityGuard = await this.securityGuardModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { ...updateDto },
        { new: true },
      )
      .select('-password');

    if (!updatedSecurityGuard) {
      throw new NotFoundException('Security guard not found');
    }

    return updatedSecurityGuard;
  }
}
