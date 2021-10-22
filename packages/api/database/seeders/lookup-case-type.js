const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpCaseType', [
      {
        TypeName: 'Enforcement Notice Appeal',
      },
      {
        TypeName: 'Householder Appeal (HAS)',
      },
      {
        TypeName: 'Enforcement Listed Building and Conservation Area Appeal',
      },
      {
        TypeName: 'Discontinuance Notice Appeal',
      },
      {
        TypeName: 'Advertisement Appeal',
      },
      {
        TypeName: 'Community Infrastructure Levy',
      },
      {
        TypeName: 'Planning Obligation Appeal',
      },
      {
        TypeName: 'Planning Appeal',
      },
      {
        TypeName: 'Lawful Development Certificate Appeal',
      },
      {
        TypeName: 'Planning Listed Building and Conservation Area Appeal',
      },
      {
        TypeName: 'Commercial (CAS) Appeal',
      },
      {
        TypeName: 'High Hedges',
      },
      {
        TypeName: 'Hedgerow',
      },
      {
        TypeName: 'Fast Track Trees/Trees',
      },
      {
        TypeName: 'Rights of Way',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpCaseType', null, {}),
};

module.exports = seeder;
