/*
  Warnings:

  - A unique constraint covering the columns `[azureReference]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE UNIQUE INDEX [User_azureReference_key] ON [dbo].[User]([azureReference]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
