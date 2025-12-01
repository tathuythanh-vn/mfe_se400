import { useGetContactsQuery } from 'home/store';

import AvatarDefault from '../../assests/avatar.png';

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

const ContactItem = ({ path, fullname, managerOf }: ContactItemProps) => {
  return (
    <div className="flex gap-2 items-center">
      <img
        src={path || AvatarDefault}
        alt="avatar"
        className="w-15 h-15 aspect-square rounded-full"
      />
      <div>
        <p className="text-blue-800 w-40 font-bold">{fullname || 'Unknown'}</p>
        <p>{managerOf?.name}</p>
      </div>
    </div>
  );
};

interface ContactGroupProps {
  title: string;
  contacts: ContactItemProps[];
  searchValue?: string;
}

const ContactGroup = ({ title, contacts, searchValue }: ContactGroupProps) => {
  if (searchValue?.trim()) {
    contacts = contacts.filter((contact) =>
      contact.fullname?.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  return (
    contacts.length > 0 && (
      <div>
        <h3 className={`font-bold my-2 text-blue-800`}>{title}</h3>
        {contacts.map((contact) => (
          <ContactItem
            key={contact._id}
            path={contact.path}
            fullname={contact.fullname}
            managerOf={contact.managerOf}
          />
        ))}
      </div>
    )
  );
};

interface ContactListProps {
  searchValue: string;
}

const ContactList = ({ searchValue }: ContactListProps) => {
  const { data: response } = useGetContactsQuery();
  const contacts = response?.data;

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className={`font-bold text-blue-800 my-2`}>Danh sách liên hệ</h2>
      {contactGroups.map((contactGroup) => {
        // contactGroup: {type, title}
        if (contacts.hasOwnProperty(contactGroup.type)) {
          return (
            <ContactGroup
              title={contactGroup.title}
              contacts={contacts[contactGroup.type]}
              searchValue={searchValue}
            />
          );
        }
      })}
    </div>
  );
};

export default ContactList;
