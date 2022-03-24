import React, { useState } from 'react';
import { SearchBox } from './search-box';
import { ResultList } from '../../components/result-list/result-list';
import { ResultListItem, SkillApi } from '../../client/skill-api';

export const SearchPage: React.FC = () => {
  const [searchResult, setSearchResult] = useState<ResultListItem[]>([]);

  const onSubmit = async ({ query }: { query: string }) => {
    const result = await SkillApi.query(query).send();
    setSearchResult(result);
  };

  return (
    <>
      <SearchBox onSubmit={onSubmit} />
      <ResultList resultData={searchResult} />
    </>
  );
};
