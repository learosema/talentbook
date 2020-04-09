import React, { Dispatch, useRef, useEffect } from 'react';

import { TextInput } from '../text-input/text-input';
import { Button, ButtonType } from '../button/button';
import { SkillApi } from '../../api/skill-api';
import { SearchState } from '../../store/app.state';
import { Action, Actions } from '../../store/app.actions';

import './search-box.scss';

type SearchBoxProps = {
  search: SearchState;
  dispatch: Dispatch<Action<any>>;
};

export const SearchBox: React.FC<SearchBoxProps> = ({ search, dispatch }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.query.slice(0);
    try {
      const data = await SkillApi.query(term).send();
      dispatch(Actions.setSearchResult(data));
    } catch (ex) {
      console.error(ex);
    }
    dispatch(Actions.setSearchQuery(''));
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, []);
  const setSearchTerm = (term: string) =>
    dispatch(Actions.setSearchQuery(term));

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
            value={search.query}
            onChange={(e) => setSearchTerm(e.target.value)}
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
