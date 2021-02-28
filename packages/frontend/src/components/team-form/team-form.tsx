import React from 'react';
import { Team, TeamType } from '../../client/skill-api';
import { Button, ButtonType } from '../button/button';
import { Dropdown } from '../dropdown/dropdown';
import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextArea } from '../text-area/text-area';
import { TextInput } from '../text-input/text-input';

type TeamFormProps = {
  label: string;
  readOnly?: boolean;
  teamErrors: Partial<Team>;
  teamForm: Team;
  setTeamForm: (value: Team) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const TeamForm: React.FC<TeamFormProps> = ({
  label = 'Create new Team',
  readOnly = false,
  teamErrors = {},
  teamForm,
  setTeamForm,
  onSubmit,
}) => {
  const getTeamType = (str: string) => {
    const types: Record<string, TeamType> = {
      public: TeamType.PUBLIC,
      closed: TeamType.CLOSED,
      secret: TeamType.SECRET,
    };
    return str in types ? types[str] : TeamType.PUBLIC;
  };

  return (
    <form onSubmit={onSubmit}>
      <FieldSet legend={label}>
        <FormField htmlFor="teamName" label="Team Name" error={teamErrors.name}>
          <TextInput
            id="teamName"
            type="text"
            required
            placeHolder="JavaScript group"
            value={teamForm.name}
            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
            readOnly={readOnly}
          />
        </FormField>

        <FormField
          htmlFor="teamDescription"
          label="Description"
          error={teamErrors.description}
        >
          <TextArea
            id="teamDescription"
            required
            placeHolder="Description"
            value={teamForm.description}
            readOnly={readOnly}
            onChange={(e) =>
              setTeamForm({ ...teamForm, description: e.target.value })
            }
          />
        </FormField>

        <FormField
          htmlFor="teamHomePage"
          label="Home page"
          error={teamErrors.homepage}
        >
          <TextInput
            id="teamHomePage"
            type="text"
            required
            placeHolder="https://"
            value={teamForm.homepage}
            readOnly={readOnly}
            onChange={(e) =>
              setTeamForm({ ...teamForm, homepage: e.target.value })
            }
          />
        </FormField>

        <FormField htmlFor="teamTags" label="Tags" error={teamErrors.tags}>
          <TextInput
            id="teamTags"
            type="text"
            required
            placeHolder="engineering, javascript, ..."
            value={teamForm.tags}
            readOnly={readOnly}
            onChange={(e) => setTeamForm({ ...teamForm, tags: e.target.value })}
          />
        </FormField>
        <FormField htmlFor="teamType" label="Team Type">
          <Dropdown
            id="teamType"
            value={teamForm.type}
            disabled={readOnly}
            onChange={(e) =>
              setTeamForm({
                ...teamForm,
                type: getTeamType(e.target.value),
              })
            }
          >
            <option>public</option>
            <option>closed</option>
            <option>secret</option>
          </Dropdown>
        </FormField>
        {readOnly === false && (
          <Button type={ButtonType.Submit}>{label}</Button>
        )}
      </FieldSet>
    </form>
  );
};
