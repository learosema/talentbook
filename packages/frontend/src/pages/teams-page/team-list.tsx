import React from 'react';
import { Link } from 'react-router-dom';
import { Team } from '../../client/skill-api';

export type TeamItemProps = {
  team: Team;
};

export const TeamList: React.FC<{ list: Team[] }> = ({ list }) => (
  <div className="result-list">
    <ul className="result-list__list">
      {list.map((team) => (
        <TeamItem key={team.name} team={team} />
      ))}
    </ul>
  </div>
);

export const TeamItem: React.FC<TeamItemProps> = ({ team }) => (
  <li className="list-item">
    <Link to={'/teams/' + encodeURIComponent(team.name)}>
      <h3>{team.name}</h3>
    </Link>
    <p>{team.description}</p>
  </li>
);
