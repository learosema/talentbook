import React, { useEffect, Fragment } from 'react';
import { SkillApi, Skill } from '../../client/skill-api';

import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { Button, ButtonKind, ButtonType } from '../button/button';
import { sendToast } from '../toaster/toaster';
import { ApiException } from '../../client/ajax';
import { Link, useParams, useHistory } from 'react-router-dom';
import { SkillDetailsForm } from '../skill-details-form/skill-details-form';
import { ResultList } from '../result-list/result-list';
import { SkillEditForm } from '../../store/app.state';
import { Actions } from '../../store/app.actions';

import './skill-details-page.scss';
import { useAppStore } from '../../store/app.context';

const initialSkillFormState: Skill = {
  name: '',
  category: '',
  homepage: '',
  description: '',
};

export const SkillDetailsPage: React.FC = () => {
  const { skill } = useParams<{ skill?: string }>();
  const { state, dispatch } = useAppStore();
  const { skillList, skillDetails, identity } = state;
  const history = useHistory();
  const {
    filter,
    errors,
    editForm,
    skillIsNew,
    editMode,
    searchResult,
  } = skillDetails;

  useEffect(() => {
    dispatch(Actions.setSkillErrors(null));
    dispatch(Actions.setSkillEditMode(false));
  }, [dispatch]);

  useEffect(() => {
    const req = SkillApi.getSkills();
    req.send().then((data) => dispatch(Actions.setSkillList(data)));
    return () => req.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!skillList) {
      return;
    }
    if (skill) {
      const searchResult = skillList.filter(
        (s) => s.name.toLowerCase() === decodeURIComponent(skill).toLowerCase()
      );
      if (searchResult.length === 1) {
        dispatch(Actions.setSkillEditForm(searchResult[0] as SkillEditForm));
        dispatch(Actions.setSkillIsNew(false));
      } else {
        dispatch(Actions.setSkillIsNew(true));
        dispatch(
          Actions.setSkillEditForm({
            ...initialSkillFormState,
            name: decodeURIComponent(skill),
          })
        );
      }
    } else {
      dispatch(Actions.setSkillEditForm(initialSkillFormState));
      dispatch(Actions.setSkillIsNew(true));
    }
  }, [skill, skillList, dispatch]);

  useEffect(() => {
    const req = SkillApi.query('exactSkill:' + decodeURIComponent(skill || ''));
    if (skill && skillList) {
      req.send().then((data) => dispatch(Actions.setSkillSearchResult(data)));
    }
    return () => req.abort();
  }, [skill, skillList, dispatch]);

  const addSkillHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(Actions.setSkillErrors(null));
      await SkillApi.addSkill(editForm as Skill).send();
      dispatch(Actions.setSkillList([...(skillList || []), editForm as Skill]));
      dispatch(Actions.setSkillIsNew(false));
      sendToast('Skill added.');
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        dispatch(Actions.setSkillErrors(ex.details.details));
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
      dispatch(Actions.setSkillErrors(null));
      await SkillApi.updateSkill(decodeURIComponent(skill), {
        homepage: editForm.homepage,
        description: editForm.description,
      } as Skill).send();
      sendToast('Saved.');
      dispatch(Actions.setSkillEditMode(false));
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        dispatch(Actions.setSkillErrors(ex.details.details));
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
      await SkillApi.deleteSkill(editForm.name).send();
      dispatch(Actions.setSkillIsNew(true));
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
    dispatch(Actions.setSkillEditMode(true));
  };

  if (!identity) {
    return <Fragment></Fragment>;
  }

  const setEditForm = (form: SkillEditForm) =>
    dispatch(Actions.setSkillEditForm(form));

  return (
    <Fragment>
      <div className="skill-details-page">
        {skill && (
          <Fragment>
            <h2>Skill: {editForm.name || decodeURIComponent(skill)}</h2>
            <FieldSet legend={skillIsNew ? 'Add new skill' : 'Edit skill'}>
              <SkillDetailsForm
                editMode={editMode}
                skillIsNew={skillIsNew}
                onSubmit={skillIsNew ? addSkillHandler : editSkillHandler}
                skillForm={editForm}
                setSkillForm={setEditForm}
                validationErrors={errors}
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
                        onClick={() =>
                          dispatch(Actions.setSkillEditMode(false))
                        }
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
            <ResultList resultData={searchResult || []} />
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
                  onChange={(e) =>
                    dispatch(Actions.setSkillFilter(e.target.value))
                  }
                />
              </FormField>
              <ul className="skill-list">
                {(skillList || [])
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
                validationErrors={errors}
                skillIsNew={true}
                skillForm={editForm}
                setSkillForm={setEditForm}
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
