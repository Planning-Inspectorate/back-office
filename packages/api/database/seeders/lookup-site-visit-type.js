const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpSiteVisitType', [
      {
        TypeName: 'Access required',
      },
      {
        TypeName: 'Unaccompanied',
      },
      {
        TypeName: 'Accompanied',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpSiteVisitType', null, {}),
};

module.exports = seeder;
