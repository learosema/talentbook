import ReactDOM from 'react-dom';
import { Button, ButtonKind, ButtonType } from './button';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Button kind={ButtonKind.Primary} type={ButtonType.Button} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
