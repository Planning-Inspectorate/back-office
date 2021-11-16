const migration = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('HASLPASubmission', 'QuestionnaireStatusID');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('HASLPASubmission', 'QuestionnaireStatusID', Sequelize.INTEGER);
    await queryInterface.addConstraint('HASLPASubmission', {
      fields: ['QuestionnaireStatusID'],
      type: 'foreign key',
      name: 'FK_HASLPASubmission_LookUpQuestionnaireStatus',
      references: {
        table: 'LookUpQuestionnaireStatus',
        field: 'ID',
      },
    });
  },
};

module.exports = migration;
