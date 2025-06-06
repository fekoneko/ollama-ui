import { Message } from "@/features/chat/types/message";

export interface ChatData {
  id: string;
  model: string | null;
  messages: Message[];
}
