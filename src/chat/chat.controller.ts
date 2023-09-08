import { Controller, Post, UseGuards, Version, Req, Body, Param, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { EventEmitter2 } from "@nestjs/event-emitter";

@UseGuards(AccessTokenGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService,
    private eventEmitter: EventEmitter2) { }

  @Version('1')
  @Post('create')
  public async createChat(@Req() request: Request, @Body() createChatDto: CreateChatDto) {
    const senderId = request.user['sub'];
    createChatDto = { ...request.body, senderId };
    return await this.chatService.createChat(createChatDto);
  }

  @Version('1')
  @Get('conversations')
  public async getConversationsByUserId(@Req() request: Request) {
    const userId = request.user['sub'];
    return await this.chatService.getConversationsByUserId(userId);
  }

  @Version('1')
  @Get('chats/:receiverId')
  public async getAllChats(@Req() request: Request, @Param('receiverId') receiverId: string): Promise<any> {
    const senderId = request.user['sub'];
    return await this.chatService.getAllChats({ senderId, receiverId });
  }

  @Version('1')
  @Post('getSse')
  getSse(@Res() response: Response, @Body() requestBody: any) {
    response.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    })
    console.log(requestBody)
    this.eventEmitter.emit("price.update", requestBody);
    return true;
  }
}
