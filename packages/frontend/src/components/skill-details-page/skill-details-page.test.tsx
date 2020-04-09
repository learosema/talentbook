import React from 'react';
import ReactDOM from 'react-dom';
import { mocked } from 'ts-jest/utils';

import {
  Identity,
  Skill,
  SkillApi,
  UserSkill,
  ResultListItem,
} from '../../api/skill-api';
import { initialAppState, SkillDetailsState } from '../../store/app.state';
import { Ajax } from '../../api/ajax';
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
    const identity: Identity = { name: 'test', fullName: 'Test User' };
    const skillDetails: SkillDetailsState = initialAppState.skillDetails;
    const skillList: Skill[] = [];
    ReactDOM.render(
      <SkillDetailsPage
        dispatch={() => {}}
        identity={identity}
        skillDetails={skillDetails}
        skillList={skillList}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
