const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpCaseStatus', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      StatusName: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpCaseStatus', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpCaseStatus',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpCaseStatus');
  },
};

module.exports = migration;
