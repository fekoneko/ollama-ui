import { useMutation } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useRef, useState } from 'react';
import { Button, CloseButton, Text, TextInput } from '@mantine/core';
import { Typing } from '@/components/Typing';
import { TextSkeleton } from '@/components/TextSkeleton';

interface Abortable {
  abort: () => void;
}

export const PromptModePage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState<string>();
  const replyStreamRef = useRef<Abortable>();

  const {
    mutate: generateReply,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationKey: ['generate'],
    mutationFn: async () => await ollama.generate({ model: 'llama3', prompt, stream: true }),

    onMutate: () => {
      setReply(undefined);
      replyStreamRef.current?.abort();
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;

      try {
        for await (const chunk of stream) {
          setReply((prev) => (prev ?? '') + chunk.response);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') throw error;
      }
    },
  });

  const isWaitingStream = isPending && reply === undefined;
  const isStreamingReply = isPending && reply !== undefined;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateReply();
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.promptContainer}>
        <TextInput
          placeholder="Enter your prompt..."
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          rightSection={<CloseButton onClick={() => setPrompt('')} />}
        />
        <Button type="submit" disabled={isWaitingStream}>
          Ask AI
        </Button>
      </form>

      <div className={styles.replyContainer}>
        {isWaitingStream && <TextSkeleton />}
        {isStreamingReply && (
          <Text className={styles.replyText}>
            {reply} {<Typing />}
          </Text>
        )}
        {isSuccess && <Text className={styles.replyText}>{reply}</Text>}
        {isError && <Text className={styles.replyError}>{error?.message}</Text>}
      </div>
    </div>
  );
};
