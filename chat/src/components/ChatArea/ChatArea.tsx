import { useState } from 'react';
import type { Account } from '../../pages/Chat';
import { ContactItem } from '../ContactContainer/ContactList';
import Chatbox from './Chatbox';
import { useCreateMessageMutation } from 'home/store';
import { Send } from 'lucide-react';

interface ChatAreaProps {
  currentChatUser: Account | null;
}

const ChatArea = ({ currentChatUser }: ChatAreaProps) => {
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const [messageText, setMessageText] = useState<string>('');

  if (!currentChatUser) {
    return (
      <div className="flex-2 bg-screen-background-200 flex items-center justify-center text-gray-500 text-2xl">
        Chọn 1 người để bắt đầu trò chuyện
      </div>
    );
  }

  // HANDLE SEND MESSAGE
  const onSendMessage = () => {
    const text = messageText.trim();
    if (!text || !currentChatUser._id) {
      return;
    }

    try {
      // Emit message via socket
      createMessage({ partnerId: currentChatUser._id, text: text });
    } catch (error) {
      console.error('onSendMessage: ', error);
    } finally {
      setMessageText('');
    }
  };

  return (
    <div className="flex-2 bg-screen-background-200 flex flex-col justify-between">
      <div className="bg-screen-background-200 border-b border-gray-300 p-2">
        <ContactItem
          path={currentChatUser.path}
          fullname={currentChatUser.fullname}
          managerOf={currentChatUser.managerOf}
        />
      </div>

      {/* Chat messages */}
      <Chatbox partnerId={currentChatUser._id} />

      {/* Input messages */}
      <div className="p-2 px-4 border-t border-gray-300">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Nhập nội dung tin nhắn..."
            className="w-full p-2 bg-white"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSendMessage();
              }
            }}
          />
          <button
            disabled={!messageText || isLoading}
            className="p-2 bg-blue-500 rounded text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            onClick={() => onSendMessage()}
          >
            <Send color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
