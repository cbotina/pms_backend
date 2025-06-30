import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromoteStudentsDto {
  @ApiProperty({
    description: 'ID of the target group to promote students to',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  newGroupId: number;
}
