import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Tags } from '../config/swagger/swagger.config';
import {
  CreateTeacherDocs,
  FindAllTeachersDocs,
  FindOneTeacherDocs,
  UpdateTeacherDocs,
  RemoveTeacherDocs,
} from './teachers.controller.docs';

@Role(Roles.SECRETARY)
@ApiTags(Tags.TEACHERS)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @CreateTeacherDocs()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @FindAllTeachersDocs()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.teachersService.findAll(options, search);
  }

  @Role(Roles.TEACHER)
  @Get(':id')
  @FindOneTeacherDocs()
  findOne(@Param('id') id: number) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @UpdateTeacherDocs()
  update(@Param('id') id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @RemoveTeacherDocs()
  remove(@Param('id') id: number) {
    return this.teachersService.remove(id);
  }
}
