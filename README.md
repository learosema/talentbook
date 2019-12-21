# Talentbook 

A somewhat-like LinkedIn thingy, written in TypeScript in the backend and frontend.
On the frontend side, React comes into play. TypeORM is used as a database layer.

SQLite is configured as the default database.

## setting things up

* Currently, two npm install's are necessary, one in the root folder, the other one in the frontend folder
* the frontend folder is bootstrapped via `create-react-app`
* start the backend via `npm run start-be`. You can browse the REST API endpoints via http://localhost:1337/apidocs/
* start the frontend via `npm run start-fe`.

## known issues

* The `ormconfig.json` thing needs to distinguish between production and development environment
