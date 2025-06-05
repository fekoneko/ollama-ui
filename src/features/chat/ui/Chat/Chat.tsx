import { useChat } from "@/features/chat/hooks/use-chat";
import { Message } from "@/features/chat/types/message";
import { ChatHeader } from "@/features/chat/ui/ChatHeader";
import { ChatMessages } from "@/features/chat/ui/ChatMessages";
import { ChatPrompt } from "@/features/chat/ui/ChatPrompt";
import { Abortable } from "@/types/abortable";
import { useMutation } from "@tanstack/react-query";
import ollama from "ollama/browser";
import { FC, useEffect, useRef, useState } from "react";
import classes from "./Chat.module.css";

export const Chat: FC = () => {
  const [prompt, setPrompt] = useState("");
  const replyStreamRef = useRef<Abortable>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const {
    model,
    messages,
    lastMessage,
    addMessage,
    appendLastMessageContent,
    updateLastMessageStatus,
    isChatSelected,
  } = useChat();

  const { mutate: generateReply } = useMutation({
    mutationKey: ["generate"],
    mutationFn: async (prompt: string) => {
      if (!model) throw new Error("Model is not selected");

      replyStreamRef.current?.abort();
      const newMessage: Message = { role: "user", content: prompt, status: "pending" };
      addMessage(newMessage);

      return await ollama.chat({
        model,
        messages: [...messages, newMessage],
        stream: true,
      });
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      updateLastMessageStatus("success");
      addMessage({ role: "assistant", content: "", status: "pending" });

      setTimeout(async () => {
        try {
          for await (const chunk of stream) {
            appendLastMessageContent(chunk.message.content);
          }
          updateLastMessageStatus("success");
        } catch (error: any) {
          updateLastMessageStatus("error");
          if (error?.name !== "AbortError") throw error;
        }
      }, 100);
    },

    onError: () => {
      updateLastMessageStatus("error");
    },
  });

  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: "smooth",
    });
  }, [lastMessage?.role]);

  const handleSend = () => {
    generateReply(prompt);
    setPrompt("");
  };

  const handleStop = () => replyStreamRef.current?.abort();

  if (!isChatSelected) return null;

  return (
    <div className={classes.pageInner}>
      <ChatHeader />
      <ChatMessages ref={chatMessagesRef} />

      <ChatPrompt
        prompt={prompt}
        setPrompt={setPrompt}
        lastMessage={lastMessage}
        onSend={handleSend}
        onStop={handleStop}
        disabled={model === undefined}
      />
    </div>
  );
};
