import {
  useGetContactsQuery,
  useGetProfileQuery,
  useGetChapterByIdQuery,
} from 'home/store';

import AvatarDefault from '../../assests/avatar.png';
import type { Account } from '../../pages/Chat';

const contactGroups = [
  {
    type: 'admin',
    title: 'Quản trị viên',
  },
  {
    type: 'manager',
    title: 'Quản lý chi đoàn',
  },
  {
    type: 'members',
    title: 'Đoàn viên',
  },
];

interface ContactItemProps {
  path?: string;
  fullname?: string;
  _id?: string;
  managerOf?: string;
}

export const Avatar = ({ path }: { path?: string }) => {
  return (
    <img
      src={path || AvatarDefault}
      alt="avatar"
      className="w-12 h-12 aspect-square rounded-full"
    />
  );
};

export const ContactItem = ({
  path,
  fullname,
  managerOf,
  _id,
  setCurrentChatUser,
}: ContactItemProps & {
  setCurrentChatUser?: (user: Account) => void;
}) => {
  if (managerOf) {
    const { data: chapterRes } = useGetChapterByIdQuery(managerOf);
    managerOf = chapterRes?.data.name;
  }

  return (
    <div
      className="flex gap-2 items-center hover:cursor-pointer hover:bg-blue-100 p-2 rounded-md"
      onClick={
        setCurrentChatUser &&
        (() =>
          setCurrentChatUser({ path, fullname, managerOf, _id } as Account))
      }
    >
      <Avatar path={path} />
      <div>
        <p className="text-blue-800 w-40 font-bold">{fullname || 'Unknown'}</p>
        <p>{managerOf}</p>
      </div>
    </div>
  );
};

interface ContactGroupProps {
  title: string;
  contacts: Account[] | Account;
  searchValue?: string;
  setCurrentChatUser?: (user: Account) => void;
}

const ContactGroup = ({
  title,
  contacts,
  searchValue,
  setCurrentChatUser,
}: ContactGroupProps) => {
  let filteredContacts = Array.isArray(contacts) ? contacts : [contacts];

  if (searchValue?.trim()) {
    filteredContacts = filteredContacts.filter((contact) =>
      contact.fullname?.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  const { data } = useGetProfileQuery();
  const userId = data?.data?._id;

  return (
    filteredContacts.length > 0 && (
      <div>
        <h3 className={`font-bold my-2 text-blue-800`}>{title}</h3>
        {filteredContacts.map((contact) => {
          // HANDLE NULL CONTACTS + CURRENT USER
          if (contact && contact._id !== userId) {
            return (
              <ContactItem
                key={contact._id}
                path={contact.avatar?.path}
                fullname={contact.fullname}
                managerOf={contact.managerOf as any}
                _id={contact._id}
                setCurrentChatUser={setCurrentChatUser}
              />
            );
          }
        })}
      </div>
    )
  );
};

interface ContactListProps {
  searchValue: string;
  setCurrentChatUser?: (user: Account) => void;
}

const ContactList = ({ searchValue, setCurrentChatUser }: ContactListProps) => {
  const { data: response } = useGetContactsQuery();
  const contacts = response?.data;

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className={`font-bold text-blue-800 my-2`}>Danh sách liên hệ</h2>
      {contactGroups.map((contactGroup) => {
        if (contacts && contacts.hasOwnProperty(contactGroup.type)) {
          return (
            <ContactGroup
              key={contactGroup.type}
              title={contactGroup.title}
              contacts={contacts[contactGroup.type]}
              searchValue={searchValue}
              setCurrentChatUser={setCurrentChatUser}
            />
          );
        }
      })}
    </div>
  );
};

export default ContactList;
