import React from 'react';
import ReactDOM from 'react-dom';
import { mocked } from 'ts-jest/utils';

import {
  Skill,
  SkillApi,
  UserSkill,
  ResultListItem,
} from '../../client/skill-api';

import { Ajax } from '../../client/ajax';
import { SkillDetailsPage } from './skill-details-page';

jest.mock('../../api/skill-api');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => ({ skill: 'jquery' })),
  useHistory: jest.fn(),
}));

describe('Skill Details page tests', () => {
  beforeEach(() => {
    const ajaxOfSkill: Partial<Ajax<Skill[]>> = {
      send: () => Promise.resolve([] as Skill[]),
      abort: jest.fn(),
    };
    const ajaxOfUserSkill: Partial<Ajax<UserSkill[]>> = {
      send: () => Promise.resolve([] as UserSkill[]),
      abort: jest.fn(),
    };
    const ajaxOfResultListItem: Partial<Ajax<ResultListItem[]>> = {
      send: () => Promise.resolve([] as ResultListItem[]),
      abort: jest.fn(),
    };
    mocked(SkillApi.query).mockImplementation(
      () => ajaxOfResultListItem as Ajax<ResultListItem[]>
    );
    mocked(SkillApi.getSkills).mockImplementation(
      () => ajaxOfSkill as Ajax<Skill[]>
    );
    mocked(SkillApi.getUserSkills).mockImplementation(
      () => ajaxOfUserSkill as Ajax<UserSkill[]>
    );
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SkillDetailsPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
