export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'waiting' | 'streaming' | 'success' | 'error';

export interface Message {
  role: MessageRole;
  content: string;
}
