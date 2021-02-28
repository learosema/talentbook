import React from 'react';
import { Link } from 'react-router-dom';
import { Team } from '../../client/skill-api';

export type TeamItemProps = {
  team: Team;
};

export const TeamItem: React.FC<TeamItemProps> = ({ team }) => (
  <li className="list-item">
    <Link to={'/team/' + encodeURIComponent(team.name)}>
      <h3>{team.name}</h3>
    </Link>
    <p>{team.description}</p>
  </li>
);
