const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('AppealLink', 'QuestionnaireStatusID', Sequelize.INTEGER);
    await queryInterface.addConstraint('AppealLink', {
      fields: ['QuestionnaireStatusID'],
      type: 'foreign key',
      name: 'FK_AppealLink_LookUpQuestionnaireStatus',
      references: {
        table: 'LookUpQuestionnaireStatus',
        field: 'ID',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('AppealLink', 'QuestionnaireStatusID');
  },
};

module.exports = migration;
