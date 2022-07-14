BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] ADD [locationDescription] NVARCHAR(1000),
[mapZoomLevel] NVARCHAR(1000),
[firstNotifiedAt] DATETIME2,
[submissionAt] DATETIME2;

-- CreateTable
CREATE TABLE [dbo].[ServiceCustomer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organisationName] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    [caseId] INT NOT NULL,
    CONSTRAINT [ServiceCustomer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GridReference] (
    [id] INT NOT NULL IDENTITY(1,1),
    [easting] INT,
    [northing] INT,
    [caseId] INT NOT NULL,
    CONSTRAINT [GridReference_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [GridReference_caseId_key] UNIQUE NONCLUSTERED ([caseId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ServiceCustomer] ADD CONSTRAINT [ServiceCustomer_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceCustomer] ADD CONSTRAINT [ServiceCustomer_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GridReference] ADD CONSTRAINT [GridReference_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
