/*
  Warnings:

  - You are about to drop the column `visitSlot` on the `SiteVisit` table. All the data in the column will be lost.
  - You are about to drop the column `visitType` on the `SiteVisit` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SiteVisit] ALTER COLUMN [visitDate] DATETIME2 NULL;
ALTER TABLE [dbo].[SiteVisit] DROP COLUMN [visitSlot],
[visitType];
ALTER TABLE [dbo].[SiteVisit] ADD [siteVisitTypeId] INT,
[visitEndTime] NVARCHAR(1000),
[visitStartTime] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[SiteVisitType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SiteVisitType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisitType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_siteVisitTypeId_fkey] FOREIGN KEY ([siteVisitTypeId]) REFERENCES [dbo].[SiteVisitType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
