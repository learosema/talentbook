import React from 'react';

import '../css/button.scss';

export enum ButtonBehavior {
  Button = 'button',
  Submit = 'submit'
}

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary'
};

export type ButtonProps = {
  type: ButtonType;
  behavior: ButtonBehavior;
  disabled: boolean;
}

export const Button: React.FC<ButtonProps> = ({type=ButtonType.Primary, behavior=ButtonBehavior.Button, disabled=false, children}) => 
<button className={['button', 'button--' + type, disabled && 'button--disabled'].join(' ').trim()}>
  {children}
</button>