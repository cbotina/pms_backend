import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, PermissionStatus } from './entities/permission.entity';
import { Brackets, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Student } from 'src/students/entities/student.entity';
import { Group } from 'src/groups/entities/group.entity';
import { PermissionWithStudentView } from './dto/permission-with-student.view';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectRepository(PermissionWithStudentView)
    private readonly permissionsWithStudentRepository: Repository<PermissionWithStudentView>,
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

  getPeriodPermissions(
    periodId: number,
    options: IPaginationOptions,
    search?: string,
    status?: PermissionStatus,
  ): Promise<Pagination<PermissionWithStudentView>> {
    const qb = this.permissionsWithStudentRepository
      .createQueryBuilder('p')
      .where('p.periodId = :periodId', { periodId });

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('p.student like :search', { search: `%${search}%` })
            .orWhere('p.requestDate like :search', { search: `%${search}%` })
            .orWhere('p.reason like :search', { search: `%${search}%` });
        }),
      );
    }

    if (status) {
      qb.andWhere('p.status = :status', { status });
    }

    return paginate<PermissionWithStudentView>(qb, options);
  }

  async updatePermission(
    permissionId: number,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    const existingPermission = await this.permissionsRepository.findOneByOrFail(
      {
        id: permissionId,
      },
    );

    const permissionData = this.permissionsRepository.merge(
      existingPermission,
      updatePermissionDto,
    );

    return await this.permissionsRepository.save(permissionData);
  }

  getPermission(permissionId: number) {
    return this.permissionsRepository.findOneOrFail({
      where: {
        id: permissionId,
      },
      relations: {
        student: true,
      },
    });
  }
}
