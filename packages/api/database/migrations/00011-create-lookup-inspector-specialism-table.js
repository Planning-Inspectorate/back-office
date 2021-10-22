const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpInspectorSpecialism', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      Specialism: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpInspectorSpecialism', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpInspectorSpecialism',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpInspectorSpecialism');
  },
};

module.exports = migration;
