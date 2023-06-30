import { createRoot } from 'react-dom/client';

import { SkillDetailsForm } from './skill-details-form';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  const noop = () => {};
  const skillForm = {
    name: 'TypeScript',
    description: '',
    homepage: '',
    category: '',
  };
  root.render(
    <SkillDetailsForm
      setSkillForm={noop}
      onSubmit={noop}
      skillForm={skillForm}
      validationErrors={[]}
    />
  );
  root.unmount();
});
