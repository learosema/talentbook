import { SkillTable } from './skill-table';
import { createRoot } from 'react-dom/client';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<SkillTable editMode={false} />);
  root.unmount();
});
