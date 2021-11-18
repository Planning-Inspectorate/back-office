# back-office

## Database

### Local env setup

1. Download [Azure Data Explorer](https://azure.microsoft.com/en-gb/features/storage-explorer) and connect to the database using the details above except the database, which should be left blank.

2. Create the database using Azure Data Explorer (right click the connection and select New Query)

   ```
   CREATE DATABASE backofficedev;
   ```

3. Create the following environment variables, by pasting the following commands into a new terminal window:

   ```
   export MSSQL_HOST=localhost
   export MSSQL_DATABASE=backofficedev
   export MSSQL_USERNAME=sa
   export MSSQL_PASSWORD=AbCd12345@~
   export MSSQL_DIALECT=mssql
   ```

4. Run the migrations, by changing to the `packages/api` directory and pasting the following command into the same terminal window as in step 3:

   ```
   npm run db:migrate
   ```

   Completed migrations are stored in the db so when you run the migrations again only new ones since the last migration will be run.

5. Seed the database, by changing to the `packages/api` directory and pasting the following command into the same terminal window as in step 3:

   ```
   npm run db:seed
   ```

   Completed seeders are not stored in the db so this should only be run once as it will insert the same data each time they are run.

6. Add some demo records using Azure Data Explorer (right click the connection and select Refresh, then right click the database and select New Query)

   ```
   INSERT INTO [HASAppealSubmission]
    ([ID], [AppealID], [CreatorEmailAddress], [CreatorName], [CreatorOriginalApplicant], [CreatorOnBehalfOf], [OriginalApplicationNumber],
    [SiteOwnership], [SiteInformOwners], [SiteRestriction], [SiteRestrictionDetails], [SafetyConcern], [SafetyConcernDetails],
    [SensitiveInformation], [TermsAgreed], [DecisionDate], [SubmissionDate])
   VALUES
    ('9214dd73-5bb3-4b81-acc0-4b01a7f6a146', '6ff8d0ef-3767-4258-b3d3-34d48fca238b', 'manish.sharma@example.com', 'Manish Sharma',
    1, 0, 'APP/Q9999/D/21/1234567', 1, 0, 0, '', 0, '', 0, 0, '2021-10-21', '2021-10-21');

   INSERT INTO [HASLPASubmission]
    ([ID], [LPAQuestionnaireID], [AppealID], [SubmissionDate], [SubmissionAccuracy], [SubmissionAccuracyDetails], [ExtraConditions],
    [ExtraConditionsDetails], [AdjacentAppeals], [AdjacentAppealsNumbers], [CannotSeeLand], [SiteAccess], [SiteAccessDetails],
    [SiteNeighbourAccess], [SiteNeighbourAccessDetails], [HealthAndSafetyIssues], [HealthAndSafetyDetails], [AffectListedBuilding],
    [AffectListedBuildingDetails], [GreenBelt], [ConservationArea], [OriginalPlanningApplicationPublicised],
    [DevelopmentNeighbourhoodPlanSubmitted], [DevelopmentNeighbourhoodPlanChanges], [LatestEvent])
   VALUES
    ('6922c408-e80a-472b-8b00-9377daec083d', '5c45c22d-a39c-4844-bee1-2f6829b42238', '6ff8d0ef-3767-4258-b3d3-34d48fca238b',
    '2021-11-01', 1, null, 0, null, 0, null, 1, 1, 'Easy site access', 1, 'Easy site neighbour access', 1,
    'There are some health and safety issues', 0, 'The site is not a listed building', 0, 0, 1, 1, 'The development neighbourhood plan changes', 1);

   INSERT INTO [AppealLink]
    ([ID], [AppealID],[LPAQuestionnaireID], [CaseReference], [CaseTypeID], [CaseStatusID], [AppellantName],
    [SiteAddressLineOne], [SiteAddressLineTwo], [SiteAddressTown], [SiteAddressCounty], [SiteAddressPostCode], [LocalPlanningAuthorityID],
    [QuestionnaireStatusID], [LatestEvent], [EventDateTime], [EventUserID], [EventUserName])
   VALUES
    ('9565dcf2-ebe6-42b1-8450-c8283abb8f53', '6ff8d0ef-3767-4258-b3d3-34d48fca238b', '5c45c22d-a39c-4844-bee1-2f6829b42238', 123456789,
    null, 1, 'An Apellant', 'Address 1', 'Address 2', 'Town', 'Country', 'Postcode', 'E69999999', 2, 1, null, null, null);
   ```

### Undoing migrations

The last migration can be undone as follows.

This can be useful if you are creating a new migration and need to run it several times.

```
npx sequelize-cli db:migrate:undo
```

All migrations can be undone as follows.

This will delete all tables and leave an empty database.

```
npx sequelize-cli db:migrate:undo:all
```

## API

Documentation for the Back Office API can be found at [http://localhost:3004/api-docs](http://localhost:3004/api-docs)
