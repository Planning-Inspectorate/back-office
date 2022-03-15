## Creating a new migration

Edit the `schema.prisma` file to match the desired database schema.

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
