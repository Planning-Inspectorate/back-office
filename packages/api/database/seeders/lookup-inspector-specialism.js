const seeder = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('LookUpInspectorSpecialism', [
      {
        Specialism: 'General',
      },
      {
        Specialism: 'Appearance Design',
      },
    ]),
  down: (queryInterface) => queryInterface.bulkDelete('LookUpInspectorSpecialism', null, {}),
};

module.exports = seeder;
