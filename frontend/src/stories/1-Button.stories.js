import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button, ButtonType } from '../components/button/button';

export default {
  title: 'Button',
  component: Button
};

export const PrimaryButton = () => (
  <Button onClick={action('clicked')} type={ButtonType.Primary}>
    Primary Button
  </Button>
);

export const SecondaryButton = () => (
  <Button onClick={action('clicked')} type={ButtonType.Secondary}>
    Secondary Button
  </Button>
);