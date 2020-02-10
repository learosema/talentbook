import React from 'react';

import './button.scss';

export enum ButtonBehavior {
  Button = 'button',
  Submit = 'submit'
}

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary'
};

export type ButtonProps = {
  type?: ButtonType;
  behavior?: ButtonBehavior;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({type=ButtonType.Primary, behavior=ButtonBehavior.Button, disabled=false, children, onClick, className = ''}) => 
<button onClick={onClick} className={['button', 'button--' + type, disabled && 'button--disabled', className].join(' ').trim()}>
  {children}
</button>