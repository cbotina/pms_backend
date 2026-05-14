import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@ApiTags('Chat')
@Role(Roles.STUDENT)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(req.user, dto);
  }

  @Get('conversations')
  getConversations(
    @Req() req: Request & { user: JwtUser },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('subjectGroupId') subjectGroupId?: string,
  ) {
    const sg =
      subjectGroupId != null && subjectGroupId !== ''
        ? parseInt(subjectGroupId, 10)
        : undefined;
    return this.chatService.getConversations(
      req.user,
      page,
      limit,
      Number.isFinite(sg) ? sg : undefined,
    );
  }

  @Get('conversations/:id')
  getConversation(
    @Req() req: Request & { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getConversation(req.user, id);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Req() req: Request & { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getMessages(req.user, id);
  }

  @Delete('conversations/:id')
  deleteConversation(
    @Req() req: Request & { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.deleteConversation(req.user, id);
  }

  @Post('conversations/:id/messages')
  async streamMessage(
    @Req() req: Request & { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendMessageDto,
    @Res({ passthrough: false }) res: Response,
  ) {
    await this.chatService.streamMessage(req.user, id, dto, res);
  }
}
