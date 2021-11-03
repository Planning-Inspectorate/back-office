jest.mock('./notify-validation');
jest.mock('../services/lpa.service');

const config = require('../config/config');

const { APPEAL_DOCUMENT } = require('../../test/lib/empty-appeal');
const { isValidAppealForSendStartEmailToLPAEmail } = require('./notify-validation');

const mockError = jest.fn();

jest.doMock('./logger', () => ({
  error: mockError,
}));

const mockReset = jest.fn().mockReturnThis();
const mockSetTemplateId = jest.fn().mockReturnThis();
const mockSetDestinationEmailAddress = jest.fn().mockReturnThis();
const mockSetEmailReplyToId = jest.fn().mockReturnThis();
const mockSetTemplateVariablesFromObject = jest.fn().mockReturnThis();
const mockSetReference = jest.fn().mockReturnThis();
const mockSend = jest.fn();

jest.doMock('@pins/common/src/lib/notify/notify-builder', () => ({
  reset: mockReset,
  setTemplateId: mockSetTemplateId,
  setDestinationEmailAddress: mockSetDestinationEmailAddress,
  setEmailReplyToId: mockSetEmailReplyToId,
  setTemplateVariablesFromObject: mockSetTemplateVariablesFromObject,
  setReference: mockSetReference,
  sendEmail: mockSend,
}));

const { getLpa } = require('../services/lpa.service');

const { sendStartEmailToLPA } = require('./notify');

describe('lib/notify', () => {
  describe('sendStartEmailToLPA', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

      isValidAppealForSendStartEmailToLPAEmail.mockReturnValue(true);
    });

    it('should throw an error if appeal is invalid', async () => {
      isValidAppealForSendStartEmailToLPAEmail.mockReturnValue(false);
      try {
        await sendStartEmailToLPA({});
      } catch (e) {
        expect(e).toEqual(new Error('Appeal was not available.'));
      }
    });

    describe('with valid appeal object', () => {
      let appeal;

      beforeEach(() => {
        appeal = {
          ...APPEAL_DOCUMENT.empty,
          id: 'some-fake-id',
          lpaCode: 'some-lpa-code',
          horizonId: 'some-fake-horizon-id',
          submissionDate: new Date('19 April 2021'),
          aboutYouSection: {
            yourDetails: {
              name: 'appellant name',
              email: 'timmy@tester.com',
            },
          },
          requiredDocumentsSection: {
            ...APPEAL_DOCUMENT.empty.requiredDocumentsSection,
            applicationNumber: '123/abc/xyz',
          },
          appealSiteSection: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection,
            siteAddress: {
              addressLine1: '999 some street',
              town: 'a town',
              postcode: 'rt12 9ya',
            },
          },
        };
      });

      afterEach(() => {
        mockError.mockClear();
        mockSend.mockClear();
      });

      it('should log an error if unable to find the given LPA by ID', async () => {
        const error = new Error('boom');
        getLpa.mockRejectedValue(error);

        try {
          await sendStartEmailToLPA(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            { err: e, lpaCode: 'some-lpa-code' },
            'Unable to find LPA from given lpaCode'
          );
        }
      });

      it('should throw if the looked up LPA has no email address', async () => {
        const mockLpa = { name: 'whoops, email is missing' };
        getLpa.mockResolvedValue(mockLpa);

        try {
          await sendStartEmailToLPA(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            {
              err: new Error('Missing LPA email. This indicates an issue with the look up data.'),
              lpa: mockLpa,
            },
            'Unable to send appeal submission received notification email to LPA.'
          );
        }
      });

      it('should send an email', async () => {
        getLpa.mockResolvedValue({ name: 'a happy value', email: 'some@example.com' });

        await sendStartEmailToLPA(appeal);

        expect(mockError).not.toHaveBeenCalled();

        expect(mockReset).toHaveBeenCalled();
        expect(mockSetEmailReplyToId).toHaveBeenCalledWith(
          config.services.notify.emailReplyToId.startEmailToLpa
        );
        expect(mockSetTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.startEmailToLpa
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('some@example.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          'site address one line': '999 some street, a town, rt12 9ya',
          'horizon id': appeal.horizonId,
          lpa: 'a happy value',
          'planning application number': appeal.requiredDocumentsSection.applicationNumber,
          'site address': '999 some street\na town\nrt12 9ya',
          'questionnaire due date': '24 April 2021',
          url: 'http://fake-lpa-questionnaire-base-url/some-fake-id',
          'appellant email address': appeal.aboutYouSection.yourDetails.email,
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });
});
