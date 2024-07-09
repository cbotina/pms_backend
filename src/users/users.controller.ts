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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from './entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { StudentIdGuard } from 'src/common/guards/student_id.guard';
import { UserIdGuard } from 'src/common/guards/user_id.guard';

// @Role(Roles.SECRETARY)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Role(Roles.STUDENT)
  @UseGuards(UserIdGuard)
  @Patch(':userId/change-password')
  changePassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(changePasswordDto, userId);
  }
}
