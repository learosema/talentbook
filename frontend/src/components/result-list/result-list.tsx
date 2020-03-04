import React from 'react';
import { Link } from 'react-router-dom';

import { ResultListItem } from '../../api/skill-api';

import './result-list.scss';
import { HomeIcon } from '../svg-icons/svg-icons';

type ResultListProps = {
  resultData: ResultListItem[];
};

export const ResultList: React.FC<ResultListProps> = ({ resultData }) => {
  return (
    <div className="result-list">
      <ul className="result-list__list">
        {resultData.map(data => {
          const { user, skills } = data;
          return (
            <li key={user.name} className="list-item">
              <div className="list-item-header">
                <h4 className="list-item-header__title">
                  <Link to={'/profile/' + user.name}>{user.fullName}</Link>
                </h4>
                {user.pronouns && (
                  <div className="list-item-header__pronouns">
                    {user.pronouns}
                  </div>
                )}
                {user.location && (
                  <div className="list-item-header__location">
                    <HomeIcon />{' '}
                    <div className="list-item-header__location-text">
                      {user.location}
                    </div>
                  </div>
                )}
              </div>

              <p className="list-item__description">{user.description}</p>
              <ul className="skill-list">
                {skills.map((skill, index) => (
                  <li className="skill-list__item" key={index}>
                    {skill.skillName} (skill: {skill.skillLevel} / will{' '}
                    {skill.willLevel})
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
