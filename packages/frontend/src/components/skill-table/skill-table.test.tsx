import ReactDOM from 'react-dom';
import { SkillTable } from './skill-table';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SkillTable editMode={false} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
