import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  SkillApi,
  Team,
  TeamDetails,
  TeamMemberRole,
} from '../../api/skill-api';
import { useAppStore } from '../../store/app.context';
import { Button, ButtonKind, ButtonType } from '../button/button';
import { TeamForm } from '../team-form/team-form';
import { sendToast } from '../toaster/toaster';

import './team-details.scss';

const TeamDetailsNav: React.FC = ({ children }) => (
  <nav className="teams-page__nav">
    <ul>
      <li>
        <Link className="button" to="/teams">
          Back
        </Link>
      </li>
      {children}
    </ul>
  </nav>
);

export const TeamDetailsPage: React.FC = () => {
  const { state } = useAppStore();
  const { identity } = state;
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [teamForm, setTeamForm] = useState<Team>({} as Team);
  // const [teamErrors, setTeamErrors] = useState<Partial<Team>>({});
  const [admin, setAdmin] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { param } = useParams<{ param?: string }>();

  useEffect(() => {
    const reqDetails = SkillApi.getTeamDetails(param || '');
    if (typeof param !== 'undefined' && param !== 'new' && param !== 'search') {
      reqDetails.send().then((data) => {
        setTeamDetails(data);
      });
    }
    return () => {
      reqDetails.abort();
    };
  }, [param]);

  useEffect(() => {
    if (identity?.name && teamDetails) {
      setTeamForm(teamDetails?.team);
      const you = teamDetails.members.filter(
        (member) => member.userName === identity.name
      );
      if (you.length === 1 && you[0].userRole === TeamMemberRole.ADMIN) {
        setAdmin(true);
      }
    }
  }, [teamDetails]);

  const toggleEditMode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (teamDetails && teamDetails.team) {
      setEditMode(!editMode);
    }
  };

  const onEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!param) {
      return;
    }
    const data: Team = {
      name: teamForm.name,
      description: teamForm.description,
      homepage: teamForm.homepage,
      tags: teamForm.tags,
      type: teamForm.type,
    };

    SkillApi.updateTeam(param, data)
      .send()
      .then(() => {
        sendToast('saved.');
        setEditMode(false);
      })
      .catch((ex) => {
        sendToast(ex.message);
      });
  };

  return (
    <Fragment>
      <section className="team-details">
        {teamDetails && teamDetails.team && (
          <Fragment>
            <h2>{teamDetails.team.name}</h2>
            <TeamDetailsNav>
              {admin && (
                <Fragment>
                  <li>
                    <Button
                      onClick={toggleEditMode}
                      kind={
                        editMode ? ButtonKind.Secondary : ButtonKind.Primary
                      }
                      type={ButtonType.Button}
                    >
                      {' '}
                      {editMode ? 'Cancel Edit' : 'Edit'}{' '}
                    </Button>
                  </li>
                </Fragment>
              )}
            </TeamDetailsNav>

            <TeamForm
              label={editMode ? 'Update team details' : 'Team details'}
              teamForm={teamForm}
              teamErrors={{}}
              setTeamForm={setTeamForm}
              onSubmit={onEditSubmit}
              readOnly={!editMode}
            />

            <h3>Members</h3>
            <ul className="team-details__members">
              {teamDetails.members.map((item) => (
                <li key={item.userName}>
                  <Link to={'/profile/' + item.userName}>{item.userName}</Link>
                </li>
              ))}
            </ul>
          </Fragment>
        )}
      </section>
    </Fragment>
  );
};
