import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';

import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { SkillApi } from './api/skill-api';

ReactDOM.render(<App />, document.getElementById('root'));

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


async function main() {
  console.log(await SkillApi.getVersion());
}

main();