BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] DROP CONSTRAINT [LPAQuestionnaire_procedureTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] DROP CONSTRAINT [LPAQuestionnaire_scheduleTypeId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_procedureTypeId_fkey] FOREIGN KEY ([procedureTypeId]) REFERENCES [dbo].[ProcedureType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_scheduleTypeId_fkey] FOREIGN KEY ([scheduleTypeId]) REFERENCES [dbo].[ScheduleType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
