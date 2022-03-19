import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiException } from '../../client/ajax';
import { Skill, SkillApi } from '../../client/skill-api';
import { Button, ButtonKind, ButtonType } from '../button/button';
import { ErrorItem } from '../error-list/error-list';
import { FieldSet } from '../field-set/field-set';
import { ResultList } from '../result-list/result-list';
import { sendToast } from '../toaster/toaster';
import { SkillDetailsForm } from './skill-details-form';

export function SkillEditForm() {
  const navigate = useNavigate();
  const { skill } = useParams();

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<ErrorItem[] | null>(null);
  const [skillForm, setSkillForm] = useState<Skill>({
    name: '',
    description: '',
    homepage: '',
    category: '',
  });

  useEffect(() => {
    if (!skill) {
      navigate('/skill-details');
    }
  }, [skill]);

  const queryClient = useQueryClient();
  const updateSkillMutation = useMutation(
    () =>
      SkillApi.updateSkill(skill!, {
        homepage: skillForm.homepage,
        description: skillForm.description,
        category: skillForm.category,
      }).send(),
    {
      onSuccess: () => queryClient.invalidateQueries('skills'),
    }
  );

  const deleteSkillMutation = useMutation(
    () => SkillApi.deleteSkill(skill!).send(),
    {
      onSuccess: () => queryClient.invalidateQueries('skills'),
    }
  );

  const skillsQuery = useQuery('skills', () => SkillApi.getSkills().send());
  useEffect(() => {
    if (skillsQuery.data && skill) {
      const formData = skillsQuery.data.find(
        (item) => item.name === decodeURIComponent(skill)
      );
      if (formData) {
        setSkillForm(formData);
      }
    }
  }, [skillsQuery.data, skill]);

  const searchQuery = useQuery(['query', skill], () =>
    SkillApi.query(skill ? decodeURIComponent(skill) : '').send()
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill) {
      return;
    }
    try {
      setErrors(null);
      await updateSkillMutation.mutateAsync();
      sendToast('Saved.');
      setEditMode(false);
    } catch (ex: any) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setErrors(ex.details.details);
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
      await deleteSkillMutation.mutateAsync();
      sendToast('Skill deleted.');
      navigate(-1);
    } catch (ex: any) {
      console.error(ex);
      if (ex.name === 'ApiException') {
        sendToast((ex as ApiException).message);
      }
    }
  };

  return (
    <Fragment>
      <h2>Skill: {skillForm.name || skill}</h2>
      <FieldSet legend="Edit skill">
        <SkillDetailsForm
          editMode={editMode}
          skillIsNew={false}
          onSubmit={onSubmit}
          skillForm={skillForm}
          setSkillForm={setSkillForm}
          validationErrors={errors}
        >
          <div className="button-group">
            {editMode ? (
              <Fragment>
                <Button kind={ButtonKind.Primary} type={ButtonType.Submit}>
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
                >
                  Delete Skill
                </Button>
              </Fragment>
            ) : (
              <Button
                kind={ButtonKind.Primary}
                onClick={(e) => {
                  setEditMode(true);
                  e.preventDefault();
                }}
                type={ButtonType.Button}
              >
                {' '}
                Edit Skill{' '}
              </Button>
            )}
          </div>
        </SkillDetailsForm>
      </FieldSet>
      <ResultList resultData={searchQuery.data || []} />
    </Fragment>
  );
}
