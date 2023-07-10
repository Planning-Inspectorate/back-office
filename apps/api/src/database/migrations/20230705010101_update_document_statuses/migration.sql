BEGIN TRY

BEGIN TRAN;

-- This is a manually created script to update any existing document statuses to match changes in BOAS-763
-- not_user_checked is replaced with not_checked
-- user_checked is replaced with checked

UPDATE DocumentVersion SET publishedStatus = 'not_checked' WHERE publishedStatus = 'not_user_checked'
UPDATE DocumentVersion SET publishedStatusPrev = 'not_checked' WHERE publishedStatusPrev = 'not_user_checked'

UPDATE DocumentVersion SET publishedStatus = 'checked' WHERE publishedStatus = 'user_checked'
UPDATE DocumentVersion SET publishedStatusPrev = 'checked' WHERE publishedStatusPrev = 'user_checked'

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
