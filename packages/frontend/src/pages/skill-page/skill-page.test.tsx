import { SkillPage } from './skill-page';
import { Skill, SkillApi, UserSkill } from '../../client/skill-api';
import { createRoot } from 'react-dom/client';
import { mocked } from 'jest-mock';
import { Ajax } from '../../client/ajax';

jest.mock('../../client/skill-api');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn().mockImplementation(() => () => {}),
}));

jest.mock('react-query', () => ({
  useQueryClient: jest.fn().mockImplementation(() => ({
    invalidateQueries: jest.fn(),
  })),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}))

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
    const root = createRoot(div);
    root.render(<SkillPage />);
    root.unmount();
  });
});
