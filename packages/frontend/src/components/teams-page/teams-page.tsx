import React, { Fragment, useEffect, useState } from 'react';
import { SkillApi, Team, TeamType } from '../../api/skill-api';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';

import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';

import './teams-page.scss';

export type TeamItemProps = {
  team: Team;
};

export const TeamItem: React.FC<TeamItemProps> = ({ team }) => (
  <li className="list-item">
    <h3>{team.name}</h3>
    <p>{team.description}</p>
  </li>
);

export const TeamsPage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState<string>('');

  const { state, dispatch } = useAppStore();
  const { teamList } = state;

  useEffect(() => {
    const req = SkillApi.getTeams();
    const dummyTeam: Team = {
      name: 'JavaScript-Gruppe',
      homepage: 'https://www.javascript.de',
      description: 'Testing',
      tags: 'programming',
      type: TeamType.PUBLIC,
    };
    req.send().then((data) => {
      dispatch(Actions.setTeamList([...data, dummyTeam]));
    });
    return () => {
      dispatch(Actions.setTeamList([]));
      req.abort();
    };
  }, [dispatch]);

  return (
    <Fragment>
      <section className="teams-page">
        <h2>Teams</h2>
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
      </section>
      <section className="result-list">
        <ul className="result-list__list">
          {teamList.map((team) => (
            <TeamItem key={team.name} team={team} />
          ))}
        </ul>
      </section>
    </Fragment>
  );
};
