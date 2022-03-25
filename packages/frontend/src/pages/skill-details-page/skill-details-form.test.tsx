import ReactDOM from 'react-dom';
import { SkillDetailsForm } from './skill-details-form';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const noop = () => {};
  const skillForm = {
    name: 'TypeScript',
    description: '',
    homepage: '',
    category: '',
  };
  ReactDOM.render(
    <SkillDetailsForm
      setSkillForm={noop}
      onSubmit={noop}
      skillForm={skillForm}
      validationErrors={[]}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
