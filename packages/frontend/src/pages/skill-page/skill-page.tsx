import React, { useEffect, useRef, useMemo, useState } from 'react';
import { UserSkill, SkillApi, Skill } from '../../client/skill-api';
import { Button, ButtonType } from '../../components/button/button';
import { ErrorItem, ErrorList } from '../../components/error-list/error-list';
import { sendToast } from '../../components/toaster/toaster';
import { ApiException } from '../../client/ajax';
import { RangeInput } from '../../components/range-input/range-input';
import { FieldSet } from '../../components/field-set/field-set';
import { FormField } from '../../components/form-field/form-field';
import { TextInput } from '../../components/text-input/text-input';

import { objectComparer } from '../../helpers/object-comparer';

import { useIdentity } from '../../store/app.context';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AppShell } from '../../components/app-shell/app-shell';
import { SkillCard } from '../../components/skill-card/skill-card';
import { arrayReplace } from '../../helpers/array';
import { useDebounce } from '../../helpers/debounce';

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
  const identity = useIdentity();

  const enabled = useMemo(() => Boolean(identity && identity.name), [identity]);
  
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
    }/*,
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['userskills', identity!.name]),
    } */
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
    if (userSkillsQuery.data) {
      setUserSkills(userSkillsQuery.data.sort(objectComparer('skillName')));
    }
  }, [userSkillsQuery.data]);

  const skillsQuery = useQuery(['skills'], () => SkillApi.getSkills().send(), {enabled});

  const skills: Skill[] = useMemo(() => {
    if (skillsQuery && skillsQuery.data) {
      const { data } = skillsQuery;
      return data ? data.map((obj: Skill): Skill => Object.assign({}, obj)).sort(objectComparer('name')) : [];
    }
    return [];
  }, [skillsQuery]);

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

  const saveUserSkill = useDebounce(1000, async (
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
  });

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
    <AppShell loginRequired={true}>
      {Boolean(userSkills) && Boolean(skills) && (
        <>
        <form onSubmit={(e) => e.preventDefault()}>
          <section className="flow">
          <h2>Configure your skills:</h2>
          <ErrorList details={errors} />
          <div className="grid grid--min-20">
              {userSkills!.map((skill, i) => (
                <SkillCard 
                  key={skill.skillName}
                  skillName={skill.skillName}
                  skill={skill.skillLevel}
                  onChangeSkill={(e) => {
                    setUserSkills(arrayReplace(userSkills!, i, 
                      {...skill, skillLevel: parseInt(e.target.value, 10)}));
                    saveUserSkill(
                      skill.skillName,
                      parseInt(e.target.value, 10),
                      skill.willLevel
                    );
                  }}
                  will={skill.willLevel}
                  onChangeWill={(e) => { 
                    setUserSkills(arrayReplace(userSkills!, i, 
                      {...skill, willLevel: parseInt(e.target.value, 10)}))
                    saveUserSkill(
                      skill.skillName,
                      skill.skillLevel,
                      parseInt(e.target.value, 10)
                    )
                  }}
                  onDeleteSkill={() => deleteSkill(skill.skillName)}
                />
              ))}
            </div>
          </section>
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

              <FormField>
                <Button type={ButtonType.Submit}> save </Button>
              </FormField>
            </FieldSet>
          </form>
        
        </>
      )}
    </AppShell>
  );
};
