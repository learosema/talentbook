import React from 'react';
import { Link } from 'react-router-dom';

import { Button, ButtonType } from '../button/button';

import './not-found-page.scss';

export const NotFoundPage: React.FC = () => (
  <div className="not-found-page">
    <h2>Page not found</h2>
    <p>This is not the page you are looking for.</p>
    <Link to="/">
      <Button type={ButtonType.Button}>Back to start</Button>
    </Link>
  </div>
);
