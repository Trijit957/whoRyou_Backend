import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { LastMessageInfoInterface, MessageStatusEnum } from '../chat.interface';

export type ConversationDocument = Conversation & Document;

@Schema({
    id: false
})
export class LastMessage {

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: Date, default: Date.now })
    time: string;

    @Prop({ type: String, required: true})
    status: MessageStatusEnum;

}

const LastMessageSchema = SchemaFactory.createForClass(LastMessage);

@Schema({
  timestamps: true,
  versionKey: false
})
export class Conversation {
  
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], required: true })
  participants: Array<Types.ObjectId>;

  @Prop({ type: LastMessageSchema, required: true })
  lastMessageInfo: LastMessageInfoInterface;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
