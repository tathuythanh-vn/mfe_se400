import React, { type Dispatch } from 'react';
import ContactList from './ContactList';
import SearchContact from './SearchContact';
import type { Account } from '../../pages/Chat';

interface ContactContainerProps {
  setCurrentChatUser?: (user: Account) => void;
}

const ContactContainer = ({ setCurrentChatUser }: ContactContainerProps) => {
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <div className="flex-1 bg-screen-background-400">
      <SearchContact value={searchValue} onChange={setSearchValue} />
      <ContactList
        searchValue={searchValue}
        setCurrentChatUser={setCurrentChatUser}
      />
    </div>
  );
};

export default ContactContainer;
