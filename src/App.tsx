import ollama from 'ollama/browser';
import { FC, FormEvent, useState } from 'react';
import styles from './App.module.css';

export const App: FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>();

  const askAi = async (prompt: string) => {
    setResponse(undefined);
    const newResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: prompt }],
    });
    setResponse(newResponse.message.content);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    askAi(prompt);
  };

  return (
    <div className={styles['chat-container']}>
      <p className={styles['chat']}>{response}</p>

      <form onSubmit={handleSubmit} className={styles['prompt']}>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Enter your prompt..."
        />
        <button type="submit">Ask AI</button>
      </form>
    </div>
  );
};
