# Talentbook 

Talentbook is a skill directory platform that helps building teams.

On talentbook, you can list your experience levels in your skills and wills in certain technologies (eg. knowledge of JS frameworks). You can also search for certain skills to find team mates or mentors and mentees. 

## Techstack

* TypeScript + TypeORM in the backend (via node-ts, considering deno)
* TypeScript + React in the frontend

## setting things up

* Currently, two npm install's are necessary, one in the root folder, the other one in the frontend folder
* the frontend folder is bootstrapped via `create-react-app`
* start the backend via `npm run start-be`. At this moment, the database is synchronized so changes to the entity models are automatically applied, so it takes a while until the API comes up.
* You can browse the REST API endpoints via http://localhost:1337/apidocs/
* start the frontend via `npm run start-fe`.
* The frontend is running on http://localhost:3000/ and the API is proxied via the [CRA](https://create-react-app.dev) backend integration feature.

## known issues

* The `ormconfig.json` thing needs to distinguish between production and development environment
* Development in IE/Edge currently doesn't work due to an issue in [`create-react-app`](https://github.com/facebook/create-react-app/issues/8153)

## Deployment

* Work in progress