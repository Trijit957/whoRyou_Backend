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
   // console.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
   // console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('GET_CONVERSATIONS')
  async getConversations() {
     const conversations = await this.chatsService.getAllConversations();
     this.wss.emit('SEND_CONVERSATIONS', conversations);
  }

  @SubscribeMessage('CREATE_CHAT')
  async create(@MessageBody() createdChat: CreateChatDto) {

    createdChat = { ...createdChat, time: new Date().toISOString() }
    // emit event for chatbox update
    this.wss.emit('SEND_CHAT', createdChat);
    // save chat in database (creating or updating corresponding conversation)
    await this.chatsService.createChat(createdChat);
    // getting the info of conversation
    const conversations = await this.chatsService.getAllConversations();
    // emit the event for conversation
    this.wss.emit('SEND_CONVERSATIONS', conversations);
  }

  @SubscribeMessage('TYPING')
  async handleTypingStatus(@MessageBody() payload : { senderId: string; receiverId: string; }) {
    this.wss.emit('ON_TYPING', payload);
  }

}
