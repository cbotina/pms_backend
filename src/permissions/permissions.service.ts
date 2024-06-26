import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Student } from 'src/students/entities/student.entity';
import { Group } from 'src/groups/entities/group.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  getStudentPeriodPermissions(
    periodId: number,
    studentId: number,
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Permission>> {
    const qb = this.permissionsRepository
      .createQueryBuilder('p')
      .innerJoin(Student, 's', 's.id = p.studentId')
      .innerJoin(Group, 'g', 'g.id = s.groupId')
      .where('g.periodId = :periodId', { periodId })
      .andWhere('s.id = :studentId', { studentId });

    if (search) {
      qb.andWhere('p.reason LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('p.requestDate', 'DESC');

    return paginate<Permission>(qb, options);
  }
}
