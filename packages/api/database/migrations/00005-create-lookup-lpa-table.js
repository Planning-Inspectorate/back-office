const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LookUpLPA', {
      LPA19Code: {
        type: Sequelize.STRING(9),
        allowNull: false,
      },
      LPA19Name: {
        type: Sequelize.STRING(51),
      },
      Email: {
        type: Sequelize.STRING(255),
      },
      Domain: {
        type: Sequelize.STRING(128),
      },
      InTrial: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
    });
    await queryInterface.addConstraint('LookUpLPA', {
      fields: ['LPA19Code'],
      type: 'primary key',
      name: 'PK_LookUpLPA',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LookUpLPA');
  },
};

module.exports = migration;
