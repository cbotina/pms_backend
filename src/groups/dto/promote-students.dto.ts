import { IsInt, IsNotEmpty } from 'class-validator';

export class PromoteStudentsDto {
  @IsInt()
  @IsNotEmpty()
  newGroupId: number;
}
