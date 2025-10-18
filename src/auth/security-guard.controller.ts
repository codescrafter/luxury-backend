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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guards';
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
    try {
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
        message:
          'Security guard created successfully. Credentials have been sent via email and SMS.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create security guard',
        error: error.message,
      };
    }
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
    try {
      // Partners can only view their own security guards
      if (
        req.user.role.includes(Role.PARTNER) &&
        req.user._id.toString() !== partnerId
      ) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const result =
        await this.securityGuardService.getSecurityGuardsForPartner(
          partnerId,
          query,
        );
      return {
        success: true,
        data: result,
        message: 'Security guards retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get security guards',
        error: error.message,
      };
    }
  }

  /**
   * Get security guard by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async getSecurityGuardById(@Param('id') id: string, @Req() req) {
    try {
      // For admins, they can view any security guard, for partners, only their own
      const partnerId = req.user.role.includes(Role.ADMIN)
        ? null // Admin can view any security guard
        : req.user._id.toString(); // Partners can only view their own security guards

      const securityGuard =
        await this.securityGuardService.getSecurityGuardById(id, partnerId);
      return {
        success: true,
        data: securityGuard,
        message: 'Security guard retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get security guard',
        error: error.message,
      };
    }
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
    try {
      // For admins, they can update any security guard, for partners, only their own
      const partnerId = req.user.role.includes(Role.ADMIN)
        ? null // Admin can update any security guard
        : req.user._id.toString(); // Partners can only update their own security guards

      const securityGuard = await this.securityGuardService.updateSecurityGuard(
        id,
        updateDto,
        partnerId,
      );
      return {
        success: true,
        data: securityGuard,
        message: 'Security guard updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update security guard',
        error: error.message,
      };
    }
  }

  /**
   * Delete security guard
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async deleteSecurityGuard(@Param('id') id: string, @Req() req) {
    try {
      // For admins, they can delete any security guard, for partners, only their own
      const partnerId = req.user.role.includes(Role.ADMIN)
        ? null // Admin can delete any security guard
        : req.user._id.toString(); // Partners can only delete their own security guards

      const deleted = await this.securityGuardService.deleteSecurityGuard(
        id,
        partnerId,
      );

      if (!deleted) {
        throw new HttpException(
          'Security guard not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Security guard deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete security guard',
        error: error.message,
      };
    }
  }

  /**
   * Security guard login - separate endpoint
   */
  @Post('login')
  async login(@Body() loginDto: SecurityGuardLoginDto) {
    try {
      const result = await this.securityGuardService.login(loginDto);
      return {
        success: true,
        data: {
          token: result.token,
          securityGuard: result.securityGuard,
        },
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
    }
  }

  /**
   * Get security guard profile (for security guards themselves)
   */
  @Get('profile/me')
  @UseGuards(AuthGuard('jwt'))
  async getSecurityGuardProfile(@Req() req) {
    try {
      // Check if the request is from a security guard
      if (req.user.type !== 'security_guard') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const securityGuard =
        await this.securityGuardService.getSecurityGuardProfile(req.user.id);
      return {
        success: true,
        data: securityGuard,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get profile',
        error: error.message,
      };
    }
  }

  /**
   * Update security guard profile (for security guards themselves)
   */
  @Put('profile/me')
  @UseGuards(AuthGuard('jwt'))
  async updateSecurityGuardProfile(
    @Body() updateDto: UpdateSecurityGuardDto,
    @Req() req,
  ) {
    try {
      // Check if the request is from a security guard
      if (req.user.type !== 'security_guard') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const securityGuard =
        await this.securityGuardService.updateSecurityGuardProfile(
          req.user.id,
          updateDto,
        );
      return {
        success: true,
        data: securityGuard,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }
}
