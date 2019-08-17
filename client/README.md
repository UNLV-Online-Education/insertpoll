## Client

This folder holds all client-side code. The client code is written using Vue.js.

## Building

1. First install the dependencies with:
   `npm install`
1. Configure the urls and the base path for you production environment by creating a file in the client directory called `.env.production.local`. You can start by copying the file `.env.development`.
1. Build the project:
   `npx vue-cli-service build` for production, or `npx vue-cli-service serve` to run the project locally for development.
