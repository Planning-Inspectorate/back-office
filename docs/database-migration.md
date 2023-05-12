## Creating a new migration

Edit the `apps/api/src/database/schema.prisma` file to match the desired database schema.

Run the migration using the command:

```shell
npm run db:migrate
```

which should prompt you to name your migration (such as `create appeals` or `adds postcode to address`). Now the changes should be in your database.

## If your database is out of date

Use the same command to progress your database to match the latest version:

```shell
npm run db:migrate
```

## If this is your first time setting up the project

After running migrations to set up the database, you'll also need to seed it with data:

```shell
npm run db:seed
```
