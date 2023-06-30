import { createRoot } from 'react-dom/client';

import { Button, ButtonKind, ButtonType } from './button';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <Button kind={ButtonKind.Primary} type={ButtonType.Button} />
  );
  root.unmount();
});
