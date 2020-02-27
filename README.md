# Talentbook

Talentbook is a skill directory platform where you can share your experience level in certain technologies and wether you prefer to work with the technology or not.

This can help building teams or finding a mentor if you want to learn a new technology.

## Tech stack

- [TypeScript](https://www.typescriptlang.org/) + [TypeORM](https://typeorm.io/) in the backend (via node-ts, considering deno)
- [TypeScript](https://www.typescriptlang.org/) + [React](https://reactjs.org/) + [Parcel](https://parceljs.org) in the frontend

## setting things up

- Currently, three npm install's are necessary, one in the root folder, the other ones in the frontend and backend folders
- specify a stronger key in the .env file. The ones provided by default are really weak.
- start the backend via `npm run backend`.
- start the frontend via `npm run frontend`.
- In development mode, an SQLite database is used. An sqlite3 file is automatically created on the first start.
- At this moment, I don't like to mess with migrations. So, the database is synchronized. Changes to the entity models are automatically applied, but it takes a while until the API comes up.
- You can browse the REST API endpoints via http://localhost:1337/apidocs/
- The frontend is running on http://localhost:1234/ -
- In development mode, the API is proxied to the frontend via [express](https://expressjs.com) and the [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware), see [server.js](https://github.com/terabaud/talentbook/blob/master/frontend/dev-proxy/server.js)
- You can browse the storybook via `npm run storybook`

## Deployment

- Work in progress
