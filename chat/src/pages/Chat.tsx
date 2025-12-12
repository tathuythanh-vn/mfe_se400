import { useState } from 'react';
import ChatArea from '../components/ChatArea/ChatArea';
import ContactContainer from '../components/ContactContainer/ContactContainer';

export interface Account {
  _id: string;
  email: string;
  phone: string;
  path: string;
  fullname: string;
  birthday: string;
  password: string;
  role: 'ADMIN' | 'MEMBER' | 'MANAGER';

  // /* ---- Thêm infoMember chuẩn kiểu ---- */
  // infoMember?: InfoMember | null;

  managerOf?: {
    name: string;
  };
}

const Chat = () => {
  const [currentChatUser, setCurrentChatUser] = useState<Account | null>(null);

  const handleCurrentChatUserUpdate = (user: Account) => {
    setCurrentChatUser(user);
  };

  return (
    <div className="h-svh flex">
      <ChatArea currentChatUser={currentChatUser} />
      <ContactContainer setCurrentChatUser={handleCurrentChatUserUpdate} />
    </div>
  );
};

export default Chat;
