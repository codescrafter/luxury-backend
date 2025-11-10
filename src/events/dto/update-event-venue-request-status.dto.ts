import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventVenueRequestStatus } from '../entities/event-venue-request.entity';

export class UpdateEventVenueRequestStatusDto {
  @IsEnum(EventVenueRequestStatus)
  status: EventVenueRequestStatus;

  @IsOptional()
  @IsString()
  partnerNotes?: string;
}
