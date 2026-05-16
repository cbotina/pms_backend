import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { DocumentsService } from './documents.service';
import { ConfirmDocumentDto } from './dto/confirm-document.dto';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@ApiTags('Documents 📄')
@Role(Roles.TEACHER)
@Controller('teacher/subject-groups/:subjectGroupId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('prepare')
  prepare(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.documentsService.prepare(req.user, subjectGroupId);
  }

  @Post(':documentId/confirm')
  confirm(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Param('documentId') documentId: string,
    @Body() dto: ConfirmDocumentDto,
  ) {
    return this.documentsService.confirm(
      req.user,
      subjectGroupId,
      documentId,
      dto,
    );
  }

  @Get()
  findAll(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.documentsService.findAll(req.user, subjectGroupId);
  }

  @Get(':documentId')
  findOne(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.findOne(req.user, subjectGroupId, documentId);
  }

  @Delete(':documentId')
  remove(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.remove(req.user, subjectGroupId, documentId);
  }
}
