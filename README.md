# Talentbook

[![Build Status](https://travis-ci.com/terabaud/talentbook.svg?branch=main)](https://travis-ci.com/terabaud/talentbook)

Talentbook is a skill directory platform where you can share your experience level in certain technologies and wether you prefer to work with the technology or not.

This can help building teams or finding a mentor if you want to learn a new technology.

This project is inspired by the [SkillWill](https://github.com/sinnerschrader/SkillWill) tool at [SinnerSchrader](https://github.com/sinnerschrader) and the related bachelor thesis by [Torben Reetz]([https://github.com/t0rbn/]).

## Tech stack

- [TypeScript](https://www.typescriptlang.org/) + [TypeORM](https://typeorm.io/) in the backend (via node-ts, considering deno)
- [TypeScript](https://www.typescriptlang.org/) + [React](https://reactjs.org/) with hooks + [Parcel](https://parceljs.org) in the frontend

## Running talentbook on Docker

talentbook comes with a ready-to-use docker configuration:

- to build the docker images, you can use the `./docker-build.sh` shell script
- `docker compose up -d` to start, `docker compose down` to stop the services
- `docker compose --profile dev up` to additionally start development-related containers (such as [smtp4dev](https://github.com/rnwood/smtp4dev) and [adminer](https://adminer.org))
- to reset the database, delete the volume via `docker volume rm talentbook_pgdata`

## Running talentbook locally

```sh
npm install
npm run bootstrap

# start backend
npm run backend

# start frontend
npm run frontend

# start smtp4dev
npm run smtp4dev

# Run backend, frontend and smtp4dev both concurrently
npm start
```

- The frontend is running on <http://localhost:1234/>
- In development mode, the API is proxied to the frontend via [express](https://expressjs.com) and the [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware), see [server.js](https://github.com/terabaud/talentbook/blob/master/packages/frontend/dev-proxy/server.js)
- You can browse the storybook via `npm run storybook`, listening on <http://localhost:9009/>

## Additional setup

### Database

The database connection is configured in the `.env.local` file. You can copy the defaults from the `.env` file.

Defaults are:

```sh
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=talentbook
DB_PW=talentbook
DB_NAME=talentbook
```

Currently, only postgres is supported.

### GitHub integration

You can provide a "Login/Sign Up via Github" button. Create an oauth key and put them here:

```sh
# packages/frontend/.env.local:
GITHUB_CLIENT_ID=deadbeefdeadbeef

# packages/backend/.env.local:
GITHUB_CLIENT_ID=deadbeefdeadbeef
GITHUB_CLIENT_SECRET=deadbeefdeadbeefdeadbeefdeadbeef
```

## Backend API

- You can browse the REST API endpoints via <http://localhost:8001/apidocs/>
