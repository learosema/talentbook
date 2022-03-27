import { useQuery } from 'react-query';
import { SkillApi } from '../../client/skill-api';
import { TeamItem } from './team-list';

export function MyTeams() {
  const teamsQuery = useQuery(['my-teams'], () => SkillApi.getMyTeams().send());
  const ready = !teamsQuery.isLoading && teamsQuery.data;
  return (
    <>
      <h2>Teams</h2>
      {ready && (
        <div className="result-list">
          <ul className="result-list__list">
            {teamsQuery.data.map((team) => (
              <TeamItem key={team.name} team={team} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
