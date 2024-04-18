/*
  Warnings:

  Some migrated cases / case shells made migrating project-updates have invalid case stage statuses,
	eg 'Pre-application' when it should be 'pre_application'.
	This script corrects those values.  to be run in all environments inc Prod
	BOAS-1651 - Arundel case not appearing in dashboard

*/
BEGIN TRY

BEGIN TRAN;

UPDATE CaseStatus SET [status] = 'acceptance' WHERE status = 'Acceptance (review of the application)';
UPDATE CaseStatus SET [status] = 'post_decision' WHERE status = 'Decided';
UPDATE CaseStatus SET [status] = 'decision' WHERE status = 'Decision';
UPDATE CaseStatus SET [status] = 'examination' WHERE status = 'Examination';
UPDATE CaseStatus SET [status] = 'pre_application' WHERE status = 'Pre-application';
UPDATE CaseStatus SET [status] = 'pre_examination' WHERE status = 'Pre-examination';
UPDATE CaseStatus SET [status] = 'recommendation' WHERE status = 'Recommendation';
UPDATE CaseStatus SET [status] = 'withdrawn' WHERE status = 'Withdrawn';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
