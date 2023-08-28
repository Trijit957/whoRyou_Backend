import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Connection, Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { ConversationInfoInterface } from './chat.interface';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    public async createChat(chatInfo: CreateChatDto) {
        console.log(chatInfo);

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
           const conversation: any = await this.findConversationBySenderId(chatInfo.senderId);
           if(conversation) {
             
           } else {
             console.log('Could not find conversation!');
             this.createConversation({
                participants: [chatInfo.senderId, chatInfo.receiverId],
                lastMessageInfo: {
                    message: chatInfo.message,
                    status: chatInfo.status
                }
             });
           }
        } catch(error) {
            await session.abortTransaction();
        } finally {
            session.endSession();
        }

        
    }

    private async createConversation(conversationInfo: ConversationInfoInterface) {
        console.log('Creating conversation', conversationInfo);
        try {
            const createdConversation = new this.conversationModel(conversationInfo);
            return await createdConversation.save();

        } catch(error) {
           console.log(error)
        }
    }

    private async findConversationBySenderId(senderId: string) {
        console.log('findConversationBySenderId', senderId);
        const conversation = await this.conversationModel.findOne({ participants: { $in: [ senderId ]} });
        console.log("conversation", conversation)
        return conversation ? conversation : null;
    }
}
