import { Types } from "mongoose";
export interface LastMessageInfoInterface {
    message: string;
    time?: string;
    status: MessageStatusEnum;
}

export interface ConversationInfoInterface {
    participants: Array<Types.ObjectId>;
    lastMessageInfo: LastMessageInfoInterface;
}

export interface ChatInfoInterface {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    message: string;
    status: MessageStatusEnum;
}

export enum MessageStatusEnum {
    READ = 'read', // Receiver has read the message
    NOT_READ = 'not_read', // Receiver has not read the message
    DELIVERED = 'delivered', // The message has been delivered to the receiver
    NOT_DELIVERED = 'not_delivered', // The message has not been delivered to the receiver
    SEEN = 'seen', // User has seen the message
    NOT_SEEN = 'not_seen', // User has not seen the message
}
