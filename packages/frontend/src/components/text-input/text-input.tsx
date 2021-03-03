import React from 'react';

type TextInputProps = {
  name?: string;
  id?: string;
  className?: string;
  placeHolder?: string;
  type?: string;
  list?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoCapitalize?: string;
  autoCorrect?: string;
  autoComplete?: string;
  spellCheck?: boolean;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      id,
      type = 'text',
      list,
      value,
      placeHolder = '',
      onChange,
      className = '',
      disabled = false,
      readOnly = false,
      required = false,
      autoCapitalize = undefined,
      autoComplete = undefined,
      spellCheck = false,
      autoCorrect = undefined
    },
    ref
  ) => {
    return (
      <input
        className={'text-input ' + className}
        name={name}
        ref={ref}
        id={id}
        type={type}
        list={list}
        placeholder={placeHolder}
        onChange={onChange}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
      />
    );
  }
);
