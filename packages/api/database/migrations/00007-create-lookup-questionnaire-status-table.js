const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpQuestionnaireStatus', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      Status: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpQuestionnaireStatus', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpQuestionnaireStatus',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpQuestionnaireStatus');
  },
};

module.exports = migration;
