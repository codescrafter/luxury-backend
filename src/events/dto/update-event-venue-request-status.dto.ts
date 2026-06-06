import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventVenueRequestStatus } from '../entities/event-venue-request.entity';
import { EVENT_CODES } from '../../i18n/namespaces/event.namespace';

export class UpdateEventVenueRequestStatusDto {
  @IsEnum(EventVenueRequestStatus, { message: EVENT_CODES.FIELD_REQUIRED })
  status: EventVenueRequestStatus;

  @IsOptional()
  @IsString()
  partnerNotes?: string;
}
