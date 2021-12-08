const {
  labels,
  getReviewOutcomeConfig,
  reviewOutcomeOption,
} = require('./review-appeal-submission');
const views = require('./views');

describe('review-appeal-submission', () => {
  describe('labels', () => {
    it('should return the right text for an invalid appeal reason key', () => {
      expect(labels.invalidAppealReasons[2]).toEqual('No right of appeal');
    });
    it('should return the right text for an missing or wrong reason key', () => {
      expect(labels.missingOrWrongReasons[4]).toEqual('Inflammatory comments made');
    });
    it('should return the right text for an missing or wrong document key', () => {
      expect(labels.missingOrWrongDocuments[3]).toEqual('Grounds of appeal');
    });
  });

  describe('getReviewOutcomeConfig', () => {
    it('should return the right object with an existent review outcome', () => {
      const checkAndConfirmConfig = getReviewOutcomeConfig(reviewOutcomeOption.valid);
      expect(checkAndConfirmConfig.text).toEqual('Valid');
      expect(checkAndConfirmConfig.reasonText).toEqual('Description of development');
      expect(checkAndConfirmConfig.view).toEqual(views.validAppealDetails);
      expect(checkAndConfirmConfig.continueButtonText).toEqual('Confirm and start appeal');
    });
    it('should return undefined with a non existent review outcome', () => {
      const checkAndConfirmConfig = getReviewOutcomeConfig('nonExistentOutcome');
      expect(checkAndConfirmConfig).toBeUndefined();
    });
  });
});
