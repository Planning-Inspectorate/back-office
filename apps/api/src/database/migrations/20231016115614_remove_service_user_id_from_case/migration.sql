/*
  Warnings:

  - You are about to drop the column `serviceUserId` on the `Case` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_serviceUserId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Case] DROP COLUMN [serviceUserId];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantId_fkey] FOREIGN KEY ([applicantId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
