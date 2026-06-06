import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SECURITY_GUARD_CODES } from '../i18n/namespaces/security-guard.namespace';
import { COMMON_CODES } from '../i18n/namespaces/common.namespace';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guards';
import { SecurityGuardAuthGuard } from './guards/security-guard-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './types';
import { SecurityGuardService } from './security-guard.service';
import {
  CreateSecurityGuardDto,
  UpdateSecurityGuardDto,
  SecurityGuardLoginDto,
  GetSecurityGuardsQueryDto,
} from './dto/security-guard.dto';

@Controller('security-guards')
export class SecurityGuardController {
  constructor(private readonly securityGuardService: SecurityGuardService) {}

  /**
   * Create a new security guard (Partner only)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async createSecurityGuard(
    @Body() createDto: CreateSecurityGuardDto,
    @Req() req,
  ) {
    const result = await this.securityGuardService.createSecurityGuard(
      createDto,
      req.user._id,
    );
    return {
      success: true,
      data: {
        securityGuard: result.securityGuard,
        credentials: result.credentials,
      },
    };
  }

  /**
   * Get security guards for a partner
   */
  @Get('partner/:partnerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async getSecurityGuardsForPartner(
    @Param('partnerId') partnerId: string,
    @Query() query: GetSecurityGuardsQueryDto,
    @Req() req,
  ) {
    if (
      req.user.role.includes(Role.PARTNER) &&
      req.user._id.toString() !== partnerId
    ) {
      throw new ForbiddenException(COMMON_CODES.FORBIDDEN);
    }
    const result = await this.securityGuardService.getSecurityGuardsForPartner(
      partnerId,
      query,
    );
    return { success: true, data: result };
  }

  /**
   * Get security guard by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async getSecurityGuardById(@Param('id') id: string, @Req() req) {
    const partnerId = req.user.role.includes(Role.ADMIN)
      ? null
      : req.user._id.toString();
    const securityGuard = await this.securityGuardService.getSecurityGuardById(
      id,
      partnerId,
    );
    return { success: true, data: securityGuard };
  }

  /**
   * Update security guard
   */
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async updateSecurityGuard(
    @Param('id') id: string,
    @Body() updateDto: UpdateSecurityGuardDto,
    @Req() req,
  ) {
    const partnerId = req.user.role.includes(Role.ADMIN)
      ? null
      : req.user._id.toString();
    const securityGuard = await this.securityGuardService.updateSecurityGuard(
      id,
      updateDto,
      partnerId,
    );
    return { success: true, data: securityGuard };
  }

  /**
   * Delete security guard
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async deleteSecurityGuard(@Param('id') id: string, @Req() req) {
    const partnerId = req.user.role.includes(Role.ADMIN)
      ? null
      : req.user._id.toString();
    const deleted = await this.securityGuardService.deleteSecurityGuard(
      id,
      partnerId,
    );
    if (!deleted) {
      throw new NotFoundException(SECURITY_GUARD_CODES.NOT_FOUND);
    }
    return { success: true };
  }

  /**
   * Security guard login - separate endpoint
   */
  @Post('login')
  async login(@Body() loginDto: SecurityGuardLoginDto) {
    const result = await this.securityGuardService.login(loginDto);
    return { success: true, data: result };
  }

  /**
   * Get current security guard user (similar to auth/getUser)
   */
  @Get('user/me')
  @UseGuards(SecurityGuardAuthGuard)
  async getSecurityGuardUser(@Req() req) {
    return { success: true, data: req.user };
  }

  /**
   * Get security guard profile (for security guards themselves)
   */
  @Get('profile/me')
  @UseGuards(SecurityGuardAuthGuard)
  async getSecurityGuardProfile(@Req() req) {
    const securityGuard =
      await this.securityGuardService.getSecurityGuardProfile(req.user._id);
    return { success: true, data: securityGuard };
  }

  /**
   * Update security guard profile (for security guards themselves)
   */
  @Put('profile/me')
  @UseGuards(SecurityGuardAuthGuard)
  async updateSecurityGuardProfile(
    @Body() updateDto: UpdateSecurityGuardDto,
    @Req() req,
  ) {
    const securityGuard =
      await this.securityGuardService.updateSecurityGuardProfile(
        req.user._id,
        updateDto,
      );
    return { success: true, data: securityGuard };
  }
}
