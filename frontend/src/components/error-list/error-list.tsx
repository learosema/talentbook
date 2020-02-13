import React, { Fragment } from 'react';

import './error-list.scss';

export interface ErrorItem {
  message: string;
}

type ErrorListProps = {
  details: ErrorItem[] | null;
};

export const ErrorList: React.FC<ErrorListProps> = props => (
  <Fragment>
    {props.details && (
      <ul className="error-list">
        {props.details.map((detail, index) => (
          <li className="error-list__item" key={index}>
            {detail.message}
          </li>
        ))}
      </ul>
    )}
  </Fragment>
);
