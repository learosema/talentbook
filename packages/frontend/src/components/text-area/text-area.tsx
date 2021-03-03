import React from 'react';

type TextAreaProps = {
  name?: string;
  id?: string;
  rows?: number;
  className?: string;
  placeHolder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: any;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      name,
      id,
      value,
      placeHolder = '',
      onChange,
      rows,
      className = '',
      disabled = false,
      readOnly = false,
      required = false
    },
    ref
  ) => {
    return (
      <textarea
        className={'text-area ' + className}
        name={name}
        ref={ref}
        id={id}
        placeholder={placeHolder}
        rows={rows}
        onChange={onChange}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      ></textarea>
    );
  }
);
