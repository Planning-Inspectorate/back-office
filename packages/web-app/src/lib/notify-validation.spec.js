const { isValidAppealForSendStartEmailToLPAEmail } = require('./notify-validation');

describe('lib/notify-validation', () => {
  describe('isValidAppealForSendStartEmailToLPAEmail', () => {
    describe('unhappy paths', () => {
      [
        { appeal: undefined },
        { appeal: null },
        { appeal: {} },
        { appeal: { id: 'some-uuid' } },
        { appeal: { id: 'some-uuid', lpaCode: '123' } },
        { appeal: { id: 'some-uuid', lpaCode: '123', horizonId: 'xyz-abc' } },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: undefined,
          },
        },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: {},
          },
        },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: {
              applicationNumber: undefined,
            },
          },
        },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: { applicationNumber: '123/abc' },
            appealSiteSection: undefined,
          },
        },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: { applicationNumber: '123/abc' },
            appealSiteSection: {},
          },
        },
        {
          appeal: {
            id: 'some-uuid',
            lpaCode: '123',
            horizonId: 'xyz-abc',
            requiredDocumentsSection: { applicationNumber: '123/abc' },
            appealSiteSection: { siteAddress: undefined },
          },
        },
      ].forEach(({ appeal }) => {
        it('should return false appeal is invalid', async () => {
          expect(isValidAppealForSendStartEmailToLPAEmail(appeal)).toBeFalsy();
        });
      });
    });

    describe('happy paths', () => {
      [
        // empty strings are valid, see JIRA AS-1854
        {
          appeal: {
            appealId: 'some-uuid',
            localPlanningAuthorityId: '',
            caseReference: '',
            originalApplicationNumber: '',
            siteAddressLineOne: '',
            creatorEmailAddress: '',
          },
        },
        {
          appeal: {
            appealId: 'some-uuid',
            localPlanningAuthorityId: '123',
            caseReference: 'xyz-abc',
            originalApplicationNumber: '123/abc',
            siteAddressLineOne: '123 fake street',
            creatorEmailAddress: 'test@gmail.com',
          },
        },
      ].forEach(({ appeal }) => {
        it('should return true appeal is valid', async () => {
          expect(isValidAppealForSendStartEmailToLPAEmail(appeal)).toBeTruthy();
        });
      });
    });
  });
});
