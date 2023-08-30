import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
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

  @SubscribeMessage('CREATE_CHAT')
  async create(@MessageBody() createdChat: CreateChatDto) {
    console.log("createChatDto", createdChat);

    createdChat = { ...createdChat, time: new Date().toISOString() }
    // emit event for chatbox update
    this.wss.emit('CHAT', createdChat);
    // save chat in database (creating or updating corresponding conversation)
    let x = await this.chatsService.createChat(createdChat);
    // getting the info of conversation
    const conversations = await this.chatsService.getConversationsByUserId(createdChat?.senderId);
    // emit the event for conversation
    this.wss.emit('CONVERSATIONS', conversations);
  }
}
