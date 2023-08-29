import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly chatsService: ChatService) {}

  afterInit(server: Server) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('USER_ID')
  async getConversations(@MessageBody() payload: { userId: string }) {
     const conversations = await this.chatsService.getConversationsByUserId(payload?.userId);
     this.wss.emit('CONVERSATIONS', conversations);
  }

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    console.log("createChatDto", createChatDto);
    this.wss.emit('receiveMessage', createChatDto);
    await this.chatsService.createChat(createChatDto);
  }
}
