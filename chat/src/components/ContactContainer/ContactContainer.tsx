import React from 'react';
import ContactList from './ContactList';
import SearchContact from './SearchContact';

const ContactContainer = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <div className="flex-1 bg-screen-background-400">
      <SearchContact value={searchValue} onChange={setSearchValue} />
      <ContactList searchValue={searchValue} />
    </div>
  );
};

export default ContactContainer;
