import React, { useEffect, Fragment, Dispatch } from 'react';
import { SearchBox } from '../search-box/search-box';
import { ResultList } from '../result-list/result-list';
import { Action, SearchState, Actions } from '../../store/app.reducer';

export type SearchPageProps = {
  search: SearchState;
  dispatch: Dispatch<Action<any>>;
};

export const SearchPage: React.FC<SearchPageProps> = ({ search, dispatch }) => {
  useEffect(() => {
    dispatch(Actions.setSearchResult([]));
  }, [dispatch]);
  return (
    <Fragment>
      <SearchBox search={search} dispatch={dispatch} />
      <ResultList resultData={search.searchResult} />
    </Fragment>
  );
};
