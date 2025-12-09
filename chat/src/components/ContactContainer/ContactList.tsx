import { useGetContactsQuery } from 'home/store';

import AvatarDefault from '../../assests/avatar.png';
import type { Account } from '../../pages/Chat';

const contactGroups = [
  {
    type: 'admin',
    title: 'Quản trị viên',
  },
  {
    type: 'managers',
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
  managerOf?: {
    name: string;
  };
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
  setCurrentChatUser,
}: ContactItemProps & {
  setCurrentChatUser?: (user: Account) => void;
}) => {
  return (
    <div
      className="flex gap-2 items-center hover:cursor-pointer hover:bg-blue-100 p-2 rounded-md"
      onClick={
        setCurrentChatUser &&
        (() => setCurrentChatUser({ path, fullname, managerOf } as Account))
      }
    >
      <Avatar path={path} />
      <div>
        <p className="text-blue-800 w-40 font-bold">{fullname || 'Unknown'}</p>
        <p>{managerOf?.name}</p>
      </div>
    </div>
  );
};

interface ContactGroupProps {
  title: string;
  contacts: Account[];
  searchValue?: string;
  setCurrentChatUser?: (user: Account) => void;
}

const ContactGroup = ({
  title,
  contacts,
  searchValue,
  setCurrentChatUser,
}: ContactGroupProps) => {
  if (searchValue?.trim()) {
    contacts = contacts.filter((contact) =>
      contact.fullname?.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  return (
    contacts.length > 0 && (
      <div>
        <h3 className={`font-bold my-2 text-blue-800`}>{title}</h3>
        {contacts.map((contact) => {
          // BACKEND RETURN MIGHT NULL SO HANDLE NULL CONTACTS
          if (contact) {
            return (
              <ContactItem
                key={contact._id}
                {...contact}
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
