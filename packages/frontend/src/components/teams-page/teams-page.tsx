import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SkillApi, Team, TeamType } from '../../api/skill-api';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TeamForm } from '../team-form/team-form';
import { TextInput } from '../text-input/text-input';
import { sendToast } from '../toaster/toaster';

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
  const { param } = useParams<{ param?: string }>();

  const { state, dispatch } = useAppStore();
  const { teamList } = state;

  const initialFormState = {
    name: '',
    description: '',
    homepage: '',
    tags: '',
    type: TeamType.PUBLIC,
  };

  const [teamForm, setTeamForm] = useState<Team>(initialFormState);
  const [teamErrors, setTeamErrors] = useState<Partial<Team>>({});

  useEffect(() => {
    const req = SkillApi.getTeams();
    req.send().then((data) => {
      dispatch(Actions.setTeamList(data));
    });
    return () => {
      dispatch(Actions.setTeamList([]));
      req.abort();
    };
  }, [dispatch]);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamForm.name === 'new') {
      setTeamErrors({ name: 'Invalid input' });
      return;
    }
    SkillApi.createTeam(teamForm)
      .send()
      .then(() => {
        dispatch(Actions.setTeamList([teamForm, ...teamList]));
      });
    setTeamForm(initialFormState);
    sendToast('Team created.');
  };

  return (
    <Fragment>
      <section className="teams-page">
        <h2>Teams</h2>
        <nav className="teams-page__nav">
          <ul>
            <li>
              <Link className="button" to="/teams">
                Your Teams
              </Link>
            </li>
            <li>
              <Link className="button" to="/teams/new">
                Create New Team
              </Link>
            </li>
          </ul>
        </nav>
        {param === 'new' && (
          <TeamForm
            onSubmit={handleCreateTeam}
            teamForm={teamForm}
            setTeamForm={setTeamForm}
            teamErrors={teamErrors}
          />
        )}
        {typeof param === 'undefined' && (
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
        )}
      </section>
      {typeof param === 'undefined' && (
        <section className="result-list">
          <ul className="result-list__list">
            {teamList.map((team) => (
              <TeamItem key={team.name} team={team} />
            ))}
          </ul>
        </section>
      )}
    </Fragment>
  );
};
