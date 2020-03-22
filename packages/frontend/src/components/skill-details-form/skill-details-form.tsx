import React, { Dispatch, SetStateAction } from 'react';
import { Skill } from '../../api/skill-api';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { ErrorList, ErrorItem } from '../error-list/error-list';

type SkillDetailsFormProps = {
  skillForm: Skill;
  setSkillForm: Dispatch<SetStateAction<Skill>>;
  validationErrors: ErrorItem[] | null;
  onSubmit: (e: React.FormEvent) => void;
};

export const SkillDetailsForm: React.FC<SkillDetailsFormProps> = ({
  skillForm,
  setSkillForm,
  validationErrors,
  onSubmit,
  children
}) => {
  return (
    <form onSubmit={onSubmit}>
      <ErrorList details={validationErrors || null} />
      <FormField htmlFor="skillFormSkillName" label="Skill name">
        <TextInput
          id="skillFormSkillName"
          type="text"
          required
          placeHolder="eg. a framework"
          value={skillForm?.name}
          onChange={e =>
            setSkillForm({ ...skillForm, name: e.target.value } as Skill)
          }
        />
      </FormField>

      <FormField htmlFor="skillFormHomepage" label="Homepage">
        <TextInput
          id="skillFormHomepage"
          type="text"
          required
          placeHolder="https://coolframework.rocks"
          value={skillForm?.homepage}
          onChange={e =>
            setSkillForm({ ...skillForm, homepage: e.target.value } as Skill)
          }
        />
      </FormField>

      <FormField htmlFor="skillFormDescription" label="Description">
        <TextInput
          id="skillFormDescription"
          type="text"
          required
          placeHolder="Short description of the framework"
          value={skillForm?.description}
          onChange={e =>
            setSkillForm({ ...skillForm, description: e.target.value } as Skill)
          }
        />
      </FormField>
      {children}
    </form>
  );
};
