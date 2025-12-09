import type { Account } from '../../pages/Chat';
import { ContactItem } from '../ContactContainer/ContactList';
import Chatbox from './Chatbox';
import { useCreateMessageMutation } from 'home/store';

interface ChatAreaProps {
  currentChatUser: Account | null;
}

const ChatArea = ({ currentChatUser }: ChatAreaProps) => {
  const [createMessage, { data }] = useCreateMessageMutation();

  if (!currentChatUser) {
    return (
      <div className="flex-2 bg-screen-background-200 flex items-center justify-center text-gray-500 text-2xl">
        Chọn 1 người để bắt đầu trò chuyện
      </div>
    );
  } else {
    console.log('Current Chat User:', currentChatUser);
  }

  // HANDLE SEND MESSAGE
  const onSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const text = e.currentTarget.value.trim();
    if (!text || !currentChatUser._id) {
      return;
    }

    try {
      // Emit message via socket
      createMessage({ partnerId: currentChatUser._id, text: text });
      console.log('Message sent response:', data);
    } catch (error) {
      console.error('onSendMessage: ', error);
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
        <input
          type="text"
          placeholder="Nhập nội dung tin nhắn..."
          className="w-full p-2 bg-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSendMessage(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatArea;
