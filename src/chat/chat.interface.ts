export interface LastMessageInfoInterface {
    message: string;
    time?: string;
    status: string;
}

export interface ConversationInfoInterface {
    participants: Array<string>;
    lastMessageInfo: LastMessageInfoInterface;
}
