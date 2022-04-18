/*
  Warnings:

  - You are about to drop the column `status` on the `Appeal` table. All the data in the column will be lost.
  - You are about to drop the column `statusUpdatedAt` on the `Appeal` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

alter table [dbo].[Appeal] drop CONSTRAINT Appeal_statusUpdatedAt_df;
alter table [dbo].[Appeal] drop CONSTRAINT Appeal_status_df;

-- AlterTable
ALTER TABLE [dbo].[Appeal] DROP COLUMN [status],
[statusUpdatedAt];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
