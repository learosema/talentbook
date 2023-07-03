import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonType } from '../../components/button/button';

import { AppShell } from '../../components/app-shell/app-shell';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppShell loginRequired={false}>
      <h2>Page not found</h2>
      <p>This is not the page you are looking for.</p>
      <Button type={ButtonType.Button} onClick={() => navigate('/')}>
        Back to start
      </Button>
    </AppShell>
  );
};
