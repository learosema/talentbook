import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button, ButtonKind, ButtonType } from '../components/button/button';

export default {
  title: 'Button',
  component: Button
};

export const PrimaryButton = () => (
  <Button
    onClick={action('clicked')}
    type={ButtonType.Button}
    kind={ButtonKind.Primary}
    disabled={false}
  >
    Primary Button
  </Button>
);

export const SecondaryButton = () => (
  <Button
    onClick={action('clicked')}
    kind={ButtonKind.Secondary}
    type={ButtonType.Button}
    disabled={false}
  >
    Secondary Button
  </Button>
);
