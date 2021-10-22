const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpCaseStage', [
      {
        StageName: 'Received',
      },
      {
        StageName: 'Initial Checks',
      },
      {
        StageName: 'In Progress',
      },
      {
        StageName: 'Closed',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpCaseStage', null, {}),
};

module.exports = seeder;
