import { createRoot } from 'react-dom/client';

import {
  HomeIcon,
  SkillIcon,
  CogIcon,
  DarkmodeIcon,
  UserIcon,
  Logo,
  CompanyIcon,
  TrashcanIcon,
  CloseIcon,
  GlobeIcon,
} from './svg-icons';


describe('SVG icon tests', () => {
  test('render Home icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<HomeIcon />);
    root.unmount();
  });

  test('render Skill icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<SkillIcon />);
    root.unmount();
  });

  test('render Cog icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<CogIcon />);
    root.unmount();
  });

  test('render Darkmode icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<DarkmodeIcon darkMode={false} />);
    root.unmount();
  });

  test('render User icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<UserIcon />);
    root.unmount();
  });

  test('render Comapny icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<CompanyIcon />);
    root.unmount();
  });

  test('render Trashcan icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<TrashcanIcon />);
    root.unmount();
  });

  test('render Globe icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<GlobeIcon />);
    root.unmount();
  });

  test('render Close icon', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<CloseIcon />);
    root.unmount();
  });

  test('render Logo', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<Logo />);
    root.unmount();
  });
});
