import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateGenreDto {
  @IsString()
  @IsNotEmpty()
  name?: string;
}