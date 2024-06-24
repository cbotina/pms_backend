import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectGroupTimeSlotDto } from './create-subject-group-time-slot.dto';

export class UpdateSubjectGroupTimeSlotDto extends PartialType(CreateSubjectGroupTimeSlotDto) {}
