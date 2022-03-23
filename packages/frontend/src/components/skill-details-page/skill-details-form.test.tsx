import ReactDOM from 'react-dom';
import { SkillDetailsForm } from './skill-details-form';
import { initialAppState } from '../../store/app.state';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const noop = () => {};
  const skillForm = initialAppState.skillDetails.editForm;
  ReactDOM.render(
    <SkillDetailsForm
      setSkillForm={noop}
      onSubmit={noop}
      skillForm={skillForm}
      skillIsNew={true}
      validationErrors={[]}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
