import React, { useState, useEffect, Fragment } from 'react';
import { SearchBox } from '../search-box/search-box';
import { ResultList } from '../result-list/result-list';
import { UserSkill } from '../../api/skill-api';

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resultData, setResultData] = useState<UserSkill[]>([]);
  useEffect(() => {
    setResultData([]);
  }, [setResultData]);
  return (
    <Fragment>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setResultData={setResultData}
      />
      <ResultList resultData={resultData} />
    </Fragment>
  );
};
