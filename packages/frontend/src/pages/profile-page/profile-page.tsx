import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SkillApi } from '../../client/skill-api';
import { RangeInput } from '../../components/range-input/range-input';
import { FieldSet } from '../../components/field-set/field-set';
import { SkillTable } from '../../components/skill-table/skill-table';
import { SocialLinks } from '../../components/social-links/social-links';
import {
  HomeIcon,
  CompanyIcon,
  GlobeIcon,
} from '../../components/svg-icons/svg-icons';

import { useAppStore } from '../../store/app.context';
import { useQuery } from 'react-query';

export const ProfilePage: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const { state } = useAppStore();
  const { identity } = state;
  const navigate = useNavigate();
  const authorized: boolean = Boolean(identity && identity.name && name);
  

  const userQuery = useQuery(['user', name], () =>
    SkillApi.getUser(name!).send(),
    {enabled: authorized}
  );
  const skillsQuery = useQuery(['userskills', name], () =>
    SkillApi.getUserSkills(name!).send()
  , {
    enabled: authorized
  });

  if (! authorized) {
    navigate('/');
    return <></>;
  }

  const { data: userData } = userQuery;
  const { data: userSkills } = skillsQuery;

  return userData && userSkills ? (
    <>
      <div className="profile-page">
        <div className="profile-header">
          <h2 className="profile-header__title">{userData.fullName}</h2>
          {userData.pronouns && (
            <div className="profile-header__pronouns">{userData.pronouns}</div>
          )}
        </div>

        <FieldSet legend="User details">
          <p className="description">{userData.description}</p>
          {userData.location && (
            <div className="location">
              <HomeIcon />{' '}
              <div className="location__text">{userData.location}</div>
            </div>
          )}
          {userData.company && (
            <div className="company">
              <CompanyIcon />{' '}
              <div className="company__text">{userData.company}</div>
            </div>
          )}
          {userData.homepage && (
            <div className="website">
              <GlobeIcon />{' '}
              <div className="website__text">
                <a
                  href={userData.homepage}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {userData.homepage}
                </a>
              </div>
            </div>
          )}
          <SocialLinks
            githubUser={userData.githubUser}
            twitterHandle={userData.twitterHandle}
          />
        </FieldSet>

        <FieldSet legend="Skills">
          <SkillTable editMode={false}>
            {userSkills.map((skill, i) => (
              <tr key={skill.skillName}>
                <td className="skill-table__skill-name">
                  <Link
                    to={'/skill-details/' + encodeURIComponent(skill.skillName)}
                  >
                    {skill.skillName}
                  </Link>
                </td>
                <td className="skill-table__skill">
                  <label htmlFor={'skillSlider' + i}>skill:</label>
                  <RangeInput
                    id={'skillSlider' + i}
                    className="form__table-range"
                    required
                    min={0}
                    max={5}
                    step={1}
                    value={skill.skillLevel}
                    readOnly
                  />
                </td>
                <td className="skill-table__skill-number">
                  {skill.skillLevel}
                </td>

                <td className="skill-table__will">
                  <label htmlFor={'willSlider' + i}>will:</label>
                  <RangeInput
                    id={'willSlider' + i}
                    className="form__table-range"
                    required
                    min={0}
                    max={5}
                    step={1}
                    value={skill.willLevel}
                    readOnly
                  />
                </td>
                <td className="skill-table__will-number">{skill.willLevel}</td>
              </tr>
            ))}
          </SkillTable>
        </FieldSet>
      </div>
    </>
  ) : (
    <></>
  );
};
