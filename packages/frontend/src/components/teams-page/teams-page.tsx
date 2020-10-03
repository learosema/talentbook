import React, { Fragment, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { SkillApi, Team, TeamDetails, TeamType } from '../../api/skill-api';
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

const TeamItem: React.FC<TeamItemProps> = ({ team }) => (
  <li className="list-item">
    <Link to={'/team/' + encodeURIComponent(team.name)}>
      <h3>{team.name}</h3>
    </Link>
    <p>{team.description}</p>
  </li>
);

const TeamList: React.FC<{ list: Team[] }> = ({ list }) => (
  <section className="result-list">
    <ul className="result-list__list">
      {list.map((team) => (
        <TeamItem key={team.name} team={team} />
      ))}
    </ul>
  </section>
);

const TeamNav: React.FC = () => (
  <nav className="teams-page__nav">
    <ul>
      <li>
        <Link className="button" to="/teams">
          Your Teams
        </Link>
      </li>
      <li>
        <Link className="button" to="/teams/search">
          Search Teams
        </Link>
      </li>
      <li>
        <Link className="button" to="/teams/new">
          Create New Team
        </Link>
      </li>
    </ul>
  </nav>
);

export const TeamsPage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [resultList, setResultList] = useState<Team[]>([]);
  const { param } = useParams<{ param?: string }>();
  const existingTeam = typeof param !== 'undefined' && param !== 'new';
  const history = useHistory();

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
    const reqDetails = SkillApi.getTeamDetails(param || '');
    const reqMyTeams = SkillApi.getMyTeams();
    if (typeof param !== 'undefined' && param !== 'new' && param !== 'search') {
      reqDetails.send().then((data) => {
        setTeamDetails(data);
      });
    }
    if (typeof param === 'undefined') {
      reqMyTeams.send().then((data) => {
        setTeamList(data);
      });
    }
    return () => {
      reqDetails.abort();
      reqMyTeams.abort();
    };
  }, [param]);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamForm.name === 'new') {
      setTeamErrors({ name: 'Invalid input' });
      return;
    }
    SkillApi.createTeam(teamForm)
      .send()
      .then(() => {
        history.push('/teams');
      });
    setTeamForm(initialFormState);
    sendToast('Team created.');
  };

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
    <Fragment>
      <section className="teams-page">
        <h2>Teams</h2>
        <TeamNav />
        {param === 'new' && (
          <TeamForm
            onSubmit={handleCreateTeam}
            teamForm={teamForm}
            setTeamForm={setTeamForm}
            teamErrors={teamErrors}
          />
        )}
        {param === 'search' && (
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
        )}
      </section>
      {param === 'search' && <TeamList list={resultList} />}
      {typeof param === 'undefined' && <TeamList list={teamList} />}
    </Fragment>
  );
};
