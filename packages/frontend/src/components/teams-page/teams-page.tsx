import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SkillApi, Team, TeamType } from '../../client/skill-api';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TeamForm } from '../team-form/team-form';
import { TeamItem } from '../team-item/team-item';
import { TextInput } from '../text-input/text-input';
import { sendToast } from '../toaster/toaster';

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
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [resultList, setResultList] = useState<Team[]>([]);
  const { param } = useParams<{ param?: string }>();
  const navigate = useNavigate();

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
    const reqMyTeams = SkillApi.getMyTeams();
    if (typeof param === 'undefined') {
      reqMyTeams.send().then((data) => {
        setTeamList(data);
      });
    }
    return () => {
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
        navigate('/teams');
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
            label="Create new team"
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
