const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpCaseStatus', [
      {
        StatusName: 'Appeal Received',
      },
      {
        StatusName: 'Appeal Started',
      },
      {
        StatusName: 'Closed',
      },
      {
        StatusName: 'Something missing or wrong',
      },
      {
        StatusName: 'Available for inspectors',
      },
      {
        StatusName: 'Awaiting decision',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpCaseStatus', null, {}),
};

module.exports = seeder;
