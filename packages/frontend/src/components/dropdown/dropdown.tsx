import React from 'react';

type DropdownProps = {
  name?: string;
  id?: string;
  className?: string;
  placeHolder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: any;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  id,
  value,
  placeHolder = '',
  onChange,
  className = '',
  disabled = false,
  required = false,
  children,
}) => {
  return (
    <select
      className={'dropdown ' + className}
      name={name}
      id={id}
      placeholder={placeHolder}
      onChange={onChange}
      value={value}
      disabled={disabled}
      required={required}
    >
      {children}
    </select>
  );
};
