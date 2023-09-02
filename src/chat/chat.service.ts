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
        @InjectConnection() private readonly connection: Connection
    ) {}

    public async createChat(chatInfo: CreateChatDto) {

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
           const conversation = await this.findConversationBySenderId(chatInfo.senderId, chatInfo.receiverId);
           if(conversation) {
             const createdChat = await this.createChatInfo({
                conversationId: conversation._id,
                senderId: new Types.ObjectId(chatInfo.senderId),
                receiverId: new Types.ObjectId(chatInfo.receiverId),
                message: chatInfo.message,
                status: chatInfo.status,
                ...(chatInfo.time && { time: chatInfo.time })
             })
                return await this.updateLastMessageInConversation(conversation._id, { 
                    message: chatInfo.message,
                    status: chatInfo.status,
                    time: createdChat.time
                });
           } else {
             const createdConversation = await this.createConversation({
                participants: [new Types.ObjectId(chatInfo.senderId), new Types.ObjectId(chatInfo.receiverId)],
                lastMessageInfo: {
                    message: chatInfo.message,
                    status: chatInfo.status
                }
             })
                 return await this.createChatInfo({
                    conversationId : createdConversation._id,
                    senderId: new Types.ObjectId(chatInfo.senderId),
                    receiverId: new Types.ObjectId(chatInfo.receiverId),
                    message: chatInfo.message,
                    status: chatInfo.status,
                    ...(chatInfo.time && { time: chatInfo.time })
                 });

           }
        } catch(error) {
            await session.abortTransaction();
        } finally {
            session.endSession();
        }

        
    }

    private async createConversation(conversationInfo: ConversationInfoInterface) {
        const createdConversation = new this.conversationModel(conversationInfo);
        return await createdConversation.save();
    }

    private async findConversationBySenderId(senderId: string, receiverId: string) {
        const conversation = await this.conversationModel.findOne({ participants: { $all: [ new Types.ObjectId(senderId), new Types.ObjectId(receiverId) ]} });
        return conversation ? conversation : null;
    }

    private async createChatInfo(chatInfo: ChatInfoInterface) {
       const createdChat = new this.chatModel(chatInfo);
       return await createdChat.save();
    }

    private async updateLastMessageInConversation(conversationId: Types.ObjectId, lastMessageInfo: LastMessageInfoInterface) {
        return await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { lastMessageInfo }}, { new: true }).exec();
    }

    public async getAllConversations() {
        return await this.conversationModel.find().populate('participants', 'nickname').sort({ 'lastMessageInfo.time': 'desc' });
    }

    public async getConversationsByUserId(userId: string) {
        return await this.conversationModel.find({ participants: { $in: [new Types.ObjectId(userId) ]}})
                                           .populate('participants', 'nickname');
    }

    public async getAllChats({ senderId, receiverId }: { senderId: string; receiverId: string; }) {
        return await this.chatModel.find({ 
            $or: [
                {
                    senderId: new Types.ObjectId(senderId), 
                    receiverId: new Types.ObjectId(receiverId)
                },
                {
                    senderId: new Types.ObjectId(receiverId), 
                    receiverId: new Types.ObjectId(senderId)
                }
            ]
            
        }).sort({ time: 'asc' });
    }
}
