const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpQuestionnaireOutcome', [
      {
        Outcome: 'Complete',
      },
      {
        Outcome: 'Incomplete',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpQuestionnaireOutcome', null, {}),
};

module.exports = seeder;
