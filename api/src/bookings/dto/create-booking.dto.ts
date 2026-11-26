import { IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  spaceId: string;

  @IsString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}