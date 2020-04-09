import React, { Fragment, Dispatch } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SkillApi, Identity } from '../../api/skill-api';
import { RangeInput } from '../range-input/range-input';
import { FieldSet } from '../field-set/field-set';
import { SkillTable } from '../skill-table/skill-table';

import './profile-page.scss';
import { SocialLinks } from '../social-links/social-links';
import { HomeIcon, CompanyIcon } from '../svg-icons/svg-icons';
import { useApiEffect } from '../../helpers/api-effect';
import { ProfileState } from '../../store/app.state';
import { Action, Actions } from '../../store/app.actions';

type ProfilePageProps = {
  identity: Identity;
  profile: ProfileState;
  dispatch: Dispatch<Action<any>>;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  identity,
  profile,
  dispatch,
}) => {
  const { name } = useParams();
  const { userData, userSkills } = profile;
  useApiEffect(
    () => SkillApi.getUser(name || ''),
    async (request) => {
      if (name) {
        const data = await request.send();
        dispatch(Actions.setProfileUser(data));
      }
    },
    [name, dispatch]
  );

  useApiEffect(
    () => SkillApi.getUserSkills(name || ''),
    async (request) => {
      if (name) {
        const data = await request.send();
        dispatch(Actions.setProfileSkills(data));
      }
    },
    [name, dispatch]
  );

  if (!identity) {
    return <div></div>;
  }

  return (
    userData &&
    userSkills && (
      <Fragment>
        <div className="profile-page">
          <div className="profile-header">
            <h2 className="profile-header__title">{userData.fullName}</h2>
            {userData.pronouns && (
              <div className="profile-header__pronouns">
                {userData.pronouns}
              </div>
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
