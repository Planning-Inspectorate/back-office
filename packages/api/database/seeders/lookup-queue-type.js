const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpQueueType', [
      {
        Type: 'HAS Appeals',
      },
      {
        Type: 'HAS LPA Questionnaire',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpQueueType', null, {}),
};

module.exports = seeder;
