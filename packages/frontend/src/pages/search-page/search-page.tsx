import { ResultList } from '../../components/result-list/result-list';
import { SkillApi } from '../../client/skill-api';
import { AppShell } from '../../components/app-shell/app-shell';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {

  const [params] = useSearchParams();
  const s = params.get('s');

  const searchQuery = useQuery(['search', s], async () => {
    if (!s) {
      return [];
    }
    return await SkillApi.query(s).send();
  });

  return (
    <AppShell loginRequired={true}>
      {searchQuery.isLoading ? 
        <>Loading</> :
        <ResultList resultData={searchQuery.data || []} />
      }
    </AppShell>
  );
};
