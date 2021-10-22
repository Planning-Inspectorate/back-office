const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpQueueType', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      Type: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpQueueType', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpQueueType',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpQueueType');
  },
};

module.exports = migration;
