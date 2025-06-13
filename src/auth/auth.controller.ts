import {
  Body,
  Controller,
  Get,
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
import { Role, TSendVerificationCodeReturn, TUserReturn } from './types';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guards';
import { GetAllUsersDto } from './dto/get-all-users-dto';
import { SendSignUpRequestDto } from './dto/send-signup-request';
import { EditUserDto } from './dto/edit-user-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerMiddleware } from 'src/common/multer.middleware';
import { ResendSignupCode } from './dto/resend-signup-code-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('send-signup-req')
  sendSignUpCode(
    @Body() sendSignUpRequestDto: SendSignUpRequestDto,
  ): Promise<TSendVerificationCodeReturn> {
    return this.authService.sendSignupRequest(sendSignUpRequestDto);
  }

  @Post('verify-account-signup')
  verifyAccountSignup(
    @Body() verifyAccountDto: VerifyAccountDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyAccountSignup(verifyAccountDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('resend-signup-code')
  resendSignupCode(
    @Body() resendLoginCode: ResendSignupCode,
  ): Promise<TSendVerificationCodeReturn> {
    return this.authService.resendSignupCode(resendLoginCode);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  async getUser(@Req() req): Promise<TUserReturn> {
    return this.authService.getUser({
      user: req.user,
    });
  }

  @Post('send-update-email-code')
  @UseGuards(AuthGuard())
  async sendUpdateEmailCode(
    @Req() req,
    @Body() body,
  ): Promise<{ message: string }> {
    return this.authService.sendUpdateEmailCode(req.user, body.email);
  }

  @Post('send-update-phone-code')
  @UseGuards(AuthGuard())
  async sendUpdatePhoneCode(
    @Req() req,
    @Body() body,
  ): Promise<{ message: string }> {
    return this.authService.sendUpdatePhoneCode(req.user, body.phone);
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
      avatar?: Express.Multer.File[];
    },
  ): Promise<{ message: string }> {
    let avatarUrl: string | undefined;

    if (files?.avatar?.[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        files.avatar[0],
        'user-avatars',
      );
      avatarUrl = uploadResult.secure_url;
    }

    return this.authService.editUser(req.user, updateUserDto, avatarUrl);
  }

  // admin and super admin routes start
  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers(
    @Query() getAllUsersDto: GetAllUsersDto,
  ): Promise<{ users: TUserReturn[]; totalCount: number } | void> {
    return this.authService.getUsers(getAllUsersDto);
  }
}
