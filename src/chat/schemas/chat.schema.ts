import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Transform } from 'class-transformer';
import { MessageStatusEnum } from '../chat.interface';

export type ChatDocument = Chat & Document;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Chat {
  
    @Prop({ type: Types.ObjectId, ref: Conversation.name, required: true })
    conversationId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    senderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    receiverId: Types.ObjectId;

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: Date, default: Date.now })
    time: string;

    @Prop({ type: String, required: true })
    status: MessageStatusEnum;

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
