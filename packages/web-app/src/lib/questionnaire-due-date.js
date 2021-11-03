const { addDays, endOfDay, format } = require('date-fns');

module.exports = {
  /**
   * Given an appeal object, return the due date for the Questionnaire.
   *
   * At present, there is only one appeal type - Householder. In future there will be more and this
   * logic will need to be updated. At the time of creation, `appeal.type` is not a 'thing', and so
   * we have no easy (i.e. non-brittle) way of determining what type of appeal we are dealing with.
   *
   * <b style="color: red;">Therefore all appeals are currently considered as Householder</b>
   *
   * @param appeal the appeal object
   * @returns {Date}
   */
  getQuestionnaireDueDate: (appeal) => {
    const householderAppealQuestionnaireAdditionalStartDays = 5;

    const dueDate = addDays(
      appeal.submissionDate,
      householderAppealQuestionnaireAdditionalStartDays
    );

    const date = endOfDay(dueDate);
    return date;
  },

  /**
   * Given an appeal object, return the formatted due date for the Questionnaire.
   *
   * @param appeal the appeal object
   * @param dateFormat an optional date format string - https://date-fns.org/v2.22.1/docs/format
   * @returns {string}
   */
  getFormattedQuestionnaireDueDate: (appeal, dateFormat = 'dd MMMM yyyy') =>
    format(module.exports.getQuestionnaireDueDate(appeal), dateFormat),
};
