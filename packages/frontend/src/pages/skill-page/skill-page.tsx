import React, { useEffect, Fragment, useRef, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSkill, SkillApi, Skill } from '../../client/skill-api';
import { Button, ButtonType, ButtonKind } from '../../components/button/button';
import { ErrorItem, ErrorList } from '../../components/error-list/error-list';
import { sendToast } from '../../components/toaster/toaster';
import { ApiException } from '../../client/ajax';
import { RangeInput } from '../../components/range-input/range-input';
import { FieldSet } from '../../components/field-set/field-set';
import { FormField } from '../../components/form-field/form-field';
import { TextInput } from '../../components/text-input/text-input';
import { SkillTable } from '../../components/skill-table/skill-table';
import { TrashcanIcon } from '../../components/svg-icons/svg-icons';
import { objectComparer } from '../../helpers/object-comparer';

import { useAppStore } from '../../store/app.context';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export type NewSkillForm = {
  skillName: string;
  skillLevel: number;
  willLevel: number;
};

const initialSkillFormState: NewSkillForm = {
  skillName: '',
  skillLevel: 3,
  willLevel: 3,
};

export const SkillPage: React.FC = () => {
  const { state } = useAppStore();
  const { identity } = state;
  const navigate = useNavigate();
  const enabled = Boolean(identity && identity.name);
  
  const queryClient = useQueryClient();
  const [newSkillForm, setSkillForm] = useState<NewSkillForm>(
    initialSkillFormState
  );

  const [errors, setErrors] = useState<ErrorItem[] | null>(null);

  const addSkillFormRef = useRef<HTMLFormElement | null>(null);

  const updateSkillMutation = useMutation<void, ApiException, NewSkillForm>(
    async (data) => {
      const { skillName, skillLevel, willLevel } = data;
      await SkillApi.updateUserSkill(identity!.name, skillName, {
        skillLevel,
        willLevel,
      } as UserSkill).send();
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['userskills', identity!.name]),
    }
  );

  const [userSkills, setUserSkills] = useState<UserSkill[]>();

  const deleteSkillMutation = useMutation<
    void,
    ApiException,
    { skillName: string }
  >(
    async ({ skillName }: { skillName: string }) =>
      await SkillApi.deleteUserSkill(identity!.name, skillName).send(),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['userskills', identity!.name]),
    }
  );

  const addSkillMutation = useMutation(
    async () => {
      await SkillApi.addUserSkill(identity!.name, newSkillForm).send();
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['userskills', identity!.name]),
    }
  );

  const userSkillsQuery = useQuery(['userskills', identity?.name], () =>
    SkillApi.getUserSkills(identity!.name).send(),
    {enabled}
  );

  useEffect(() => {
    if (userSkillsQuery && userSkillsQuery.data) {
      const { data } = userSkillsQuery;
      setUserSkills(data ? data.sort(objectComparer('skillName')) : []);
    }
    
  }, [userSkillsQuery]);

  const skillsQuery = useQuery(['skills'], () => SkillApi.getSkills().send(), {enabled});

  const skills: Skill[] = useMemo(() => {
    if (skillsQuery && skillsQuery.data) {
      const { data } = skillsQuery;
      return data ? data.sort(objectComparer('name')) : [];
    }
    return [];
  }, [skillsQuery]);

  if (! enabled) {
    navigate('/');
    return <></>;
  }



  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identity || !userSkills) {
      return;
    }
    try {
      await addSkillMutation.mutateAsync();
      sendToast('saved.');
      setSkillForm(initialSkillFormState);
      addSkillFormRef.current!.reset();
    } catch (ex: any) {
      console.error(ex);
      if (ex instanceof ApiException) {
        if (ex.details && ex.details.details instanceof Array) {
          setErrors(ex.details.details);
        }
        sendToast((ex as ApiException).message);
      }
    }
  };

  const saveUserSkill = async (
    skillName: string,
    skillLevel: number,
    willLevel: number
  ) => {
    if (!identity) {
      return;
    }
    try {
      await updateSkillMutation.mutateAsync({
        skillName,
        skillLevel,
        willLevel,
      });
      sendToast('saved.');
    } catch (ex: any) {
      console.error(ex);
      if (ex instanceof Error) {
        sendToast('update failed: ' + ex.message);
      }
    }
  };

  const deleteSkill = async (skillName: string) => {
    if (!userSkills || !identity) {
      return;
    }
    try {
      await deleteSkillMutation.mutateAsync({ skillName });
      sendToast('deleted.');
    } catch (ex: any) {
      if (ex instanceof Error) {
        console.error(ex);
        sendToast('update failed: ' + ex.message);
      }
    }
  };

  return (
    <Fragment>
      {Boolean(userSkills) && Boolean(skills) && (
        <div className="content-wrapper">
          <h2>Configure your skills:</h2>

          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <FieldSet legend="Your skills">
              <ErrorList details={errors} />
              <SkillTable editMode={true}>
                {userSkills!.map((skill, i) => (
                  <tr key={skill.skillName}>
                    <td className="skill-table__delete">
                      <Button
                        kind={ButtonKind.Unstyled}
                        type={ButtonType.Button}
                        onClick={() => deleteSkill(skill.skillName)}
                      >
                        <TrashcanIcon width={32} height={32} /> x
                      </Button>
                    </td>
                    <td className="skill-table__skill-name">
                      <Link
                        to={
                          '/skill-details/' +
                          encodeURIComponent(skill.skillName)
                        }
                      >
                        {skill.skillName}
                      </Link>
                    </td>

                    <td className="skill-table__skill">
                      <label htmlFor={'skillSlider' + i}>skill:</label>
                      <RangeInput
                        id={'skillSlider' + i}
                        className="skill-table-range"
                        required
                        min={0}
                        max={5}
                        step={1}
                        value={skill.skillLevel}
                        onChange={(e) =>
                          setUserSkills([
                            ...userSkills!.slice(0, i),
                            {
                              ...skill,
                              skillLevel: parseInt(e.target.value, 10),
                            },
                            ...userSkills!.slice(i + 1),
                          ])
                        }
                        onBlur={() =>
                          saveUserSkill(
                            skill.skillName,
                            skill.skillLevel,
                            skill.willLevel
                          )
                        }
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
                        onChange={(e) =>
                          setUserSkills([
                            ...userSkills!.slice(0, i),
                            {
                              ...skill,
                              willLevel: parseInt(e.target.value, 10),
                            },
                            ...userSkills!.slice(i + 1),
                          ])
                        }
                        onBlur={() =>
                          saveUserSkill(
                            skill.skillName,
                            skill.skillLevel,
                            skill.willLevel
                          )
                        }
                      />
                    </td>
                    <td className="skill-table__will-number">
                      {skill.willLevel}
                    </td>
                  </tr>
                ))}
              </SkillTable>
            </FieldSet>
          </form>

          <form ref={addSkillFormRef} className="form" onSubmit={submitHandler}>
            <FieldSet legend="Add new skill">
              <ErrorList details={errors} />
              <datalist id="skillList">
                {skills!.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </datalist>
              <FormField htmlFor="addSkillName" label="Skill Name">
                <TextInput
                  id="addSkillName"
                  type="text"
                  list="skillList"
                  required
                  placeHolder="skill name (eg. jQuery)"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={newSkillForm.skillName}
                  onChange={(e) =>
                    setSkillForm({
                      ...newSkillForm,
                      skillName: e.target.value,
                    })
                  }
                />
              </FormField>

              <FormField htmlFor="addSkillSkillLevel" label="Skill level">
                <RangeInput
                  id="addSkillSkillLevel"
                  required
                  min={0}
                  max={5}
                  step={1}
                  value={newSkillForm.skillLevel}
                  onChange={(e) =>
                    setSkillForm({
                      ...newSkillForm,
                      skillLevel: parseInt(e.target.value, 10),
                    })
                  }
                />
                <output htmlFor="addSkillSkillLevel">
                  {newSkillForm.skillLevel}
                </output>
              </FormField>

              <FormField htmlFor="addSkillWillLevel" label="Will level">
                <RangeInput
                  id="addSkillWillLevel"
                  required
                  min={0}
                  max={5}
                  step={1}
                  value={newSkillForm.willLevel}
                  onChange={(e) =>
                    setSkillForm({
                      ...newSkillForm,
                      willLevel: parseInt(e.target.value, 10),
                    })
                  }
                />
                <output htmlFor="addSkillSkillLevel">
                  {newSkillForm.willLevel}
                </output>
              </FormField>

              <div className="form__buttons">
                <Button type={ButtonType.Submit}> save </Button>
              </div>
            </FieldSet>
          </form>
        </div>
      )}
    </Fragment>
  );
};
