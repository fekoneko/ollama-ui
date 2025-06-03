import { useChat } from "@/features/chat/hooks/use-chat";
import { Message } from "@/features/chat/types/message";
import { ChatBottomBar } from "@/features/chat/ui/ChatBottomBar";
import { ChatHeader } from "@/features/chat/ui/ChatHeader";
import { ChatMessages } from "@/features/chat/ui/ChatMessages";
import { Abortable } from "@/types/abortable";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import ollama from "ollama/browser";
import { FC, useEffect, useRef, useState } from "react";
import classes from "./Chat.module.css";

export const ChatPage: FC = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useLocalStorage<string | undefined>({ key: "model" });
  const replyStreamRef = useRef<Abortable>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    lastMessage,
    addMessage,
    appendLastMessageContent,
    updateLastMessageStatus,
    clearMessages,
  } = useChat(model);

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

      try {
        for await (const chunk of stream) {
          appendLastMessageContent(chunk.message.content);
        }
        updateLastMessageStatus("success");
      } catch (error: any) {
        updateLastMessageStatus("error");
        if (error?.name !== "AbortError") throw error;
      }
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

  return (
    <div className={classes.page}>
      <div className={classes.pageInner}>
        <ChatHeader
          model={model}
          setModel={setModel}
          onClear={clearMessages}
          disabledSelectModel={lastMessage?.status === "pending"}
        />
        <ChatMessages ref={chatMessagesRef} messages={messages} />

        <ChatBottomBar
          prompt={prompt}
          setPrompt={setPrompt}
          lastMessage={lastMessage}
          onSend={handleSend}
          onStop={handleStop}
          disabled={model === undefined}
        />
      </div>
    </div>
  );
};
