import React from 'react';
import { Skill } from '../../api/skill-api';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';
import { ErrorList, ErrorItem } from '../error-list/error-list';

import './skill-details-form.scss';

type SkillDetailsFormProps = {
  editMode?: boolean;
  skillIsNew?: boolean;
  skillForm: Skill;
  setSkillForm: (form: Skill) => void;
  validationErrors: ErrorItem[] | null;
  onSubmit: (e: React.FormEvent) => void;
};

export const SkillDetailsForm: React.FC<SkillDetailsFormProps> = ({
  editMode = true,
  skillIsNew = true,
  skillForm,
  setSkillForm,
  validationErrors,
  onSubmit,
  children,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <datalist id="categories">
        <option>UX/UI Design</option>
        <option>Programming Language</option>
        <option>Framework</option>
        <option>SDK</option>
        <option>Methodology</option>
        <option>Soft Skill</option>
        <option>Graphics</option>
        <option>Data</option>
        <option>Science</option>
        <option>Architecture</option>
        <option>Project Management</option>
        <option>Paradigm</option>
      </datalist>
      <ErrorList details={validationErrors || null} />
      <FormField
        htmlFor="skillFormSkillName"
        label="Skill name"
        className={editMode === false ? 'skill-form-field--text' : ''}
      >
        {editMode ? (
          <TextInput
            id="skillFormSkillName"
            type="text"
            required
            readOnly={!skillIsNew}
            placeHolder="eg. a framework"
            value={skillForm.name}
            onChange={(e) =>
              setSkillForm({ ...skillForm, name: e.target.value } as Skill)
            }
          />
        ) : (
          <span>{skillForm.name}</span>
        )}
      </FormField>

      <FormField
        htmlFor="skillFormCategory"
        label="Category"
        className={editMode === false ? 'skill-form-field--text' : ''}
      >
        {editMode ? (
          <TextInput
            id="skillFormCategory"
            type="text"
            required
            placeHolder="eg. frameworks"
            value={skillForm.category || ''}
            list="categories"
            onChange={(e) =>
              setSkillForm({ ...skillForm, category: e.target.value } as Skill)
            }
          />
        ) : (
          <span>{skillForm.category}</span>
        )}
      </FormField>

      <FormField
        htmlFor="skillFormHomepage"
        label="Homepage"
        className={editMode === false ? 'skill-form-field--text' : ''}
      >
        {editMode ? (
          <TextInput
            id="skillFormHomepage"
            type="text"
            required
            placeHolder="https://coolframework.rocks"
            value={skillForm?.homepage}
            onChange={(e) =>
              setSkillForm({ ...skillForm, homepage: e.target.value } as Skill)
            }
          />
        ) : (
          <a
            href={skillForm.homepage}
            target="_blank"
            rel="noopener noreferrer"
          >
            {skillForm.homepage}
          </a>
        )}
      </FormField>

      <FormField
        htmlFor="skillFormDescription"
        label="Description"
        className={editMode === false ? 'skill-form-field--text' : ''}
      >
        {editMode ? (
          <TextInput
            id="skillFormDescription"
            type="text"
            required
            placeHolder="Short description of the framework"
            value={skillForm?.description}
            onChange={(e) =>
              setSkillForm({
                ...skillForm,
                description: e.target.value,
              } as Skill)
            }
          />
        ) : (
          <span>{skillForm.description}</span>
        )}
      </FormField>
      {children}
    </form>
  );
};
