import { useQuery } from '@tanstack/react-query';
import styles from './PromptModePage.module.css';
import ollama from 'ollama/browser';
import { FC, FormEvent, useRef, useState } from 'react';

export const PromptModePage: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState<string>('');

  const {
    data: reply,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['reply', prompt],
    queryFn: async () => {
      if (!prompt) return null;
      return await ollama.generate({ model: 'llama3', prompt });
    },
    staleTime: Infinity,
    retry: false,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    setPrompt(inputRef.current.value);
  };

  return (
    <main role="main" className={styles['page']}>
      <form onSubmit={handleSubmit} className={styles['prompt']}>
        <input ref={inputRef} type="text" placeholder="Enter your prompt..." />
        <button type="submit">Ask AI</button>
      </form>

      <p className={styles['reply']}>
        {isLoading && 'Waiting for reply...'}
        {isSuccess && reply?.response}
        {isError && error?.message}
      </p>
    </main>
  );
};
