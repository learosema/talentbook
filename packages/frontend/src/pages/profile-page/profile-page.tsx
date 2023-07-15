import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SkillApi } from '../../client/skill-api';
import { FieldSet } from '../../components/field-set/field-set';
import { SocialLinks } from '../../components/social-links/social-links';
import {
  HomeIcon,
  CompanyIcon,
  GlobeIcon,
} from '../../components/svg-icons/svg-icons';

import { useIdentity } from '../../store/app.context';
import { useQuery } from 'react-query';
import { AppShell } from '../../components/app-shell/app-shell';
import { SkillCard } from '../../components/skill-card/skill-card';

export const ProfilePage: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const identity = useIdentity();
  const authorized: boolean = useMemo(() => Boolean(identity && identity.name && name), [identity, name]);
  

  const userQuery = useQuery(['user', name], () =>
    SkillApi.getUser(name!).send(),
    {enabled: authorized}
  );
  const skillsQuery = useQuery(['userskills', name], () =>
    SkillApi.getUserSkills(name!).send()
  , {
    enabled: authorized
  });

  const { data: userData } = userQuery;
  const { data: userSkills } = skillsQuery;

  return userData && userSkills ? (
    <AppShell loginRequired={true}>
      <div className="profile-page flow">
        <div className="profile-header">
          <h2 className="profile-header__title">{userData.fullName}</h2>
          {userData.pronouns && (
            <div className="profile-header__pronouns">{userData.pronouns}</div>
          )}
        </div>

        <FieldSet className="flow" legend="User details">
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

        <h2>Skills</h2>
        <div className="grid grid--min-20">
          {userSkills!.map((skill) => (
            <SkillCard 
              key={skill.skillName}
              skillName={skill.skillName}
              skill={skill.skillLevel}
              will={skill.willLevel}
            />
          ))}
        </div>
      </div>
    </AppShell>
  ) : (
    <></>
  );
};
