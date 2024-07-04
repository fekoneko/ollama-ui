import { useMutation } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useState } from 'react';
import { Button, CloseButton, Skeleton, Text, TextInput } from '@mantine/core';
import { TypingAnimation } from '@/components/animations/TypingAnimation';

const ReplyPlaceholder: FC = () => (
  <div className={styles.replySkeleton}>
    <Skeleton width="40%" />
    <Skeleton width="55%" />
    <Skeleton width="15%" />
    <Skeleton width="70%" />
    <Skeleton width="60%" />
  </div>
);

export const PromptModePage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState<string>();
  const [isReplyCompleted, setIsReplyCompleted] = useState(false);

  const {
    data: replyStream,
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
      replyStream?.abort();
    },

    onSuccess: (stream) => {
      const readReplyStream = async () => {
        try {
          for await (const chunk of stream) {
            setReply((prev) => (prev ?? '') + chunk.response);
            setIsReplyCompleted(chunk.done);
          }
        } catch (error) {
          if (!(error instanceof Error) || error.name !== 'AbortError') throw error;
        }
      };
      readReplyStream();
    },
  });

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
        <Button type="submit" disabled={isPending}>
          Ask AI
        </Button>
      </form>

      <pre className={styles.replyContainer}>
        {isPending && <ReplyPlaceholder />}
        {isSuccess && (
          <Text>
            {reply}
            {!isReplyCompleted && <TypingAnimation />}
          </Text>
        )}
        {isError && <Text className={styles.replyError}>{error?.message}</Text>}
      </pre>
    </div>
  );
};
