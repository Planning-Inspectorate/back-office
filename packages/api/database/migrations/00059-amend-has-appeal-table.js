const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('HASAppeal', 'MissingOrWrongReasons', Sequelize.TEXT);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('HASAppeal', 'MissingOrWrongReasons', Sequelize.STRING(4000));
  },
};

module.exports = migration;
