import React, { Fragment } from 'react';
import { ValidationErrorItem } from '@hapi/joi';

type ValidationErrorProps = {
  details: ValidationErrorItem[]|null;
}

export const ValidationErrors: React.FC<ValidationErrorProps> = (props) => (
  <Fragment>
    {props.details && (
      <ul className="form__error-list">
        {props.details.map((detail, index) => (
          <li className="form__error-item" key={index}>{detail.message}</li>
        ))}
      </ul>
    )}
  </Fragment>
)
