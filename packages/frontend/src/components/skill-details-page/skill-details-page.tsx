import React, { useState, useEffect, Fragment } from 'react';
import { SkillApi, Identity, Skill, ResultListItem } from '../../api/skill-api';

import './skill-details-page.scss';
import { FieldSet } from '../field-set/field-set';
import { ErrorItem } from '../error-list/error-list';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { Button, ButtonKind, ButtonType } from '../button/button';
import { sendToast } from '../toaster/toaster';
import { ApiException } from '../../api/ajax';
import { Link, useParams, useHistory } from 'react-router-dom';
import { SkillDetailsForm } from '../skill-details-form/skill-details-form';
import { ResultList } from '../result-list/result-list';
import { useApiEffect } from '../../helpers/api-effect';

type SkillDetailsPageProps = {
  identity: Identity;
};

const initialSkillFormState: Skill = {
  name: '',
  category: '',
  homepage: '',
  description: '',
};

export const SkillDetailsPage: React.FC<SkillDetailsPageProps> = ({
  identity,
}) => {
  const { skill } = useParams();
  const history = useHistory();
  const [validationErrors, setValidationErrors] = useState<ErrorItem[] | null>(
    null
  );

  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [filter, setFilter] = useState<string>('');

  const [skillForm, setSkillForm] = useState<Skill>(initialSkillFormState);
  const [skillIsNew, setSkillIsNew] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [usersWithSkill, setUsersWithSkill] = useState<ResultListItem[] | null>(
    null
  );

  useEffect(() => {
    setValidationErrors(null);
    setEditMode(false);
  }, [setValidationErrors, setEditMode]);

  useApiEffect(
    () => SkillApi.getSkills(),
    async (request) => {
      const data = await request.send();
      setSkills(data);
    },
    [setSkills]
  );

  useEffect(() => {
    if (!skills) {
      return;
    }
    if (skill) {
      const searchResult = skills.filter(
        (s) => s.name.toLowerCase() === decodeURIComponent(skill).toLowerCase()
      );
      if (searchResult.length === 1) {
        setSkillForm(searchResult[0]);
        setSkillIsNew(false);
      } else {
        setSkillIsNew(true);
        setSkillForm({
          ...initialSkillFormState,
          name: decodeURIComponent(skill),
        });
      }
    } else {
      setSkillForm(initialSkillFormState);
      setSkillIsNew(true);
    }
  }, [skill, skills]);

  useApiEffect(
    () => SkillApi.query('exactSkill:' + decodeURIComponent(skill || '')),
    async (request) => {
      if (skill && skills) {
        const data = await request.send();
        setUsersWithSkill(data);
      }
    },
    [skill, skills, setUsersWithSkill]
  );

  const addSkillHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setValidationErrors(null);
      await SkillApi.addSkill(skillForm).send();
      setSkills([...(skills || []), skillForm]);
      setSkillIsNew(false);
      sendToast('Skill added.');
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      }
      if (ex.name === 'ApiException') {
        sendToast((ex as ApiException).message);
      }
    }
  };

  const editSkillHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill) {
      return;
    }
    try {
      setValidationErrors(null);
      await SkillApi.updateSkill(decodeURIComponent(skill), {
        homepage: skillForm.homepage,
        description: skillForm.description,
      } as Skill).send();
      sendToast('Saved.');
      setEditMode(false);
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      }
      if (ex.name === 'ApiException') {
        sendToast((ex as ApiException).message);
      }
    }
  };

  const deleteSkillHandler = async () => {
    if (!skill) {
      return;
    }
    try {
      await SkillApi.deleteSkill(decodeURIComponent(skill)).send();
      setSkillIsNew(true);
      sendToast('Skill deleted.');
      history.goBack();
    } catch (ex) {
      console.error(ex);
      if (ex.name === 'ApiException') {
        sendToast((ex as ApiException).message);
      }
    }
  };

  const skillFilter = (skill: string): boolean => {
    if (filter.trim() === '') {
      return true;
    }
    return skill.trim().toLowerCase().includes(filter.trim().toLowerCase());
  };

  const enterEditMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
  };

  return (
    <Fragment>
      <div className="skill-details-page">
        {skill && (
          <Fragment>
            <h2>Skill: {skillForm.name || decodeURIComponent(skill)}</h2>
            <FieldSet legend={skillIsNew ? 'Add new skill' : 'Edit skill'}>
              <SkillDetailsForm
                editMode={editMode}
                onSubmit={skillIsNew ? addSkillHandler : editSkillHandler}
                skillForm={skillForm}
                setSkillForm={setSkillForm}
                validationErrors={validationErrors}
              >
                <div className="button-group">
                  {editMode ? (
                    <Fragment>
                      <Button
                        kind={ButtonKind.Primary}
                        type={ButtonType.Submit}
                      >
                        Save
                      </Button>
                      <Button
                        kind={ButtonKind.Secondary}
                        type={ButtonType.Button}
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        kind={ButtonKind.Secondary}
                        type={ButtonType.Button}
                        onClick={deleteSkillHandler}
                        disabled={skillIsNew}
                      >
                        Delete Skill
                      </Button>
                    </Fragment>
                  ) : (
                    <Button kind={ButtonKind.Primary} onClick={enterEditMode}>
                      {' '}
                      Edit Skill{' '}
                    </Button>
                  )}
                </div>
              </SkillDetailsForm>
            </FieldSet>
            <ResultList resultData={usersWithSkill || []} />
          </Fragment>
        )}
        {!skill && (
          <Fragment>
            <h2>Browse skills</h2>
            <FieldSet legend="Browse skills">
              <FormField htmlFor="filterSkills" label="Filter skills">
                <TextInput
                  id="filterSkills"
                  type="text"
                  required
                  placeHolder="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </FormField>
              <ul className="skill-list">
                {(skills || [])
                  .filter((skill) => skillFilter(skill.name))
                  .map((skill) => (
                    <li key={skill.name} className="skill-list__item">
                      <Link
                        to={'/skill-details/' + encodeURIComponent(skill.name)}
                      >
                        {skill.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </FieldSet>
            <FieldSet legend="Add a skill">
              <SkillDetailsForm
                onSubmit={addSkillHandler}
                validationErrors={validationErrors}
                skillForm={skillForm}
                setSkillForm={setSkillForm}
              >
                <Button kind={ButtonKind.Primary} type={ButtonType.Submit}>
                  Add Skill
                </Button>
              </SkillDetailsForm>
            </FieldSet>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};
