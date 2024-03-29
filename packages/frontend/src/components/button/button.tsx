import React from 'react';

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
}

export enum ButtonKind {
  Primary = 'primary',
  Secondary = 'secondary',
  Unstyled = 'unstyled',
  Danger = 'danger',
}

export type ButtonProps = {
  type?: ButtonType;
  kind?: ButtonKind;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode
};

export const Button: React.FC<ButtonProps> = ({
  kind = ButtonKind.Primary,
  type = ButtonType.Button,
  disabled = false,
  children,
  onClick,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={[
      kind !== ButtonKind.Unstyled ? ['button',
      'button--' + kind] :[],
      className,
    ].flat()
      .join(' ')
      .trim()}
  >
    {children}
  </button>
);
