import React, { useEffect, Fragment } from 'react';
import { SearchBox } from '../../components/search-box/search-box';
import { ResultList } from '../../components/result-list/result-list';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';

export const SearchPage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { search } = state;
  useEffect(() => {
    dispatch(Actions.setSearchResult([]));
  }, [dispatch]);
  return (
    <Fragment>
      <SearchBox />
      <ResultList resultData={search.searchResult} />
    </Fragment>
  );
};
