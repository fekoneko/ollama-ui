import { useQuery } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useState } from 'react';
import { Button, CloseButton, Skeleton, Text, TextInput } from '@mantine/core';

const ReplyPlaceholder: FC = () => (
  <>
    <Text>Waiting for reply...</Text>
    <div className={styles['reply-skeleton']}>
      <Skeleton width="40%" />
      <Skeleton width="50%" />
      <Skeleton width="15%" />
      <Skeleton width="70%" />
      <Skeleton width="60%" />
    </div>
  </>
);

export const PromptModePage: FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [submitedPrompt, setSubmittedPrompt] = useState<string>('');

  const {
    data: reply,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['reply', submitedPrompt],
    queryFn: async () => {
      if (!submitedPrompt) return null;
      return await ollama.generate({ model: 'llama3', prompt: submitedPrompt });
    },
    staleTime: Infinity,
    retry: false,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedPrompt(prompt);
  };

  return (
    <div className={styles['page']}>
      <form onSubmit={handleSubmit} className={styles['prompt-container']}>
        <TextInput
          placeholder="Enter your prompt..."
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          rightSection={<CloseButton onClick={() => setPrompt('')} />}
        />
        <Button type="submit">Ask AI</Button>
      </form>

      <div className={styles['reply-container']}>
        {isLoading && <ReplyPlaceholder />}
        {isSuccess && <Text>{reply?.response}</Text>}
        {isError && <Text className={styles['reply-error']}>{error?.message}</Text>}
      </div>
    </div>
  );
};
