/*
  Warnings:

  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Application] DROP CONSTRAINT [Application_subSectorId_fkey];

-- CreateTable
CREATE TABLE [dbo].[Case] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000),
    [modifiedAt] DATETIME2 NOT NULL CONSTRAINT [Case_modifiedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Case_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [description] NVARCHAR(1000),
    [publishedAt] DATETIME2,
    [title] NVARCHAR(1000),
    CONSTRAINT [Case_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ApplicationDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [subSectorId] INT NOT NULL,
    [regionId] INT NOT NULL,
    CONSTRAINT [ApplicationDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CaseStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [CaseStatus_valid_df] DEFAULT 1,
    [subStateMachineName] NVARCHAR(1000),
    [compoundStateName] NVARCHAR(1000),
    [caseId] INT NOT NULL,
    CONSTRAINT [CaseStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
CREATE UNIQUE NONCLUSTERED INDEX [ApplicationDetails_caseId_key] ON [dbo].[ApplicationDetails]([caseId]);

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_subSectorId_fkey] FOREIGN KEY ([subSectorId]) REFERENCES [dbo].[SubSector]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseStatus] ADD CONSTRAINT [CaseStatus_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- Adds data to Case table
INSERT INTO [dbo].[Case] (reference, modifiedAt, title, description)
SELECT reference, modifiedAt, title, description
FROM [dbo].[Application];

-- Adds data to ApplicationDetails table
INSERT INTO [dbo].[ApplicationDetails] (caseId, subSectorId, regionId)
SELECT case_table.id as caseId, 
    application_table.subSectorId as subSectorId,
    application_table.regionId
FROM [dbo].[Application] as application_table
JOIN [dbo].[Case] as case_table
ON application_table.reference = case_table.reference;

-- Adds data to CaseStatus table
INSERT INTO [dbo].[CaseStatus] (caseId, status)
SELECT case_table.id as caseId, 
    application_table.status as status
FROM [dbo].[Application] as application_table
JOIN [dbo].[Case] as case_table
ON application_table.reference = case_table.reference;

-- DropTable
DROP TABLE [dbo].[Application];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
