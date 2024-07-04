import { useMutation } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useRef, useState } from 'react';
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
  const abortControllerRef = useRef<AbortController>();

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

      const abortController = new AbortController();
      console.log(abortControllerRef.current);
      abortControllerRef.current?.abort();
      abortControllerRef.current = abortController;

      return { signal: abortController.signal };
    },

    onSuccess: async (stream, _variables, context) => {
      if (context.signal.aborted) {
        stream.abort();
        return;
      }
      const abortStream = () => stream.abort();
      context.signal.addEventListener('abort', abortStream, { once: true });

      for await (const chunk of stream) {
        setReply((prev) => (prev ?? '') + chunk.response);
      }
      context.signal.removeEventListener('abort', abortStream);
    },
  });

  const isWaitingFirstWord = isPending && reply === undefined;
  const isReplyInProgress = isPending && reply !== undefined;

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
        <Button type="submit">Ask AI</Button>
      </form>

      <div className={styles.replyContainer}>
        {isWaitingFirstWord && <ReplyPlaceholder />}
        {isReplyInProgress && (
          <Text>
            {reply} <TypingAnimation />
          </Text>
        )}
        {isSuccess && <Text>{reply}</Text>}
        {isError && <Text className={styles.replyError}>{error?.message}</Text>}
      </div>
    </div>
  );
};
