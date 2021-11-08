const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupAccess', {
      GroupID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CaseTypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CaseProcedureID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "GroupAccess" ADD CONSTRAINT "PK_GroupAccess" PRIMARY KEY ("GroupID", "CaseTypeID","CaseProcedureID")'
    );
    await queryInterface.addConstraint('GroupAccess', {
      fields: ['CaseTypeID'],
      type: 'foreign key',
      name: 'FK_GroupAccess_LookUpCaseType',
      references: {
        table: 'LookUpCaseType',
        field: 'ID',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('GroupAccess');
  },
};

module.exports = migration;
