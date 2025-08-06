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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('send-signup-req')
  async sendSignUpCode(
    @Body() sendSignUpRequestDto: SendSignUpRequestDto,
  ): Promise<any> {
    try {
      const result =
        await this.authService.sendSignupRequest(sendSignUpRequestDto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send signup code',
        error: error.message,
      };
    }
  }

  @Post('verify-account-signup')
  async verifyAccountSignup(
    @Body() verifyAccountDto: VerifyAccountDto,
  ): Promise<any> {
    try {
      const result =
        await this.authService.verifyAccountSignup(verifyAccountDto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Verification failed',
        error: error.message,
      };
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Login failed', error: error.message };
    }
  }

  @Post('resend-signup-code')
  async resendSignupCode(
    @Body() resendSignupCodeDto: ResendSignupCodeDto,
  ): Promise<any> {
    try {
      const result =
        await this.authService.resendSignupCode(resendSignupCodeDto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend code',
        error: error.message,
      };
    }
  }

  @Get('user')
  @UseGuards(AuthGuard())
  async getUser(@Req() req): Promise<any> {
    try {
      const result = await this.authService.getUser({ user: req.user });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get user',
        error: error.message,
      };
    }
  }

  @Post('send-update-email-code')
  @UseGuards(AuthGuard())
  async sendUpdateEmailCode(@Req() req, @Body() body): Promise<any> {
    try {
      const result = await this.authService.sendUpdateEmailCode(
        req.user._id,
        body.email,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send update email code',
        error: error.message,
      };
    }
  }

  @Post('send-update-phone-code')
  @UseGuards(AuthGuard())
  async sendUpdatePhoneCode(@Req() req, @Body() body): Promise<any> {
    try {
      const result = await this.authService.sendUpdatePhoneCode(
        req.user._id,
        body.phone,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send update phone code',
        error: error.message,
      };
    }
  }

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
    try {
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
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user',
        error: error.message,
      };
    }
  }

  @Post('apply-for-partner')
  @UseGuards(AuthGuard())
  async applyForPartner(@Req() req): Promise<any> {
    try {
      const result = await this.authService.applyForPartner(req.user._id);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to apply for partner',
        error: error.message,
      };
    }
  }

  // admin and super admin routes start

  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers(@Query() getAllUsersDto: GetAllUsersDto): Promise<any> {
    try {
      const result = await this.authService.getUsers(getAllUsersDto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get users',
        error: error.message,
      };
    }
  }

  @Get('partner-applications')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getPartnerApplications(): Promise<any> {
    try {
      const result = await this.authService.getPartnerApplications();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get partner applications',
        error: error.message,
      };
    }
  }

  @Post('approve-partner-application/:userId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async approvePartnerApplication(
    @Param('userId') userId: string,
  ): Promise<any> {
    try {
      const result = await this.authService.approvePartnerApplication(userId);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to approve partner application',
        error: error.message,
      };
    }
  }

  @Get('partners')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getPartners(): Promise<any> {
    try {
      const result = await this.authService.getPartners();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get partners',
        error: error.message,
      };
    }
  }

  @Post('update-language')
  @UseGuards(AuthGuard())
  async updateLanguage(@Req() req, @Body() body: { language: string }): Promise<any> {
    try {
      const result = await this.authService.updateLanguageAndGetNewToken(
        req.user._id,
        body.language,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update language',
        error: error.message,
      };
    }
  }
}
