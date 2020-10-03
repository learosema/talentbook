import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SkillApi, TeamDetails } from '../../api/skill-api';

import './team-details.scss';

const TeamDetailsNav: React.FC = () => (
  <nav className="teams-page__nav">
    <ul>
      <li>
        <Link className="button" to="/teams">
          Back
        </Link>
      </li>
    </ul>
  </nav>
);

export const TeamDetailsPage: React.FC = () => {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
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

  return (
    <Fragment>
      <section className="team-details">
        {teamDetails && teamDetails.team && (
          <Fragment>
            <h2>{teamDetails.team.name}</h2>
            <TeamDetailsNav />
            <p>{teamDetails.team.description}</p>

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
