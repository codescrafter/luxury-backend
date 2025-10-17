import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { QrStatus } from '../entities/booking-qr.entity';

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

export class QrVerificationResponseDto {
  success: boolean;
  message: string;
  data?: {
    booking: any;
    user: any;
    product: any;
    qrDetails: any;
  };
  error?: string;
}
