import React from 'react';
import { Link } from 'react-router-dom';

import { ResultListItem } from '../../client/skill-api';

type ResultListProps = {
  resultData: ResultListItem[];
};

export const ResultList: React.FC<ResultListProps> = ({ resultData }) => {
  return (
    <div className="result-list">
      <ul className="result-list__list">
        {resultData.map((data) => {
          const { user, skills } = data;
          const hasDetails = user.pronouns || user.location || user.company || user.homepage;
          return (
            <li key={user.name} className="list-item">
              <article className="list-item__article flow">
                <h4>
                  <Link to={'/profile/' + user.name}>{user.fullName}</Link>
                </h4>
                <p>{user.description}</p>
                {hasDetails && <dl className="dl">
                  {user.pronouns && <>
                    <dt>Pronouns</dt>
                    <dd>{user.pronouns}</dd>
                  </>}
                  {user.location && <>
                    <dt>Location</dt>
                    <dd>{user.location}</dd>
                  </>}
                  {user.company && <>
                    <dt>Company</dt>
                    <dd>{user.company}</dd>
                  </>}
                  {user.homepage && <>
                    <dt>Website</dt>
                    <dd><a href={user.homepage} target="_blank noreferrer">{user.homepage}</a></dd>
                  </>}
                </dl>}
                <ul className="tag-list">
                {skills.map((skill, index) => (
                  <li className="tag-list__item" key={index}>
                    <Link
                      to={
                        '/skill-details/' + encodeURIComponent(skill.skillName)
                      }
                    >
                      {skill.skillName} (skill: {skill.skillLevel} / will{' '}
                      {skill.willLevel})
                    </Link>
                  </li>
                ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
