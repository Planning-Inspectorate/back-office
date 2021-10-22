const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpDecisionOutcome', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      Outcome: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpDecisionOutcome', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpDecisionOutcome',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpDecisionOutcome');
  },
};

module.exports = migration;
