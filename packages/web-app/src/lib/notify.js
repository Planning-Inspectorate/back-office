const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../config/config');
const logger = require('./logger');
const { getAddressSingleLine, getAddressMultiLine } = require('./get-address');
const { getFormattedQuestionnaireDueDate } = require('./questionnaire-due-date');
const { getLpa } = require('../services/lpa.service');
const { isValidAppealForSendStartEmailToLPAEmail } = require('./notify-validation');

async function sendStartEmailToLPA(appeal) {
  if (!isValidAppealForSendStartEmailToLPAEmail(appeal)) {
    throw new Error('Appeal was not available.');
  }

  let lpa = {};
  try {
    lpa = await getLpa(appeal.localPlanningAuthorityId);
  } catch (e) {
    logger.error(
      { err: e, localPlanningAuthorityId: appeal.localPlanningAuthorityId },
      'Unable to find LPA from given lpaCode'
    );
  }

  if (!lpa || !lpa.name) {
    lpa = {
      name: appeal.localPlanningAuthorityId,
    };
  }

  try {
    if (!lpa.email) {
      throw new Error('Missing LPA email. This indicates an issue with the look up data.');
    }

    await NotifyBuilder.reset()
      .setTemplateId(config.services.notify.templates.startEmailToLpa)
      .setEmailReplyToId(config.services.notify.emailReplyToId.startEmailToLpa)
      .setDestinationEmailAddress(lpa.email)
      .setTemplateVariablesFromObject({
        'site address one line': getAddressSingleLine(appeal),
        'horizon id': appeal.caseReference,
        lpa: lpa.name,
        'planning application number': appeal.originalApplicationNumber,
        'site address': getAddressMultiLine(appeal),
        'questionnaire due date': getFormattedQuestionnaireDueDate(appeal),
        url: `${config.apps.lpaQuestionnaire.baseUrl}/${appeal.appealId}`,
        'appellant email address': appeal.creatorEmailAddress,
      })
      .setReference(appeal.appealId)
      .sendEmail();
  } catch (e) {
    logger.error({ err: e }, 'Unable to send start email to LPA.');
  }
}

module.exports = {
  sendStartEmailToLPA,
};
