import { FormField } from './form-field';
import { createRoot } from 'react-dom/client';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<FormField label="Name" htmlFor="name" />);
  root.unmount();
});
