import React, { useEffect, useState } from 'react';
import { SkillApi, User } from '../../client/skill-api';
import { ErrorItem, ErrorList } from '../../components/error-list/error-list';
import { sendToast } from '../../components/toaster/toaster';
import { Button, ButtonType, ButtonKind } from '../../components/button/button';
import { FieldSet } from '../../components/field-set/field-set';
import { FormField } from '../../components/form-field/form-field';
import { TextInput } from '../../components/text-input/text-input';
import { TextArea } from '../../components/text-area/text-area';
import { Actions } from '../../store/app.actions';
import { useAppStore } from '../../store/app.context';
import { ApiException } from '../../client/ajax';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/app-shell/app-shell';

export const MyProfilePage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { identity } = state;
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [errors, setErrors] = useState<ErrorItem[] | null>(null);
  const queryClient = useQueryClient();
  const userQuery: UseQueryResult<User> = useQuery(
    ['user', identity?.name],
    () => SkillApi.getUser(identity?.name || '').send()
  );

  useEffect(() => {
    if (typeof userQuery.data !== 'undefined') {
      setUserData(userQuery.data);
    }
  }, [userQuery.data]);

  const updateUserMutation = useMutation(
    async () => {
      if (!identity || !identity.name || !userData) {
        throw new Error('unauthenticated');
      }
      try {
        await SkillApi.updateUser(identity.name, userData!).send();
        if (
          userData?.name !== identity.name ||
          userData?.fullName !== identity.fullName
        ) {
          // If the username gets changed, then the authentication cookie is renewed.
          const newIdentity = await SkillApi.getLoginStatus().send();
          dispatch(Actions.setIdentity(newIdentity));
        }
      } catch (ex: any) {
        if (ex.details && ex.details.details instanceof Array) {
          setErrors(ex.details.details);
        }
        if (ex.name === 'ApiException') {
          sendToast((ex as ApiException).message);
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', userData?.name]);
      },
    }
  );

  const deleteUserMutation = useMutation(
    async () => {
      if (!identity || !identity.name) {
        throw new Error('unauthenticated');
      }
      await SkillApi.deleteUser(identity.name).send();
    },
    {
      onSuccess: () => dispatch(Actions.setIdentity(null)),
    }
  );

  const logoutHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await SkillApi.logout().send();
      dispatch(Actions.setIdentity(null));
    } catch (ex: any) {
      console.error(ex);
    }
  };

  const userSaveHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!identity || !userData) {
        throw new Error('unauthenticated');
      }
      await updateUserMutation.mutateAsync();

      sendToast('saved.');
    } catch (ex: any) {
      console.error(ex);
      if (
        ex instanceof ApiException &&
        ex.details &&
        ex.details.details instanceof Array
      ) {
        setErrors(ex.details.details);
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
    await deleteUserMutation.mutateAsync();
    navigate('/');
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
    <AppShell loginRequired={true}>
      <h1>Your profile</h1>
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
                  setUserData({ ...userData, name: e.target.value })
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
                  setUserData({
                    ...userData,
                    fullName: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField htmlFor="profilePageDescription" label="Description">
              <TextArea
                rows={5}
                placeHolder="Describe yourself"
                value={userData?.description || ''}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    description: e.target.value,
                  })
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
                  setUserData({
                    ...userData,
                    password: e.target.value,
                  })
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
                  setUserData({ ...userData, email: e.target.value })
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
                  setUserData({
                    ...userData,
                    company: e.target.value,
                  })
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
                  setUserData({
                    ...userData,
                    location: e.target.value,
                  })
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
                  setUserData({
                    ...userData,
                    twitterHandle: e.target.value,
                  } as User)
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
                  setUserData({
                    ...userData,
                    githubUser: e.target.value,
                  })
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
                  setUserData({
                    ...userData,
                    homepage: e.target.value,
                  })
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
                  setUserData({
                    ...userData,
                    pronouns: e.target.value,
                  })
                }
              />
            </FormField>

            <div className="form__buttons">
              <Button type={ButtonType.Submit}> save </Button>
            </div>
          </FieldSet>

          <FieldSet legend="Account management">
            <div className="form">
              <div className="button-group">
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
      
    </AppShell>
  );
};
