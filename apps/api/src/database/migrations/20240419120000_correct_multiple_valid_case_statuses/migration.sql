/*
  Warnings:

 Where cases have been migrated more than once, multiple valid CaseStatus records can be created.
 There should only be 1 valid CaseStatus record per case.

	This script corrects those values.  to be run in all environments inc Prod
	BOAS-1737 - Migrated cases have multiple valid case status records

*/
BEGIN TRY

BEGIN TRAN;

-- show the bad records
-- select all status records where valid=1 apart from the latest valid one
/* SELECT cs.* FROM CaseStatus cs
WHERE cs.valid = 1 AND cs.id NOT IN (
    -- get the latest valid caseStatus record for each case
    SELECT csLatest.id FROM CaseStatus csLatest
    INNER JOIN
        (SELECT caseId, MAX(createdAt) AS MaxDateTime
        FROM CaseStatus
        WHERE valid=1
        GROUP BY caseId) groupedtt
    ON csLatest.caseId = groupedtt.caseId
    AND csLatest.createdAt = groupedtt.MaxDateTime
) */

-- correct bad records to valid=0
UPDATE CaseStatus SET valid=0
WHERE valid = 1 AND id NOT IN (
    -- get the latest valid caseStatus record for each case
    SELECT csLatest.id FROM CaseStatus csLatest
    INNER JOIN
        (SELECT caseId, MAX(createdAt) AS MaxDateTime
        FROM CaseStatus
        WHERE valid=1
        GROUP BY caseId) groupedtt
    ON csLatest.caseId = groupedtt.caseId
    AND csLatest.createdAt = groupedtt.MaxDateTime
)

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
