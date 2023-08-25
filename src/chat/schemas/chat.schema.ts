import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationSchema } from './conversation.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

export type ChatDocument = Chat & Document;

@Schema({
  timestamps: true,
  versionKey: false
})
export class Chat {
  
    @Prop({ type: [{ type: Types.ObjectId, ref: ConversationSchema }], required: true })
    conversationId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: UserSchema }], required: true })
    senderId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: UserSchema }], required: true })
    receiverId: string;

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: Date, default: Date.now })
    time: string;

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
