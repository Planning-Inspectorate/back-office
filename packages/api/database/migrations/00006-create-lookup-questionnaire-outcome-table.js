const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpQuestionnaireOutcome', {
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
    await queryInterface.addConstraint('LookUpQuestionnaireOutcome', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpQuestionnaireOutcome',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpQuestionnaireOutcome');
  },
};

module.exports = migration;
