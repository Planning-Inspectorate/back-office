const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpCaseType', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      TypeName: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpCaseType', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpCaseType',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpCaseType');
  },
};

module.exports = migration;
