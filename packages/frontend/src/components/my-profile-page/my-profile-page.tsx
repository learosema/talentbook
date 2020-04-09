import React, { Dispatch } from 'react';
import { Identity, SkillApi, User } from '../../api/skill-api';
import { ErrorList } from '../error-list/error-list';
import { sendToast } from '../toaster/toaster';
import { Button, ButtonType } from '../button/button';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { TextArea } from '../text-area/text-area';

import './my-profile-page.scss';
import { useApiEffect } from '../../helpers/api-effect';
import { MyProfileState } from '../../store/app.state';
import { Action, Actions } from '../../store/app.actions';

type MyProfilePageProps = {
  identity: Identity | null | undefined;
  myProfile: MyProfileState;
  dispatch: Dispatch<Action<any>>;
};

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  identity,
  myProfile,
  dispatch,
}) => {
  const { userData, errors } = myProfile;

  useApiEffect(
    () => SkillApi.getUser(identity?.name || ''),
    async (request) => {
      if (identity && identity.name) {
        const data = await request.send();
        dispatch(Actions.setUserData(data));
      }
    },
    [identity, dispatch]
  );

  const logoutHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await SkillApi.logout().send();
      dispatch(Actions.setIdentity(null));
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
      if (
        userData.name !== identity.name ||
        userData.fullName !== identity.fullName
      ) {
        // If the username gets changed, then the authentication cookie is renewed.

        const newIdentity = await SkillApi.getLoginStatus().send();
        dispatch(Actions.setIdentity(newIdentity));
      }
      sendToast('saved.');
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        dispatch(Actions.setMyProfileErrors(ex.details.details));
      }
    }
  };

  return (
    <div className="profile-page">
      <h2>Your profile</h2>
      {userData && (
        <form className="form" onSubmit={userSaveHandler}>
          <FieldSet legend="User details">
            <ErrorList details={errors} />

            <FormField htmlFor="profilePageUserName" label="Username">
              <TextInput
                id="profilePageUserName"
                type="text"
                required
                placeHolder="username"
                value={userData?.name}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({ ...userData, name: e.target.value })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageFullName" label="Full name">
              <TextInput
                id="profilePageFullName"
                type="text"
                required
                placeHolder="your full name"
                value={userData?.fullName}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      fullName: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageDescription" label="Description">
              <TextArea
                rows={5}
                placeHolder="Describe yourself"
                value={userData?.description || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      description: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePagePassword" label="Password">
              <TextInput
                id="profilePagePassword"
                type="password"
                placeHolder="******"
                value={userData?.password || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      password: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageEmail" label="Email">
              <TextInput
                id="profilePageEmail"
                type="email"
                required
                placeHolder="your email address"
                value={userData?.email || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({ ...userData, email: e.target.value })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageCompany" label="Company">
              <TextInput
                id="profilePageCompany"
                type="text"
                placeHolder="where you work"
                value={userData?.company || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      company: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageLocation" label="Location">
              <TextInput
                id="profilePageLocation"
                type="text"
                placeHolder="where you live (eg. Internet)"
                value={userData?.location || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      location: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageTwitter" label="Twitter handle">
              <TextInput
                id="profilePageTwitter"
                type="text"
                value={userData?.twitterHandle || ''}
                placeHolder="your twitter handle without @"
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      twitterHandle: e.target.value,
                    } as User)
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePageGithub" label="GitHub user">
              <TextInput
                id="profilePageGithub"
                type="text"
                placeHolder="your github user"
                value={userData?.githubUser || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      githubUser: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <FormField htmlFor="profilePagePronouns" label="Pronouns">
              <TextInput
                id="profilePagePronouns"
                type="text"
                placeHolder="your pronouns"
                value={userData?.pronouns || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      pronouns: e.target.value,
                    })
                  )
                }
              />
            </FormField>

            <div className="form__buttons">
              <Button type={ButtonType.Submit}> save </Button>
            </div>
          </FieldSet>
        </form>
      )}

      <Button type={ButtonType.Button} onClick={logoutHandler}>
        logout
      </Button>
    </div>
  );
};
