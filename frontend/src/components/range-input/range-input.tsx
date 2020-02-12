import React from 'react';
import './range-input.scss';

export type RangeInputProps = {
  name?: string;
  className ?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
  value?: any;
  min?: number;
  max?: number;
  step?: number;
  required ?: boolean;
  readOnly ?: boolean;
}

export const RangeInput: React.FC<RangeInputProps> = ({name, className, id, min = 0, max = 100, step = .1, value, onChange, onBlur, required, readOnly}) => (
  <input className={'range-input ' + (className||'')} name={name} id={id} type="range" min={min} max={max} step={step} onChange={onChange} onBlur={onBlur} value={value} required={required} readOnly={readOnly} />
);