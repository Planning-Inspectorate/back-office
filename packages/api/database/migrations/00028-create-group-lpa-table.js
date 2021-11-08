const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupLPA', {
      GroupID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      LocalPlanningAuthorityID: {
        type: Sequelize.STRING(9),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "GroupLPA" ADD CONSTRAINT "PK_GroupLPA" PRIMARY KEY ("GroupID", "LocalPlanningAuthorityID")'
    );
    await queryInterface.addConstraint('GroupLPA', {
      fields: ['GroupID'],
      type: 'foreign key',
      name: 'FK_GroupLPA_Group',
      references: {
        table: 'Group',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('GroupLPA', {
      fields: ['LocalPlanningAuthorityID'],
      type: 'foreign key',
      name: 'FK_GroupLPA_LookUpLPA',
      references: {
        table: 'LookUpLPA',
        field: 'LPA19Code',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('GroupLPA');
  },
};

module.exports = migration;
