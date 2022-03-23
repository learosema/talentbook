import React from 'react';
import ReactDOM from 'react-dom';
import { mocked } from 'ts-jest/utils';

import { SkillApi, UserSkill, User } from '../../client/skill-api';

import { Ajax } from '../../client/ajax';
import { ProfilePage } from './profile-page';

jest.mock('../../client/skill-api');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => ({ skill: 'jquery' })),
  useHistory: jest.fn(),
}));

describe('Proflie page tests', () => {
  beforeEach(() => {
    const testUser = { name: 'Test' } as User;
    const ajaxOfUser: Partial<Ajax<User>> = {
      send: () => Promise.resolve(testUser),
      abort: jest.fn(),
    };
    const ajaxOfUserSkill: Partial<Ajax<UserSkill[]>> = {
      send: () => Promise.resolve([] as UserSkill[]),
      abort: jest.fn(),
    };
    mocked(SkillApi.getUser).mockImplementation(() => ajaxOfUser as Ajax<User>);
    mocked(SkillApi.getUserSkills).mockImplementation(
      () => ajaxOfUserSkill as Ajax<UserSkill[]>
    );
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ProfilePage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
