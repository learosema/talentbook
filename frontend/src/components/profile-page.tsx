import React, { Dispatch, SetStateAction } from 'react';
import { Identity, SkillApi } from '../api/skill-api';

type ProfilePageProps = {
  identity: Identity|null|undefined;
  setIdentity: Dispatch<SetStateAction<Identity|null|undefined>>;
}

export const ProfilePage : React.FC<ProfilePageProps> = (props) => {
  const { identity, setIdentity } = props;
  const logoutHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await SkillApi.logout().send();
      setIdentity(null);
    } catch (ex) {
      console.error(ex);
    }
  }; 
  return (
    <div className="profile-page"> 
      <h3>Hallo {identity?.name} :)</h3>


      <button onClick={logoutHandler}>
        logout
      </button>
    </div>
  );
};
