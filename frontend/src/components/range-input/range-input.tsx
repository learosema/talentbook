import React from 'react';
import './range-input.scss';

type RangeInputProps = {
  name?: string;
  id?: string;
  onChange: (e: React.ChangeEvent) => void;
  value: any;
  min: number;
  max: number;
  step: number;
}

export const RangeInput: React.FC<RangeInputProps> = ({name, id, min, max, step, value, onChange}) => (
  <input className="range-input" name={name} id={id} type="range" min={min} max={max} step={step} onChange={onChange} value={value} />
);