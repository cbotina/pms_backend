import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PermissionStatus } from '../entities/permission.entity';

export class UpdatePermissionDto {
  @IsOptional()
  @IsDateString()
  approvalDate?: Date;

  @IsOptional()
  @IsString()
  principalNote?: string;

  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;
}
