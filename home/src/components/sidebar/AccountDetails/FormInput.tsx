interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'select';
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  className = 'flex-1',
  children,
  style,
}: FormInputProps) {
  const inputClassName =
    'outline-none h-9 rounded-lg px-2.5 border border-solid border-sidebar caret-black text-sidebar';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sidebar font-bold">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClassName}
          style={style}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassName}
        />
      )}
    </div>
  );
}
