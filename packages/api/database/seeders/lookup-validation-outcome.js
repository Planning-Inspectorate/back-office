const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpValidationOutcome', [
      {
        Outcome: 'Valid',
      },
      {
        Outcome: 'Invalid',
      },
      {
        Outcome: 'Something missing or wrong',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpValidationOutcome', null, {}),
};

module.exports = seeder;
