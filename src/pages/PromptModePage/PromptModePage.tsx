import { useMutation } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useState } from 'react';
import { Button, CloseButton, Skeleton, Text, TextInput } from '@mantine/core';

const ReplyPlaceholder: FC = () => (
  <>
    <Text>Waiting for reply...</Text>
    <div className={styles.replySkeleton}>
      <Skeleton width="40%" />
      <Skeleton width="50%" />
      <Skeleton width="15%" />
      <Skeleton width="70%" />
      <Skeleton width="60%" />
    </div>
  </>
);

export const PromptModePage: FC = () => {
  const [inputPrompt, setInputPrompt] = useState<string>('');

  const {
    data: reply,
    mutate: generateReply,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationKey: ['reply'],
    mutationFn: async (prompt: string) => await ollama.generate({ model: 'llama3', prompt }),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateReply(inputPrompt);
  };

  return (
    <div className={styles['page']}>
      <form onSubmit={handleSubmit} className={styles.promptContainer}>
        <TextInput
          placeholder="Enter your prompt..."
          autoFocus
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.currentTarget.value)}
          rightSection={<CloseButton onClick={() => setInputPrompt('')} />}
        />
        <Button type="submit">Ask AI</Button>
      </form>

      <div className={styles.replyContainer}>
        {isPending && <ReplyPlaceholder />}
        {isSuccess && <Text>{reply?.response}</Text>}
        {isError && <Text className={styles.replyError}>{error?.message}</Text>}
      </div>
    </div>
  );
};
