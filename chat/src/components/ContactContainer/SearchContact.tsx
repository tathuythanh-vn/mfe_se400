interface SearchContactProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchContact = ({ value, onChange }: SearchContactProps) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Contacts Name ..."
        className="w-full p-2 border-b border-gray-300 bg-screen-background-400 text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchContact;
