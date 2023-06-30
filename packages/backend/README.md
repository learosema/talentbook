# Talentbook backend

This is a TypeScript node application using [express](https://expressjs.com) and [TypeORM](https://typeorm.io).

In the public/apidocs folder, there is a Swagger API documentation.
You can access the Swagger API on http://localhost:1337/apidocs.

## Setup

- You can run `npm install` here, but it is not needed if you have run `npm run bootstrap` in the root folder
- Before you deploy, set a strong JWT secret in your .env file. Set a strong key, otherwise it is possible to [bruteforce](https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/).

```sh
JWT_SECRET=insert_your_random_key_here
```

- You can configure a database in your ormconfig.json file. By default, a file based SQLite database is used, so it runs out of the box and no other dependencies are needed on the developer machine.
- run `npm start`
- the application is listening on http://localhost:1337/
- it may take some time until the server starts. This is because the database is initially created on startup. On model changes, the database is automatically updated.
- currently, there is no watch mode in the NPM scripts, you have to restart the server when making changes. Feel free to help me out here with a pull request, I found it quite difficult to get `ts-node` working.

## Folder structure

- `public/` is the wwwroot of the backend server. It is used for serving the API documentation
- `src/entities/` are where the data models go
- `src/services/` is where the implementation of all routes are
- `src/test-utils` utils for testing. Theres a `Fakexpress` class for mocking express request and response objects.

## Testing

- Testing is done via [jest](https://jestjs.io)
- This article may help you getting started: [Testing with Jest and TypeScript - the tricky parts](https://dev.to/terabaud/testing-with-jest-and-typescript-the-tricky-parts-1gnc)
