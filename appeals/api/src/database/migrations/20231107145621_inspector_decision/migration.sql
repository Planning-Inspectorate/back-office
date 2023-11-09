/*
  Warnings:

  - You are about to drop the column `decisionLetterFilename` on the `InspectorDecision` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[decisionLetterGuid]` on the table `InspectorDecision` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `decisionLetterGuid` to the `InspectorDecision` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[InspectorDecision] DROP COLUMN [decisionLetterFilename];
ALTER TABLE [dbo].[InspectorDecision] ADD [decisionLetterGuid] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_decisionLetterGuid_key] UNIQUE NONCLUSTERED ([decisionLetterGuid]);

-- AddForeignKey
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_decisionLetterGuid_fkey] FOREIGN KEY ([decisionLetterGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
