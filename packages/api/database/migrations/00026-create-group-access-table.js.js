const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Group', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('Group', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_Group',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Group');
  },
};

module.exports = migration;
