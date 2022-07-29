/*
  Warnings:

  - You are about to drop the column `regionId` on the `ApplicationDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ApplicationDetails] DROP CONSTRAINT [ApplicationDetails_regionId_fkey];

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] DROP COLUMN [regionId];

-- CreateTable
CREATE TABLE [dbo].[RegionsOnApplicationDetails] (
    [applicationDetailsId] INT NOT NULL,
    [regionId] INT NOT NULL,
    CONSTRAINT [RegionsOnApplicationDetails_pkey] PRIMARY KEY CLUSTERED ([applicationDetailsId],[regionId])
);

-- AddForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] ADD CONSTRAINT [RegionsOnApplicationDetails_applicationDetailsId_fkey] FOREIGN KEY ([applicationDetailsId]) REFERENCES [dbo].[ApplicationDetails]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] ADD CONSTRAINT [RegionsOnApplicationDetails_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
