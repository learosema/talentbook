import { SkillPage } from './skill-page';
import { Skill, SkillApi, UserSkill } from '../../api/skill-api';
import ReactDOM from 'react-dom';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { Ajax } from '../../api/ajax';

jest.mock('../../api/skill-api');

describe('Skill page tests', () => {
  beforeEach(() => {
    const ajaxOfSkill: Partial<Ajax<Skill[]>> = {
      send: () => Promise.resolve([] as Skill[]),
      abort: jest.fn(),
    };
    const ajaxOfUserSkill: Partial<Ajax<UserSkill[]>> = {
      send: () => Promise.resolve([] as UserSkill[]),
      abort: jest.fn(),
    };
    mocked(SkillApi.getSkills).mockImplementation(
      () => ajaxOfSkill as Ajax<Skill[]>
    );
    mocked(SkillApi.getUserSkills).mockImplementation(
      () => ajaxOfUserSkill as Ajax<UserSkill[]>
    );
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SkillPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
