/*
  Warnings:

  - You are about to drop the `RepresentationContact` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- Upsert service user records
MERGE INTO ServiceUser AS target
USING (SELECT firstName, lastName, jobTitle, under18, organisationName, email, phoneNumber, contactMethod, addressId FROM [RepresentationContact]) AS source
ON target.email = source.email
WHEN MATCHED THEN
    UPDATE SET target.firstName = source.firstName,
			target.lastName = source.lastName,
			target.jobTitle = source.jobTitle,
			target.under18 = source.under18,
			target.organisationName = source.organisationName,
			target.email = source.email,
			target.phoneNumber = source.phoneNumber,
			target.contactMethod = source.contactMethod,
			target.addressId = source.addressId
WHEN NOT MATCHED BY TARGET THEN
    INSERT (firstName, lastName, jobTitle, under18, organisationName, email, phoneNumber, contactMethod, addressId)
    VALUES (source.firstName, source.lastName, source.jobTitle, source.under18, source.organisationName, source.email, source.phoneNumber, source.contactMethod, source.addressId);

-- Set Representative records
UPDATE r
SET r.representativeId = su.id
FROM [dbo].[Representation] r
JOIN [dbo].[RepresentationContact] rc ON r.id = rc.representationId
JOIN [dbo].[ServiceUser] su ON su.email = rc.email
WHERE rc.type = 'AGENT';

-- Set Represented records
UPDATE r
SET r.representedId = su.id
FROM [dbo].[Representation] r
JOIN [dbo].[RepresentationContact] rc ON r.id = rc.representationId
JOIN [dbo].[ServiceUser] su ON su.email = rc.email
WHERE rc.type != 'AGENT';

-- Set Represented Type
UPDATE r
SET r.representedType = rc.type
FROM [dbo].[Representation] r
JOIN [dbo].[RepresentationContact] rc ON r.id = rc.representationId
WHERE rc.type != 'AGENT';

-- DropTable
DROP TABLE [dbo].[RepresentationContact];

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_representativeId_fkey] FOREIGN KEY ([representativeId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_representedId_fkey] FOREIGN KEY ([representedId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
