import { mocked } from 'jest-mock';

import { SkillApi, User } from '../../client/skill-api';
import { Ajax } from '../../client/ajax';
import { MyProfilePage } from './my-profile-page';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createRoot } from 'react-dom/client';

jest.mock('../../client/skill-api');

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn().mockImplementation(() => () => {}),
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
    const queryClient = new QueryClient();
    const root = createRoot(div);
    root.render(
      <QueryClientProvider client={queryClient}>
        <MyProfilePage />
      </QueryClientProvider>
    );
    root.unmount();
  });
});
