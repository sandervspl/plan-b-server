# REST API Server Boilerplate

## Getting started
To quickly install the boilerplate you can run `npx create-sandervspl api <folder name>`.

Manually:
```
$ git clone https://github.com/sandervspl/rest-api-server
```

```
$ cd rest-api-server && npm i
```

Configure api and database details in `src/config/apiconfig.ts` & `src/config/Secret.ts` before running.

Start development server
```
$ npm run dev
```

Go to `localhost:8080/user` on an app like Postman to see if it all works.

## Deployment
Create a build for production, this will add a `/dist` folder to the root with all bundles.  
```
$ npm run build
```

Run the server file to start server:
```
$ npm run start
```
