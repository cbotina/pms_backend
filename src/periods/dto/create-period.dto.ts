import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePeriodDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @ApiProperty({
    example: '2024-A',
  })
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2024-01-01',
  })
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2024-06-01',
  })
  endDate: string;
}
