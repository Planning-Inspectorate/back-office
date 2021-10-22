const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpValidationOutcome', {
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
    await queryInterface.addConstraint('LookUpValidationOutcome', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpValidationOutcome',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpValidationOutcome');
  },
};

module.exports = migration;
