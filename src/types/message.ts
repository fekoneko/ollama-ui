export type MessageRole = "user" | "assistant";

export type MessageStatus = "pending" | "success" | "error";

export interface Message {
  role: MessageRole;
  content: string;
  status: MessageStatus;
}
