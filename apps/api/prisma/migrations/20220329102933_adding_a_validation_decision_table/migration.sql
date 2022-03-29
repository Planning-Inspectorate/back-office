BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ValidationDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ValidationDecision_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [decision] NVARCHAR(1000) NOT NULL,
    [namesDoNotMatch] BIT NOT NULL CONSTRAINT [ValidationDecision_namesDoNotMatch_df] DEFAULT 0,
    [sensitiveInfo] BIT NOT NULL CONSTRAINT [ValidationDecision_sensitiveInfo_df] DEFAULT 0,
    [missingOrWrongDocs] BIT NOT NULL CONSTRAINT [ValidationDecision_missingOrWrongDocs_df] DEFAULT 0,
    [inflamatoryComments] BIT NOT NULL CONSTRAINT [ValidationDecision_inflamatoryComments_df] DEFAULT 0,
    [openedInError] BIT NOT NULL CONSTRAINT [ValidationDecision_openedInError_df] DEFAULT 0,
    [wrongAppealTypeUsed] BIT NOT NULL CONSTRAINT [ValidationDecision_wrongAppealTypeUsed_df] DEFAULT 0,
    [outOfTime] BIT NOT NULL CONSTRAINT [ValidationDecision_outOfTime_df] DEFAULT 0,
    [noRightOfAppeal] BIT NOT NULL CONSTRAINT [ValidationDecision_noRightOfAppeal_df] DEFAULT 0,
    [notAppealable] BIT NOT NULL CONSTRAINT [ValidationDecision_notAppealable_df] DEFAULT 0,
    [lPADeemedInvalid] BIT NOT NULL CONSTRAINT [ValidationDecision_lPADeemedInvalid_df] DEFAULT 0,
    [otherReasons] NVARCHAR(1000),
    CONSTRAINT [ValidationDecision_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ValidationDecision] ADD CONSTRAINT [ValidationDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
