import { IsNotEmpty, IsString } from 'class-validator';

export class JustifyLeavingPermissionDto {
  @IsString()
  @IsNotEmpty()
  evidenceUrl: string;
}
