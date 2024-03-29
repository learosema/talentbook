import React, { useRef, useState } from 'react';
import { TextInput } from '../text-input/text-input';
import { Button, ButtonType } from '../button/button';

export type SearchBoxProps = {
  onSubmit?: (formData: { query: string }) => void;
};

export const SearchBox: React.FC<SearchBoxProps> = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit({ query: searchQuery });
    }
    setSearchQuery('');
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="search-box">
      <form role="search" className="search-box__form wrapper" onSubmit={submitHandler}>
        <label htmlFor="search" className="search-box__form-label">
          Enter a skill and/or user name
        </label>
        <div className="search-box__form-row">
          <TextInput
            id="search"
            type="search"
            className="search-box__form-input"
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <Button type={ButtonType.Submit} className="search-box__form-submit">
            {' '}
            search{' '}
          </Button>
        </div>
      </form>
    </div>
  );
};
