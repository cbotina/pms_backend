import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from './entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { UserIdGuard } from 'src/common/guards/user_id.guard';
import { ApiTags } from '@nestjs/swagger';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {
  CreateUserDocs,
  GetAllUsersDocs,
  DeleteUserDocs,
  ChangePasswordDocs,
} from './users.controller.docs';
import { Tags } from '../config/swagger/swagger.constants';

@Role(Roles.SECRETARY, Roles.ADMIN)
@ApiTags(Tags.USERS)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @CreateUserDocs()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @GetAllUsersDocs()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.usersService.findAll(options, search);
  }

  @Delete(':id')
  @DeleteUserDocs()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Role(Roles.STUDENT, Roles.TEACHER)
  @UseGuards(UserIdGuard)
  @Patch(':userId/change-password')
  @ChangePasswordDocs()
  changePassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(changePasswordDto, userId);
  }
}
