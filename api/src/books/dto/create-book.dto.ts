import { IsString, IsNotEmpty, IsInt, IsPositive, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @IsPositive()
  totalCopies: number;

  @IsInt()
  @IsPositive()
  publishedYear: number;

  @IsUUID()
  genreId: string;
}

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsString()
  @IsNotEmpty()
  isbn?: string;

  @IsInt()
  @IsPositive()
  totalCopies?: number;

  @IsInt()
  @IsPositive()
  publishedYear?: number;

  @IsUUID()
  genreId?: string;
}