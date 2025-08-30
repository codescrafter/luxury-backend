import { IsString, IsNotEmpty } from 'class-validator';

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
