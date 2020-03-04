import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';

import { TextInput } from '../text-input/text-input';
import { Button, ButtonType } from '../button/button';
import { SkillApi, ResultListItem } from '../../api/skill-api';

import './search-box.scss';

type SearchBoxProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setResultData: Dispatch<SetStateAction<ResultListItem[]>>;
};

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  setSearchTerm,
  setResultData
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.slice(0);
    try {
      const data = await SkillApi.query(term).send();
      setResultData(data);
    } catch (ex) {
      console.error(ex);
    }
    setSearchTerm('');
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="search-box">
      <form className="search-box__form" onSubmit={submitHandler}>
        <label htmlFor="search" className="search-box__form-label">
          Enter a skill and/or user name
        </label>
        <div className="search-box__form-row">
          <TextInput
            id="search"
            className="search-box__form-input"
            ref={inputRef}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
