import React, { useEffect } from 'react';
import { SkillApi, User } from '../../client/skill-api';
import { ErrorList } from '../error-list/error-list';
import { sendToast } from '../toaster/toaster';
import { Button, ButtonType, ButtonKind } from '../button/button';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { TextArea } from '../text-area/text-area';

import './my-profile-page.scss';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';

export const MyProfilePage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { myProfile, identity } = state;
  const { userData, errors } = myProfile;

  useEffect(() => {
    const req = SkillApi.getUser(identity?.name || '');
    if (identity && identity.name) {
      req.send().then((data) => dispatch(Actions.setUserData(data)));
    }
    return () => req.abort();
  }, [identity, dispatch]);

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

  const deleteHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      !identity ||
      window.confirm('Do you really want to delete your account?') === false
    ) {
      return;
    }
    await SkillApi.deleteUser(identity.name).send();
    document.location.href = '/';
  };

  const downloadHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!identity) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.setAttribute('download', 'talentbook.json');
    const userData = await SkillApi.getUser(identity.name).send();
    const userSkills = await SkillApi.getUserSkills(identity.name).send();
    const code = JSON.stringify(
      { user: userData, skills: userSkills },
      null,
      2
    );
    anchor.setAttribute(
      'href',
      'data:application/octet-stream;charset=utf-8,' + encodeURI(code)
    );
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
    anchor.click();
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

            <FormField htmlFor="profilePageHomepage" label="Website">
              <TextInput
                id="profilePageHomepage"
                type="text"
                placeHolder="eg. link to your portfolio website"
                value={userData?.homepage || ''}
                onChange={(e) =>
                  dispatch(
                    Actions.setUserData({
                      ...userData,
                      homepage: e.target.value,
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

          <FieldSet legend="Account management">
            <div className="form">
              <div className="form__buttons">
                <Button type={ButtonType.Button} onClick={logoutHandler}>
                  logout
                </Button>

                <Button
                  type={ButtonType.Button}
                  kind={ButtonKind.Secondary}
                  onClick={downloadHandler}
                >
                  download my data
                </Button>

                <Button
                  type={ButtonType.Button}
                  kind={ButtonKind.Danger}
                  onClick={deleteHandler}
                >
                  delete my account
                </Button>
              </div>
            </div>
          </FieldSet>
        </form>
      )}
    </div>
  );
};
