import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Identity, SkillApi, User } from '../api/skill-api';
import { ValidationErrorItem } from '@hapi/joi';
import { ValidationErrors } from './validation-errors';
import { sendToast } from './toaster';
import { Button, ButtonBehavior } from './button/button';

type MyProfilePageProps = {
  identity: Identity|null|undefined;
  setIdentity: Dispatch<SetStateAction<Identity|null|undefined>>;
}

export const MyProfilePage : React.FC<MyProfilePageProps> = (props) => {
  const { identity, setIdentity } = props;
  const [ userData, setUserData] = useState<User|null>(null);
  const [ validationErrors, setValidationErrors ] = useState<ValidationErrorItem[]|null>(null);

  useEffect(() => {
    const asyncEffect = async () => {
      if (identity && identity.name) {
        setUserData(await SkillApi.getUser(identity.name).send());
      }
    }
    asyncEffect();
  }, [identity]);

  const logoutHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await SkillApi.logout().send();
      setIdentity(null);
    } catch (ex) {
      console.error(ex);
    }
  };

  const userSaveHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!identity || !userData) {
        return;
      }
      await SkillApi.updateUser(identity?.name, userData).send();
      if (userData.name !== identity.name || userData.fullName !== identity.fullName) {
        // If the username gets changed, then the authentication cookie is renewed.
        
        const newIdentity = await SkillApi.getLoginStatus().send();
        setIdentity(newIdentity);
      }
      sendToast('saved.')
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      }
    }
  }

  return (
    <div className="profile-page"> 
      <h3>Hallo {identity?.fullName || identity?.name} :)</h3>
      {userData &&
        <form className="form" onSubmit={userSaveHandler}>
          <fieldset className="form__fieldset">
            <legend className="form__fieldset-legend">User details</legend>
            <ValidationErrors details={validationErrors}/>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageUserName">Username</label>
              <input className="form__field-input" id="profilePageUserName" type="text" required
                placeholder="username"
                value={userData?.name} 
                onChange={e => setUserData({...userData, name: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageFullName">Full name</label>
              <input className="form__field-input" id="profilePageFullName" type="text" required
                placeholder="username"
                value={userData?.fullName} 
                onChange={e => setUserData({...userData, fullName: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageDescription">Description</label>
              <textarea className="form__field-text"
                rows={5}
                placeholder="Describe yourself"
                value={userData?.description}
                onChange={e => setUserData({...userData, description: e.target.value})}>

              </textarea>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePagePassword">Password</label>
              <input className="form__field-input" id="profilePagePassword" type="password" 
                placeholder="******"
                value={userData?.password} 
                onChange={e => setUserData({...userData, password: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageEmail">Email</label>
              <input className="form__field-input" id="profilePageEmail" type="email" required
                placeholder="your email address"
                value={userData?.email} 
                onChange={e => setUserData({...userData, email: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageLocation">Location</label>
              <input className="form__field-input" id="profilePageLocation" type="text" 
                placeholder="where you live (eg. Internet)"
                value={userData?.location} 
                onChange={e => setUserData({...userData, location: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageTwitter">Twitter handle</label>
              <input className="form__field-input" id="profilePageTwitter" type="text" 
                value={userData?.twitterHandle} 
                placeholder='without @'
                onChange={e => setUserData({...userData, twitterHandle: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePageGithub">Github user</label>
              <input className="form__field-input" id="profilePageGithub" type="text" 
                value={userData?.githubUser} 
                onChange={e => setUserData({...userData, githubUser: e.target.value} as User)}/>
            </div>

            <div className="form__field">
              <label className="form__field-label" htmlFor="profilePagePronouns">Pronouns</label>
              <input className="form__field-input" id="profilePagePronouns" type="text" 
                value={userData?.pronouns} 
                onChange={e => setUserData({...userData, pronouns: e.target.value} as User)}/>
            </div>

            <div className="form__buttons">
              <Button behavior={ButtonBehavior.Submit}> save </Button>
            </div>

          </fieldset>
        </form>
      }
      
      


      <button onClick={logoutHandler}>
        logout
      </button>
    </div>
  );
};
