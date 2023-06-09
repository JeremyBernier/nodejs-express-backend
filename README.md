# Node.js Express Boilerplate by Jeremy Bernier

This is an example of a Node.js server using Express for a basic blog with PostgreSQL. This is the basic scaffolding I used when building sites like [MindGarden](https://mindgarden.app) and my personal site [jbernier.com](https://www.jbernier.com)

- Authentication: JWT cookies
- API: REST API and GraphQL
- CI/CD: GitHub Actions

Libraries used: Typeorm, Typegraphql, Apollo (for GraphQL). GraphQL server is commented out in the code.

Note: This is just a demo.

## Instructions

### Populate .env files

Rename `.env.sample` to `.env` and populate file with given environment variables (eg. database credentials)

### Run Postgres database (or can skip and do it yourself)

```
docker-compose up -d
```

You'll need to create a database referenced in your .env file (POSTGRES_DATABASE)

```
# View list of running Docker containers to get container ID
docker ps

docker exec -it <POSTGRES_CONTAINER_ID> psql -U postgres
CREATE DATABASE $POSTGRES_DATABASE
```

### Run Node.js server

```
pnpm install
pnpm dev
```

REST API server will be running on http://localhost:4000/v1

GraphQL server is commented out by default, but if you uncomment it then it will be running on http://localhost:4000/graphql

You can test the REST API server by loading `http://localhost:4000/v1/posts` in your browser. You should get `{data:[]}`