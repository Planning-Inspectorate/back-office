const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('HASAppeal', 'CaseOfficerEmail', Sequelize.STRING(255));
    await queryInterface.addColumn('HASAppeal', 'InspectorEmail', Sequelize.STRING(255));
    await queryInterface.addColumn('HASAppeal', 'ValidationOfficerEmail', Sequelize.STRING(255));
    await queryInterface.addColumn('HASAppeal', 'AppealStartDate', Sequelize.DATE);
    await queryInterface.addColumn('HASAppeal', 'AppealValidationDate', Sequelize.DATE);
    await queryInterface.addColumn('HASAppeal', 'QuestionnaireDueDate', Sequelize.DATE);
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('HASAppeal', 'CaseOfficerEmail');
    await queryInterface.removeColumn('HASAppeal', 'InspectorEmail');
    await queryInterface.removeColumn('HASAppeal', 'ValidationOfficerEmail');
    await queryInterface.removeColumn('HASAppeal', 'AppealStartDate');
    await queryInterface.removeColumn('HASAppeal', 'AppealValidationDate');
    await queryInterface.removeColumn('HASAppeal', 'QuestionnaireDueDate');
  },
};

module.exports = migration;
