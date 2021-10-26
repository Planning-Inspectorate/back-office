# back-office

## Database

### Running migrations

The migrations an be run with `npm run db:migrate`

The database can be seeded with `npm run db:seed`

Completed migrations are stored in the db so when you run the migrations again only new ones since teh last migration will be run.

Completed seeders are not stored in the db so will insert the same data each time they are run.

The migrations can be undone with `npx sequelize-cli db:migrate:undo:all`. This will delete all tables and leave an empty database.


