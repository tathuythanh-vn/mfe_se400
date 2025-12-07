import { Avatar } from '../ContactContainer/ContactList';

export interface ChatboxProps {
  messages?: Array<{
    senderId: string;
    message: string;
    status: 'read' | 'unread';
  }>;
}

interface MessageLineProps {
  isSender?: boolean;
  message?: string;
}

const MessageLine = ({
  isSender = true,
  message = 'Test message',
}: MessageLineProps) => {
  return (
    <div
      className={`flex gap-2 w-full ${isSender ? 'justify-end' : 'justify-start'}`}
    >
      {!isSender && <Avatar />}
      <div className="bg-white p-2 border shadow-sm rounded">{message}</div>
      {isSender && <Avatar />}
    </div>
  );
};

const Chatbox = () => {
  return (
    <div className="flex-1 bg-white rounded shadow-sm m-4 flex flex-col gap-4 p-4 overflow-y-auto">
      <MessageLine isSender={true} message="Hello!" />
      <MessageLine isSender={false} message="Hi there!" />
      <MessageLine />
      <MessageLine />
      <MessageLine />
      <MessageLine />
    </div>
  );
};

export default Chatbox;
