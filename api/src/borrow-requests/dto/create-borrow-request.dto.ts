import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BorrowStatus } from '@prisma/client';

export class CreateBorrowRequestDto {
  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookIds?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateBorrowRequestStatusDto {
  @IsEnum(BorrowStatus)
  status: BorrowStatus;

  @IsOptional()
  @IsDateString()
  returnedAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fineRatePerDay?: number;
}