import React from 'react';
import ReactDOM from 'react-dom';
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
    ReactDOM.render(<HomeIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Skill icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SkillIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Cog icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CogIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Darkmode icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DarkmodeIcon darkMode={false} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render User icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UserIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Comapny icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CompanyIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Trashcan icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TrashcanIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Globe icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GlobeIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Close icon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CloseIcon />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('render Logo', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Logo />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
