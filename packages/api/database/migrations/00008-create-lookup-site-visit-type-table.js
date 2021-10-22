const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpSiteVisitType', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      TypeName: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('LookUpSiteVisitType', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_LookUpSiteVisitType',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpSiteVisitType');
  },
};

module.exports = migration;
