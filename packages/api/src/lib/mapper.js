const mapQuestionnaireOutcome = (outcome) => {
  if (typeof outcome === 'undefined') {
    throw new Error('outcome is not defined');
  }

  switch (outcome) {
    case 'Complete':
      return 1;

    case 'Incomplete':
      return 2;

    default:
      return 3;
  }
};

module.exports = {
  mapQuestionnaireOutcome,
};
