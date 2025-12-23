import { useLayoutEffect, useRef } from 'react';
import { Avatar } from '../ContactContainer/ContactList';
import { useGetHistoryMessageQuery } from 'home/store';

interface MessageLineProps {
  isSender?: boolean;
  message?: string;
  path?: string;
}

const MessageLine = ({
  isSender = true,
  message = 'Test message',
  path,
}: MessageLineProps) => {
  return (
    <div
      className={`flex gap-2 w-full ${isSender ? 'justify-end' : 'justify-start'}`}
    >
      {!isSender && <Avatar path={path} />}
      <div className="bg-white p-2 border shadow-sm rounded">{message}</div>
    </div>
  );
};

interface ChatboxProps {
  partnerId: string;
  partner: any;
}

interface Message {
  _id: string;
  senderId: string;
  message: string;
  status: 'read' | 'unread';
}

const Chatbox = ({ partnerId, partner }: ChatboxProps) => {
  const { data: messages } = useGetHistoryMessageQuery({
    partnerId: partnerId,
  });

  const chatAreaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (chatAreaRef.current) {
      const div = chatAreaRef.current;
      div.scrollTop = div.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1 bg-white rounded shadow-sm m-4 flex flex-col gap-4 p-4 overflow-y-auto"
      ref={chatAreaRef}
    >
      {messages?.data.map((msg: Message) => (
        <MessageLine
          key={msg._id}
          isSender={msg.senderId !== partnerId}
          message={msg.message}
          path={partner?.path}
        />
      ))}
    </div>
  );
};

export default Chatbox;
