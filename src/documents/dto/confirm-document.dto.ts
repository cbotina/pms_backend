import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ConfirmDocumentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsOptional()
  sizeBytes?: number;
}
