import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { User, UserSkill, SkillApi } from '../api/skill-api';

export const ProfilePage: React.FC = () => {
  const { name } = useParams();
  const [user, setUser] = useState<User|null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);

  useEffect(() => {
    const asyncEffect = async () => {
      if (! name) {
        return;
      }
      const [userData, userSkillsData] = await Promise.all([
        SkillApi.getUser(name).send(), 
        SkillApi.getUserSkills(name).send()
      ]);
      setUser(userData);
      setUserSkills(userSkillsData);
      console.log(userData);
      console.log(userSkillsData);
    }
    asyncEffect();
  }, [name, setUser, setUserSkills]);
  
  return (<Fragment>
    <div className="profile-page">
      <h3>{user?.fullName}'s profile</h3>
      <fieldset className="form__fieldset">
        <legend className="form__fieldset-legend">User details</legend>
        <p className="location">Location: {user?.location}</p>
        <p className="social-links">
          Contact: 
          {user?.githubUser && (<a href={'https://github.com' + user.githubUser}>GitHub</a>)}
          {user?.twitterHandle && (<a href={'https://twitter.com/' + user.twitterHandle}>Twitter</a>)}
        </p>
      </fieldset>
      
      <fieldset className="form__fieldset">
        <table className="skill-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th colSpan={2}>Skill level</th>
              <th colSpan={2}>Will level</th>
            </tr>
          </thead>
          <tbody>
            { 
              userSkills.map((skill, i) => <tr key={skill.skillName}>
                <td className="skill-table__skill-name">{skill.skillName}</td>
                <td className="skill-table__skill">
                  <label htmlFor={'skillSlider' + i}>skill:</label>
                  <input id={'skillSlider' + i} className="form__table-range" type="range" required min="0" max="5" step="1" 
                    value={skill.skillLevel}
                    readOnly /></td>
                <td className="skill-table__skill-number">
                  {skill.skillLevel}
                </td>
                
                <td className="skill-table__will">
                  <label htmlFor={'willSlider' + i}>will:</label>
                  <input id={'willSlider' + i} className="form__table-range" type="range" required min="0" max="5" step="1" value={skill.willLevel}
                    readOnly /></td>
                <td className="skill-table__will-number">
                  {skill.willLevel}
                </td>
              </tr>)
            }
          </tbody> 
        </table>

      </fieldset>
        
        


    </div>
    </Fragment>)
};