import React, { useState, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, UserSkill, SkillApi, Identity } from '../../api/skill-api';
import { RangeInput } from '../range-input/range-input';
import { FieldSet } from '../field-set/field-set';
import { SkillTable } from '../skill-table/skill-table';

import './profile-page.scss';
import { SocialLinks } from '../social-links/social-links';
import { HomeIcon, CompanyIcon } from '../svg-icons/svg-icons';
import { useApiEffect } from '../../helpers/api-effect';

type ProfilePageProps = {
  identity: Identity;
};

export const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { name } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const { identity } = props;

  useApiEffect(
    () => SkillApi.getUser(name || ''),
    async (request) => {
      if (name) {
        const data = await request.send();
        setUser(data);
      }
    },
    [name, setUser]
  );

  useApiEffect(
    () => SkillApi.getUserSkills(name || ''),
    async (request) => {
      console.log('setUserSkills effect');
      if (name) {
        const data = await request.send();
        setUserSkills(data);
      }
    },
    [name, setUserSkills]
  );

  if (!identity) {
    return <div></div>;
  }
  return (
    user && (
      <Fragment>
        <div className="profile-page">
          <div className="profile-header">
            <h2 className="profile-header__title">{user.fullName}</h2>
            {user.pronouns && (
              <div className="profile-header__pronouns">{user.pronouns}</div>
            )}
          </div>

          <FieldSet legend="User details">
            <p className="description">{user.description}</p>
            {user.location && (
              <div className="location">
                <HomeIcon />{' '}
                <div className="location__text">{user.location}</div>
              </div>
            )}
            {user.company && (
              <div className="company">
                <CompanyIcon />{' '}
                <div className="company__text">{user.company}</div>
              </div>
            )}
            <SocialLinks
              githubUser={user?.githubUser}
              twitterHandle={user?.twitterHandle}
            />
          </FieldSet>

          <FieldSet legend="Skills">
            <SkillTable editMode={false}>
              {userSkills.map((skill, i) => (
                <tr key={skill.skillName}>
                  <td className="skill-table__skill-name">
                    <Link
                      to={
                        '/skill-details/' + encodeURIComponent(skill.skillName)
                      }
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
                  <td className="skill-table__will-number">
                    {skill.willLevel}
                  </td>
                </tr>
              ))}
            </SkillTable>
          </FieldSet>
        </div>
      </Fragment>
    )
  );
};
