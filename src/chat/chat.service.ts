import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Connection, Model, Types } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatInfoInterface, ConversationInfoInterface, LastMessageInfoInterface } from './chat.interface';
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
           const conversation = await this.findConversationBySenderId(chatInfo.senderId, chatInfo.receiverId);
           if(conversation) {
             console.log("find conversation");
             this.createChatInfo({
                conversationId: conversation._id,
                senderId: new Types.ObjectId(chatInfo.senderId),
                receiverId: new Types.ObjectId(chatInfo.receiverId),
                message: chatInfo.message,
                status: chatInfo.status
             })
              .then((createdChat) => {
                this.updateLastMessageInConversation(conversation._id, { 
                    message: chatInfo.message,
                    status: chatInfo.status,
                    time: createdChat.time
                });
              });
           } else {
             console.log('Could not find conversation!');
             this.createConversation({
                participants: [new Types.ObjectId(chatInfo.senderId), new Types.ObjectId(chatInfo.receiverId)],
                lastMessageInfo: {
                    message: chatInfo.message,
                    status: chatInfo.status
                }
             }).then((createdConversation) => {
                 this.createChatInfo({
                    conversationId : createdConversation._id,
                    senderId: new Types.ObjectId(chatInfo.senderId),
                    receiverId: new Types.ObjectId(chatInfo.receiverId),
                    message: chatInfo.message,
                    status: chatInfo.status
                 });
             })

           }
        } catch(error) {
            await session.abortTransaction();
        } finally {
            session.endSession();
        }

        
    }

    private async createConversation(conversationInfo: ConversationInfoInterface) {
        console.log('Creating conversation', conversationInfo);
        const createdConversation = new this.conversationModel(conversationInfo);
        return await createdConversation.save();
    }

    private async findConversationBySenderId(senderId: string, receiverId: string) {
        console.log('findConversationBySenderId', senderId);
        const conversation = await this.conversationModel.findOne({ participants: { $all: [ new Types.ObjectId(senderId), new Types.ObjectId(receiverId) ]} });
        console.log("conversation", conversation)
        return conversation ? conversation : null;
    }

    private async createChatInfo(chatInfo: ChatInfoInterface) {
       const createdChat = new this.chatModel(chatInfo);
       return await createdChat.save();
    }

    private async updateLastMessageInConversation(conversationId: Types.ObjectId, lastMessageInfo: LastMessageInfoInterface) {
        return await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { lastMessageInfo }}, { new: true }).exec();
    }

    public async getConversationsByUserId(userId: string) {
        return await this.conversationModel.find({ participants: { $in: [new Types.ObjectId(userId) ]}})
                                           .populate('participants', 'nickname')
    }

    public async getAllChats({ senderId, receiverId }: { senderId: string; receiverId: string; }) {
        return await this.chatModel.find({  
            senderId: new Types.ObjectId(senderId), 
            receiverId: new Types.ObjectId(receiverId)
        }).sort({ time: 'desc' });
    }
}
