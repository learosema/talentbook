import React from 'react';
import ReactDOM from 'react-dom';
import { mocked } from 'ts-jest/utils';

import { Identity, SkillApi, User } from '../../api/skill-api';
import { initialAppState } from '../../store/app.state';
import { Ajax } from '../../api/ajax';
import { MyProfilePage } from './my-profile-page';

jest.mock('../../api/skill-api');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => ({ skill: 'jquery' })),
  useHistory: jest.fn(),
}));

describe('MyProfile page tests', () => {
  beforeEach(() => {
    const testUser = { name: 'Test' } as User;
    const ajaxOfUser: Partial<Ajax<User>> = {
      send: () => Promise.resolve(testUser),
      abort: jest.fn(),
    };
    mocked(SkillApi.getUser).mockImplementation(() => ajaxOfUser as Ajax<User>);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    const identity: Identity = { name: 'test', fullName: 'Test User' };
    const myProfile = initialAppState.myProfile;
    ReactDOM.render(
      <MyProfilePage
        dispatch={() => {}}
        identity={identity}
        myProfile={myProfile}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
