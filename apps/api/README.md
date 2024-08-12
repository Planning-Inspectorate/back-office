# CBOS API

## Structure

```
.
+-- src
|   +-- database
|   |   +-- migrations
|   |   |   +-- ...
|   |   +-- seed
|   +-- server
|   |   +-- applications
|   |   |   +-- ...
|   |   +-- config
|   |   +-- infrastructure
|   |   |   +-- ...
|   |   +-- middleware
|   |   +-- migration
|   |   |   +-- ...
|   |   +-- repositories
|   |   +-- utils
|   |   |   +-- ...
```

|-|-|
|-------------------------|-------------------------------------------------------------------|
| `database`              | Contains the Prisma schema, database migrations and seed data     |
| `server/applications`   | Main app code (routes, controllers and service methods)           |
| `server/config`         | Code for setting up configuration passed into the app             |
| `server/infrastructure` | Code for sending constructing and sending messages to Service Bus |
| `server/middleware`     | Custom Express middlewares                                        |
| `server/migration`      | API code for migrating data from Horizon into CBOS                |
| `server/repositories`   | Code for interacting with the database via Prisma                 |
| `server/utils`          | Shared, generic code                                              |
