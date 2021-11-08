function isValidAppealForSendStartEmailToLPAEmail(appeal) {
  return (
    typeof appeal?.appealId !== 'undefined' &&
    typeof appeal?.localPlanningAuthorityId !== 'undefined' &&
    typeof appeal?.caseReference !== 'undefined' &&
    typeof appeal?.creatorEmailAddress !== 'undefined' &&
    typeof appeal?.originalApplicationNumber !== 'undefined'
  );
}

module.exports = {
  isValidAppealForSendStartEmailToLPAEmail,
};
