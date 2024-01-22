/*
  Warnings:

  - You are about to drop the column `linkedAppealId` on the `Appeal` table. All the data in the column will be lost.
  - You are about to drop the column `otherAppealId` on the `Appeal` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_linkedAppealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_otherAppealId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Appeal] DROP COLUMN [linkedAppealId],
[otherAppealId];

-- CreateTable
CREATE TABLE [dbo].[AppealRelationship] (
    [id] INT NOT NULL IDENTITY(1,1),
    [parentRef] NVARCHAR(1000) NOT NULL,
    [childRef] NVARCHAR(1000) NOT NULL,
    [parentId] INT,
    [childId] INT,
    [linkingDate] DATETIME2 NOT NULL CONSTRAINT [AppealRelationship_linkingDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AppealRelationship_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
