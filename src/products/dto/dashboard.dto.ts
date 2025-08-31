import { IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardSummaryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeProductStats?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeRevenueBreakdown?: boolean;
}

export class DashboardSummaryResponseDto {
  success: boolean;
  data: {
    // Booking Statistics
    bookingsCount: number;
    todayBookings: number;
    pendingApprovals: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;

    // Revenue Statistics
    revenueTotal: number;
    todayRevenue: number;
    averageBookingValue: number;
    revenueByStatus?: {
      paid: number;
      pending: number;
      failed: number;
      refunded: number;
    };

    // Product Statistics (if requested)
    productStats?: {
      totalProducts: number;
      activeProducts: number;
      pendingProducts: number;
      productsByType: {
        jetski: number;
        kayak: number;
        yacht: number;
        speedboat: number;
        resort: number;
      };
    };

    // User Statistics (admin only)
    userStats?: {
      totalUsers: number;
      totalPartners: number;
      newUsersThisMonth: number;
      newPartnersThisMonth: number;
    };

    // Recent Activity
    recentBookings?: Array<{
      _id: string;
      productType: string;
      totalPrice: number;
      bookingStatus: string;
      paymentStatus: string;
      startTime: Date;
      endTime: Date;
      consumerName?: string;
      partnerName?: string;
    }>;

    // Date Range
    dateRange: {
      startDate?: Date;
      endDate?: Date;
      isFiltered: boolean;
    };
  };
  message: string;
}
