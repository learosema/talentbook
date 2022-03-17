import React, { useRef, useEffect } from 'react';

import { Actions } from '../../store/app.actions';
import { TextInput } from '../text-input/text-input';
import { Button, ButtonType } from '../button/button';
import { SkillApi } from '../../client/skill-api';
import { useAppStore } from '../../store/app.context';

export const SearchBox: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { search } = state;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.query.slice(0);
    try {
      const data = await SkillApi.query(term).send();
      dispatch(Actions.setSearchResult(data));
    } catch (ex: any) {
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
    <div className="search-box" role="banner">
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
