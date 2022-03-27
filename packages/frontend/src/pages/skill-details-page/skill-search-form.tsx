import { Fragment, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { ApiException } from '../../client/ajax';
import { Skill, SkillApi } from '../../client/skill-api';
import { Button, ButtonKind, ButtonType } from '../../components/button/button';
import { ErrorItem } from '../../components/error-list/error-list';
import { FieldSet } from '../../components/field-set/field-set';
import { FormField } from '../../components/form-field/form-field';
import { SkillDetailsForm } from './skill-details-form';
import { TextInput } from '../../components/text-input/text-input';
import { sendToast } from '../../components/toaster/toaster';

export function SkillSearchForm() {
  const [filter, setFilter] = useState<string>('');
  const initialFormState = {
    name: '',
    description: '',
    homepage: '',
    category: '',
  };

  const [skillForm, setSkillForm] = useState<Skill>(initialFormState);

  const [errors, setErrors] = useState<ErrorItem[] | null>([]);
  const queryClient = useQueryClient();
  const skillListQuery = useQuery('skills', () => SkillApi.getSkills().send());
  const addSkillMutation = useMutation(
    (newSkill: Skill) => SkillApi.addSkill(newSkill).send(),
    {
      onSuccess: () => queryClient.invalidateQueries('skills'),
    }
  );

  const addSkillHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrors(null);
      await addSkillMutation.mutateAsync(skillForm);
      sendToast('Skill added.');
      setSkillForm(initialFormState);
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

  const skillFilter = (skill: string): boolean => {
    if (filter.trim() === '') {
      return true;
    }
    return skill.trim().toLowerCase().includes(filter.trim().toLowerCase());
  };

  return (
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
        {!skillListQuery.isLoading && (
          <ul className="tag-list">
            {(skillListQuery.data || [])
              .filter((skill) => skillFilter(skill.name))
              .map((skill) => (
                <li key={skill.name} className="tag-list__item">
                  <Link to={'/skill-details/' + encodeURIComponent(skill.name)}>
                    {skill.name}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </FieldSet>
      <FieldSet legend="Add a skill">
        <SkillDetailsForm
          onSubmit={addSkillHandler}
          validationErrors={errors}
          skillIsNew={true}
          skillForm={skillForm}
          setSkillForm={setSkillForm}
        >
          <Button kind={ButtonKind.Primary} type={ButtonType.Submit}>
            Add Skill
          </Button>
        </SkillDetailsForm>
      </FieldSet>
    </Fragment>
  );
}
