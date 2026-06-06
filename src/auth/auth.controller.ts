import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UnifiedLoginDto } from './dto/unified-login.dto';
import { VerifyAccountDto } from './dto/verify-account-dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './types';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guards';
import { GetAllUsersDto } from './dto/get-all-users-dto';
import { SendSignUpRequestDto } from './dto/send-signup-request';
import { EditUserDto } from './dto/edit-user-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerMiddleware } from 'src/common/multer.middleware';
import { ResendSignupCodeDto } from './dto/resend-signup-code-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Step 1 of signup: send verification codes to email + phone.
   * Returns timestamps for OTP cooldown timers.
   */
  @Post('send-signup-req')
  async sendSignUpCode(
    @Body() sendSignUpRequestDto: SendSignUpRequestDto,
  ): Promise<any> {
    const result = await this.authService.sendSignupRequest(sendSignUpRequestDto);
    return { success: true, data: result };
  }

  /**
   * Step 2 of signup: verify email + phone OTP codes and complete registration.
   * Returns a JWT token on success.
   */
  @Post('verify-account-signup')
  async verifyAccountSignup(
    @Body() verifyAccountDto: VerifyAccountDto,
  ): Promise<any> {
    const result = await this.authService.verifyAccountSignup(verifyAccountDto);
    return { success: true, data: result };
  }

  /**
   * Login with email/phone and password.
   * Returns a JWT token on success.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const result = await this.authService.login(loginDto);
    return { success: true, data: result };
  }

  /**
   * Unified login for all user types (user, admin, partner, security guard).
   * Returns JWT token and user type on success.
   */
  @Post('unified-login')
  async unifiedLogin(@Body() unifiedLoginDto: UnifiedLoginDto): Promise<any> {
    const result = await this.authService.unifiedLogin(unifiedLoginDto);
    return { success: true, data: result };
  }

  /**
   * Resend signup OTP codes.
   * Enforces rate-limit (1 per minute); returns countdown timestamps.
   */
  @Post('resend-signup-code')
  async resendSignupCode(
    @Body() resendSignupCodeDto: ResendSignupCodeDto,
  ): Promise<any> {
    const result = await this.authService.resendSignupCode(resendSignupCodeDto);
    return { success: true, data: result };
  }

  /**
   * Initiate or complete password reset.
   * Without code/password: sends reset code.
   * With code + password: resets the password and returns a new JWT.
   */
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return { success: true, data: result };
  }

  /**
   * Get the currently authenticated user's profile.
   */
  @Get('user')
  @UseGuards(AuthGuard())
  async getUser(@Req() req): Promise<any> {
    const result = await this.authService.getUser({ user: req.user });
    return { success: true, data: result };
  }

  /**
   * Send OTP to a new email address before updating it.
   */
  @Post('send-update-email-code')
  @UseGuards(AuthGuard())
  async sendUpdateEmailCode(@Req() req, @Body() body): Promise<any> {
    const result = await this.authService.sendUpdateEmailCode(
      req.user._id,
      body.email,
    );
    return { success: true, data: result };
  }

  /**
   * Send OTP to a new phone number before updating it.
   */
  @Post('send-update-phone-code')
  @UseGuards(AuthGuard())
  async sendUpdatePhoneCode(@Req() req, @Body() body): Promise<any> {
    const result = await this.authService.sendUpdatePhoneCode(
      req.user._id,
      body.phone,
    );
    return { success: true, data: result };
  }

  /**
   * Update the authenticated user's profile (name, email, phone, avatar, language).
   */
  @Put('update-user/:userId')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], multerMiddleware),
  )
  async updateUser(
    @Req() req,
    @Body() updateUserDto: EditUserDto,
    @UploadedFiles()
    files: {
      avatar?: any[];
    },
  ): Promise<any> {
    let avatarUrl: string | undefined;

    if (files?.avatar?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.avatar[0],
        'user-avatars',
      );
      avatarUrl = uploadResult.secure_url;
    }

    const result = await this.authService.editUser(
      req.user._id,
      updateUserDto,
      avatarUrl,
    );
    return { success: true, data: result };
  }

  /**
   * Submit a partner application for the authenticated user.
   */
  @Post('apply-for-partner')
  @UseGuards(AuthGuard())
  async applyForPartner(@Req() req): Promise<any> {
    const result = await this.authService.applyForPartner(req.user._id);
    return { success: true, data: result };
  }

  // ─── Admin routes ──────────────────────────────────────────────────────────

  /**
   * Get all users with optional filters/pagination (admin only).
   */
  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers(@Query() getAllUsersDto: GetAllUsersDto): Promise<any> {
    const result = await this.authService.getUsers(getAllUsersDto);
    return { success: true, data: result };
  }

  /**
   * Get pending partner applications (admin only).
   */
  @Get('partner-applications')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getPartnerApplications(): Promise<any> {
    const result = await this.authService.getPartnerApplications();
    return { success: true, data: result };
  }

  /**
   * Approve a partner application (admin only).
   */
  @Post('approve-partner-application/:userId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async approvePartnerApplication(
    @Param('userId') userId: string,
  ): Promise<any> {
    const result = await this.authService.approvePartnerApplication(userId);
    return { success: true, data: result };
  }

  /**
   * Reject a partner application with a reason (admin only).
   */
  @Post('reject-partner-application/:userId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async rejectPartnerApplication(
    @Param('userId') userId: string,
    @Body('reason') reason: string,
  ): Promise<any> {
    const result = await this.authService.rejectPartnerApplication(
      userId,
      reason,
    );
    return { success: true, data: result };
  }

  /**
   * Get all approved partners (admin only).
   */
  @Get('partners')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getPartners(): Promise<any> {
    const result = await this.authService.getPartners();
    return { success: true, data: result };
  }

  /**
   * Update the authenticated user's language preference.
   * Generates and returns a new JWT token with the updated language embedded.
   */
  @Post('update-language')
  @UseGuards(AuthGuard())
  async updateLanguage(
    @Req() req,
    @Body() body: { language: string },
  ): Promise<any> {
    const result = await this.authService.updateLanguageAndGetNewToken(
      req.user._id,
      body.language,
    );
    return { success: true, data: result };
  }
}
