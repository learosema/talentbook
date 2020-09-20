import React, { useState } from 'react';

import { FieldSet } from '../field-set/field-set';
import { FormField } from '../form-field/form-field';
import { TextInput } from '../text-input/text-input';

import './teams-page.scss';

export const TeamsPage = () => {
  const [teamFilter, setTeamFilter] = useState<string>('');

  return (
    <div className="teams-page">
      <h2>Teams</h2>
      <FieldSet legend="Search teams">
        <FormField htmlFor="filterTeams" label="Filter teams">
          <TextInput
            id="filterTeams"
            type="text"
            required
            placeHolder="search term"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          />
        </FormField>
      </FieldSet>
    </div>
  );
};
