import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  Button,
  ButtonType,
  ButtonBehavior
} from '../components/button/button';

export default {
  title: 'Button',
  component: Button
};

export const PrimaryButton = () => (
  <Button
    onClick={action('clicked')}
    type={ButtonType.Primary}
    behavior={ButtonBehavior.Button}
    disabled={false}
  >
    Primary Button
  </Button>
);

export const SecondaryButton = () => (
  <Button
    onClick={action('clicked')}
    type={ButtonType.Secondary}
    behavior={ButtonBehavior.Button}
    disabled={false}
  >
    Secondary Button
  </Button>
);
