const getCheckAndConfirmController = require('./check-and-confirm');
const views = require('../../config/views');

describe('controllers/check-and-confirm', () => {
  describe('getCheckAndConfirm', () => {
    it('should render view with complete status', async () => {
      const appealId = '123';

      const sections = [
        { title: 'Review outcome', value: 'Complete' },
        { title: 'Appeal reference', value: 'APP' },
        { title: 'Appeal site', value: 'Site' },
        { title: 'Local planning department', value: 'Newark and Sherwood District Council' },
      ];

      const breadcrumbs = [
        { title: 'Case officer dashboard' },
        { title: 'Questionnaires for review' },
        { title: 'Dummy Appeal Reference' },
        { title: 'Check and confirm' },
      ];

      const req = {
        param: {
          appealId,
        },
      };
      const res = {
        render: jest.fn(),
      };

      await getCheckAndConfirmController.getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, {
        backLink: `/questionnaires-for-review/${appealId}`,
        breadcrumbs,
        sections,
        pageTitle: 'Check and confirm',
        reviewOutcome: 'COMPLETE',
      });
    });
  });
});
