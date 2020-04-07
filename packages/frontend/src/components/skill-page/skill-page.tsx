import React, {
  useEffect,
  Fragment,
  useRef,
  useCallback,
  Dispatch,
} from 'react';
import { Link } from 'react-router-dom';
import { UserSkill, SkillApi, Identity, Skill } from '../../api/skill-api';
import { Button, ButtonType, ButtonKind } from '../button/button';
import { ErrorList } from '../error-list/error-list';
import { sendToast } from '../toaster/toaster';
import { ApiException } from '../../api/ajax';
import { RangeInput } from '../range-input/range-input';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { SkillTable } from '../skill-table/skill-table';
import { TrashcanIcon } from '../svg-icons/svg-icons';
import { objectComparer } from '../../helpers/object-comparer';

import './skill-page.scss';
import { useApiEffect } from '../../helpers/api-effect';
import {
  NewSkillForm,
  Action,
  Actions,
  MySkillsState,
} from '../../store/app.reducer';

type SkillPageProps = {
  identity: Identity;
  dispatch: Dispatch<Action<any>>;
  mySkills: MySkillsState;
  skillList: Skill[];
};

const initialSkillFormState: NewSkillForm = {
  skillName: '',
  skillLevel: 1,
  willLevel: 2,
};

export const SkillPage: React.FC<SkillPageProps> = ({
  identity,
  mySkills,
  skillList,
  dispatch,
}) => {
  const { userSkills, newSkillForm, errors } = mySkills;
  const addSkillFormRef = useRef<HTMLFormElement | null>(null);

  const bySkill = useCallback(objectComparer('skillName'), []);

  useApiEffect(
    () => SkillApi.getUserSkills(identity.name),
    async (request) => {
      const data = (await request.send()).sort(bySkill);
      dispatch(Actions.setUserSkills(data));
    },
    [identity, bySkill, dispatch]
  );

  useApiEffect(
    () => SkillApi.getSkills(),
    async (request) => {
      const data = (await request.send()).sort(objectComparer('name'));
      dispatch(Actions.setSkillList(data));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(Actions.setNewSkillForm(initialSkillFormState));
  }, [dispatch]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identity || !userSkills) {
      return;
    }
    try {
      await SkillApi.addUserSkill(identity.name, newSkillForm).send();
      dispatch(
        Actions.setUserSkills(
          [...userSkills, newSkillForm].sort(objectComparer('skillName'))
        )
      );
      sendToast('saved.');
      dispatch(Actions.setNewSkillForm(initialSkillFormState));
      addSkillFormRef.current!.reset();
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        dispatch(Actions.setNewSkillErrors(ex.details.details));
      }
      if (ex.name === 'ApiException') {
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
      await SkillApi.updateUserSkill(identity.name, skillName, {
        skillLevel,
        willLevel,
      } as UserSkill).send();
      sendToast('saved.');
    } catch (ex) {
      console.error(ex);
      sendToast('update failed: ' + ex.message);
    }
  };

  const deleteSkill = async (skillName: string) => {
    if (!userSkills) {
      return;
    }
    try {
      await SkillApi.deleteUserSkill(identity.name, skillName).send();
      sendToast('deleted.');
      dispatch(
        Actions.setUserSkills(
          userSkills.filter((item) => item.skillName !== skillName)
        )
      );
    } catch (ex) {
      console.error(ex);
      sendToast('update failed: ' + ex.message);
    }
  };

  return (
    <Fragment>
      {Boolean(userSkills) && Boolean(skillList) && (
        <div className="skill-page">
          <datalist id="list"></datalist>
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
                          dispatch(
                            Actions.setUserSkills([
                              ...userSkills!.slice(0, i),
                              {
                                ...skill,
                                skillLevel: parseInt(e.target.value, 10),
                              },
                              ...userSkills!.slice(i + 1),
                            ])
                          )
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
                          dispatch(
                            Actions.setUserSkills([
                              ...userSkills!.slice(0, i),
                              {
                                ...skill,
                                willLevel: parseInt(e.target.value, 10),
                              },
                              ...userSkills!.slice(i + 1),
                            ])
                          )
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
                {skillList!.map((skillItem) => (
                  <option key={skillItem.name}>{skillItem.name}</option>
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
                    dispatch(
                      Actions.setNewSkillForm({
                        ...newSkillForm,
                        skillName: e.target.value,
                      })
                    )
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
                    dispatch(
                      Actions.setNewSkillForm({
                        ...newSkillForm,
                        skillLevel: parseInt(e.target.value, 10),
                      })
                    )
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
                    dispatch(
                      Actions.setNewSkillForm({
                        ...newSkillForm,
                        willLevel: parseInt(e.target.value, 10),
                      })
                    )
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
