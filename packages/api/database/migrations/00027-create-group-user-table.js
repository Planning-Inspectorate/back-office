const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupUser', {
      GroupID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      UserID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      UserFirstName: {
        type: Sequelize.STRING(64),
      },
      UserSurname: {
        type: Sequelize.STRING(64),
      },
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "GroupUser" ADD CONSTRAINT "PK_GroupUser" PRIMARY KEY ("GroupID", "UserID")'
    );
    await queryInterface.addConstraint('GroupUser', {
      fields: ['GroupID'],
      type: 'foreign key',
      name: 'FK_GroupUser_Group',
      references: {
        table: 'Group',
        field: 'ID',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('GroupUser');
  },
};

module.exports = migration;
