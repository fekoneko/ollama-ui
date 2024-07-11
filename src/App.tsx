import { Shell } from '@/components/Shell';
import { ChatPage } from '@/pages/ChatPage';
import { FC } from 'react';

export const App: FC = () => {
  return (
    <Shell>
      <ChatPage />
    </Shell>
  );
};
