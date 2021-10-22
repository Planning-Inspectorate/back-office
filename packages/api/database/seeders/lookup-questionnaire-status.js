const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpQuestionnaireStatus', [
      {
        Status: 'Awaiting',
      },
      {
        Status: 'Received',
      },
      {
        Status: 'Overdue',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpQuestionnaireStatus', null, {}),
};

module.exports = seeder;
