# Talentbook

[![Build Status](https://travis-ci.org/terabaud/talentbook.svg?branch=master)](https://travis-ci.org/terabaud/talentbook)

Talentbook is a skill directory platform where you can share your experience level in certain technologies and wether you prefer to work with the technology or not.

This can help building teams or finding a mentor if you want to learn a new technology.

This project is inspired by the [SkillWill](https://github.com/sinnerschrader/SkillWill) tool at [SinnerSchrader](https://github.com/sinnerschrader) and the related bachelor thesis by [Torben Reetz]([https://github.com/t0rbn/]).

## Tech stack

- [TypeScript](https://www.typescriptlang.org/) + [TypeORM](https://typeorm.io/) in the backend (via node-ts, considering deno)
- [TypeScript](https://www.typescriptlang.org/) + [React](https://reactjs.org/) with hooks + [Parcel](https://parceljs.org) in the frontend

## Setting things up

```sh
npm install
npm run bootstrap

# start backend
npm run backend

# start frontend
npm run frontend
```

- The frontend is running on http://localhost:1234/
- In development mode, the API is proxied to the frontend via [express](https://expressjs.com) and the [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware), see [server.js](https://github.com/terabaud/talentbook/blob/master/frontend/dev-proxy/server.js)
- You can browse the storybook via `npm run storybook`, listening on http://localhost:9009/

## Additional setup

- specify a stronger key in the .env file. The ones provided by default are really weak.
- by default, an SQLite database is used (so, things are working out of the box, without any dockers or stuff).

## Backend API

- You can browse the REST API endpoints via http://localhost:1337/apidocs/

## Deployment

- Work in progress
