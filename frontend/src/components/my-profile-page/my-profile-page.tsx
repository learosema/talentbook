import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Identity, SkillApi, User } from '../../api/skill-api';
import { ValidationErrorItem } from '@hapi/joi';
import { ErrorList } from '../error-list/error-list';
import { sendToast } from '../toaster/toaster';
import { Button, ButtonBehavior } from '../button/button';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { TextArea } from '../text-area/text-area';

import './my-profile-page.scss';

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
          <FieldSet legend="User details">
            <ErrorList details={validationErrors}/>

            <FormField htmlFor="profilePageUserName" label="Username">
              <TextInput className="form__field-input" id="profilePageUserName" type="text" required
                placeHolder="username"
                value={userData?.name} 
                onChange={e => setUserData({...userData, name: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageFullName" label="Full name">
              <TextInput id="profilePageFullName" type="text" required
                placeHolder="your full name"
                value={userData?.fullName} 
                onChange={e => setUserData({...userData, fullName: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageDescription" label="Description">
              <TextArea rows={5}
                placeHolder="Describe yourself"
                value={userData?.description}
                onChange={e => setUserData({...userData, description: e.target.value})} />
            </FormField>

            <FormField htmlFor="profilePagePassword" label="Password">
              <TextInput id="profilePagePassword" type="password" 
                placeHolder="******"
                value={userData?.password} 
                onChange={e => setUserData({...userData, password: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageEmail" label="Email">
              <TextInput id="profilePageEmail" type="email" required
                placeHolder="your email address"
                value={userData?.email} 
                onChange={e => setUserData({...userData, email: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageLocation" label="Location">
              <TextInput className="form__field-input" id="profilePageLocation" type="text" 
                placeHolder="where you live (eg. Internet)"
                value={userData?.location} 
                onChange={e => setUserData({...userData, location: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageTwitter" label="Twitter handle">
              <TextInput id="profilePageTwitter" type="text" 
                value={userData?.twitterHandle} 
                placeHolder='your twitter handle without @'
                onChange={e => setUserData({...userData, twitterHandle: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="profilePageGithub" label="GitHub user">
              <TextInput id="profilePageGithub" type="text" 
                value={userData?.githubUser} 
                onChange={e => setUserData({...userData, githubUser: e.target.value} as User)}/>
            </FormField>

            <FormField htmlFor="rofilePagePronouns" label="Pronouns">
              <TextInput id="profilePagePronouns" type="text" placeHolder="your pronouns"
                value={userData?.pronouns} 
                onChange={e => setUserData({...userData, pronouns: e.target.value} as User)}/>
            </FormField>

            <div className="form__buttons">
              <Button behavior={ButtonBehavior.Submit}> save </Button>
            </div>

          </FieldSet>
        </form>
      }
      
      


      <Button behavior={ButtonBehavior.Button} onClick={logoutHandler}>
        logout
      </Button>
    </div>
  );
};
