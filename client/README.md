## Client

This folder holds all client-side code. The client code is written using Vue.js.

## Building

1. First install the dependencies with:
   `npm install`
1. Configure the urls and the base path for you production environment by creating a file in the client directory called `.env.production.local`. You can start by copying the file `.env.development`. The configuration in the `.env.production.local` file will automatically be used when building, and the one in `.env.development` will be used when serving the project locally.
1. Build the project for production:
   `npx vue-cli-service build`
1. Serve the project locally for development: `npx vue-cli-service serve`

## Deploying

When built the project files be put in the `dist/` directory. These files should be put the server's `public/` folder.
