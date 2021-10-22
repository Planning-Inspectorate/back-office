const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpDecisionOutcome', [
      {
        Outcome: 'Allowed',
      },
      {
        Outcome: 'Dismissed',
      },
      {
        Outcome: 'Split decision',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpDecisionOutcome', null, {}),
};

module.exports = seeder;
