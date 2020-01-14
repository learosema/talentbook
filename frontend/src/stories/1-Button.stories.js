import React from 'react';
// import { action } from '@storybook/addon-actions';
import { Button, ButtonType } from '../components/button';

export default {
  title: 'Button',
  component: Button,
};
/*
export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const Emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
*/

export const PrimaryButton = () => <Button type={ButtonType.Primary}>Primary Button</Button>;
export const SecondaryButton = () => <Button type={ButtonType.Secondary}>Secondary Button</Button>