const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpCaseStage', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      StageName: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpCaseStage', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpCaseStage',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpCaseStage');
  },
};

module.exports = migration;
