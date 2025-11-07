import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { QrStatus } from '../entities/booking-qr.entity';
import { BookingStatus, PaymentStatus } from '../entities/booking.entity';

export class VerifyQrDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class GenerateQrDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}

export class GetPartnerQrCodesQueryDto {
  @IsOptional()
  @IsEnum(QrStatus)
  status?: QrStatus;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

// Types for QR Verification Response
export interface QrDetails {
  token: string;
  status: QrStatus;
  redeemedAt: Date;
  startTime: Date;
  endTime: Date;
}

export interface BookingData {
  _id: string;
  consumerId: string | UserData;
  productId: string;
  productType: string;
  partnerId: string | UserData;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  specialRequests?: string;
  bookingStatus: BookingStatus;
  cancellationReason?: string;
  adultsCount?: number;
  childrenCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role?: string[];
  avatar?: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Base product interface - all products share common fields
export interface BaseProductData {
  _id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  type: string;
  isRental?: boolean;
  isEventProperty?: boolean;
  pricePerHour: number;
  pricePerDay: number;
  securityDeposit: number;
  fuelIncluded?: boolean;
  insuranceIncluded?: boolean;
  licenseRequired?: boolean;
  ageRequirement: number;
  cancellationPolicyEn: string[];
  cancellationPolicyAr: string[];
  termsAndConditionsEn: string[];
  termsAndConditionsAr: string[];
  images: string[];
  videos?: string[];
  tagsEn?: string[];
  tagsAr?: string[];
  ownerId: string | UserData;
  lat: number;
  lng: number;
  cityEn: string;
  cityAr: string;
  regionEn: string;
  regionAr: string;
  countryEn: string;
  countryAr: string;
  addressEn: string;
  addressAr: string;
  averageRating?: number;
  reviewCount?: number;
  totalBookings?: number;
  isFeatured?: boolean;
  status?: 'pending' | 'approved' | 'revision' | 'rejected';
  resubmissionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Product-specific types (extend base product)
export interface JetskiProductData extends BaseProductData {
  engineType: string;
  enginePower: string;
  maxSpeed: number;
  capacity: number;
  brand: string;
  modelYear?: number;
  jetskiType?: string;
  color?: string;
  lifeJacketsIncluded?: boolean;
  minimumHours?: number;
  maintenanceNotes?: string;
}

export interface KayakProductData extends BaseProductData {
  kayakType?: string;
  material?: string;
  weight?: number;
  capacity: number;
  length?: number;
  width?: number;
  paddlesIncluded?: boolean;
  minimumHours?: number;
}

export interface YachtProductData extends BaseProductData {
  yachtType?: string;
  length?: number;
  width?: number;
  capacity: number;
  bedrooms?: number;
  bathrooms?: number;
  crewIncluded?: boolean;
  minimumHours?: number;
  amenities?: string[];
}

export interface SpeedboatProductData extends BaseProductData {
  engineType?: string;
  enginePower?: string;
  maxSpeed: number;
  capacity: number;
  brand?: string;
  modelYear?: number;
  speedboatType?: string;
  minimumHours?: number;
}

export interface ResortProductData extends BaseProductData {
  resortType?: string;
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[];
  rooms?: number;
  minimumNights?: number;
}

// Union type for all product types
export type ProductData =
  | JetskiProductData
  | KayakProductData
  | YachtProductData
  | SpeedboatProductData
  | ResortProductData
  | BaseProductData;

// Data returned from verifyQrToken service method
export interface QrVerificationData {
  booking: BookingData;
  user: UserData;
  product: ProductData;
  qrDetails: QrDetails;
}

// Complete response type from verifyQrForSecurityGuard endpoint
export interface QrVerificationResponseDto {
  success: boolean;
  message: string;
  data: QrVerificationData;
  error?: string;
}
