import { createRoot } from 'react-dom/client';
import { mocked } from 'jest-mock';

import {
  Skill,
  SkillApi,
  UserSkill,
  ResultListItem,
} from '../../client/skill-api';

import { Ajax } from '../../client/ajax';
import { SkillDetailsPage } from '.';
import { QueryClient, QueryClientProvider } from 'react-query';

jest.mock('../../client/skill-api');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => ({ skill: 'jquery' })),
  useNavigate: jest.fn().mockImplementation(() => () => {}),
  Routes: jest.fn().mockImplementation(({ children }) => <>{children}</>),
  Route: jest.fn().mockImplementation(() => <></>),
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
    const root = createRoot(div);
    const queryClient = new QueryClient();
    root.render(
      <QueryClientProvider client={queryClient}>
        <SkillDetailsPage />
      </QueryClientProvider>
    );
    root.unmount();
  });
});
