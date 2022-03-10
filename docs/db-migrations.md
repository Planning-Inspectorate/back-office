# Creating migrations

To create a migration, follow the instructions [here](https://sequelize.org/v6/manual/migrations.html#creating-the-first-model--and-migration-).

Something to keep in mind, the generated migrations will not follow ES6, so any new model you create will need to be adjusted to ES6 standard.

Additionally, the migration file extension should be changes to `cjs`.

To run a migration, run the command:
```shell
npm run db:migrate
```