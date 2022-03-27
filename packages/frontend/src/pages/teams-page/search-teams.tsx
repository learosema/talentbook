import { useState } from 'react';
import { Team, SkillApi } from '../../client/skill-api';
import { FieldSet } from '../../components/field-set/field-set';
import { FormField } from '../../components/form-field/form-field';
import { TextInput } from '../../components/text-input/text-input';
import { TeamList } from './team-list';

export function SearchTeams() {
  const [teamFilter, setTeamFilter] = useState('');
  const [resultList, setResultList] = useState<Team[]>([]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    SkillApi.getTeams(teamFilter)
      .send()
      .then((data) => {
        setResultList(data);
        setTeamFilter('');
      });
  };
  return (
    <>
      <h2>Search Teams</h2>
      <form onSubmit={handleSearch}>
        <FieldSet legend="Search teams">
          <FormField htmlFor="filterTeams" label="Filter teams">
            <TextInput
              id="filterTeams"
              type="text"
              required
              placeHolder="search term"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            />
          </FormField>
        </FieldSet>
      </form>
      <TeamList list={resultList} />
    </>
  );
}
