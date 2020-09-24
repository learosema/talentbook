import React, { Fragment, useEffect, useState } from 'react';
import { SkillApi, Team, TeamType } from '../../api/skill-api';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';
import { Button, ButtonType } from '../button/button';
import { Dropdown } from '../dropdown/dropdown';

import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextArea } from '../text-area/text-area';
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

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    homepage: '',
    tags: '',
    type: TeamType.PUBLIC,
  });

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

  const getTeamType = (str: string) => {
    const types: Record<string, TeamType> = {
      public: TeamType.PUBLIC,
      closed: TeamType.CLOSED,
      secret: TeamType.SECRET,
    };
    return str in types ? types[str] : TeamType.PUBLIC;
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Fragment>
      <section className="teams-page">
        <h2>Teams</h2>
        <form onSubmit={handleCreateTeam}>
          <FieldSet legend="Create new Team">
            <FormField htmlFor="teamName" label="Team Name">
              <TextInput
                id="teamName"
                type="text"
                required
                placeHolder="JavaScript group"
                value={teamForm.name}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, name: e.target.value })
                }
              />
            </FormField>

            <FormField htmlFor="teamDescription" label="Description">
              <TextArea
                id="teamDescription"
                required
                placeHolder="Description"
                value={teamForm.description}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, description: e.target.value })
                }
              />
            </FormField>

            <FormField htmlFor="teamHomePage" label="Home page">
              <TextInput
                id="teamHomePage"
                type="text"
                required
                placeHolder="https://"
                value={teamForm.homepage}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, homepage: e.target.value })
                }
              />
            </FormField>

            <FormField htmlFor="teamTags" label="Tags">
              <TextInput
                id="teamTags"
                type="text"
                required
                placeHolder="engineering, javascript, ..."
                value={teamForm.tags}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, tags: e.target.value })
                }
              />
            </FormField>
            <FormField htmlFor="teamType" label="Team Type">
              <Dropdown
                id="teamType"
                value={teamForm.type}
                onChange={(e) =>
                  setTeamForm({
                    ...teamForm,
                    type: getTeamType(e.target.value),
                  })
                }
              >
                <option>public</option>
                <option>closed</option>
                <option>secret</option>
              </Dropdown>
            </FormField>

            <Button type={ButtonType.Submit}>Create New Team</Button>
          </FieldSet>
        </form>
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
