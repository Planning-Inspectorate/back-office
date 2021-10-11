const {
  getText,
  getCheckAndConfirmConfig,
  reviewOutcomeOption,
} = require('./review-appeal-submission');
const views = require('./views');

describe('review-appeal-submission', () => {
  describe('getText', () => {
    it('should return the right text for an invalid appeal reason key', () => {
      expect(getText('noRightOfAppeal')).toEqual('No right of appeal');
    });
    it('should return the right text for an missing or wrong reason key', () => {
      expect(getText('inflammatoryComments')).toEqual('Inflammatory comments made');
    });
    it('should return the the key if a matching text not found', () => {
      expect(getText('aNonExistentKey')).toEqual('aNonExistentKey');
    });
  });

  describe('getCheckAndConfirmConfig', () => {
    it('should return the right object with an existent review outcome', () => {
      const checkAndConfirmConfig = getCheckAndConfirmConfig(reviewOutcomeOption.valid);
      expect(checkAndConfirmConfig.text).toEqual('Valid');
      expect(checkAndConfirmConfig.reasonText).toEqual('Description of development');
      expect(checkAndConfirmConfig.view).toEqual(views.validAppealDetails);
      expect(checkAndConfirmConfig.continueButtonText).toEqual('Confirm and start appeal');
    });
    it('should return undefined with a non existent review outcome', () => {
      const checkAndConfirmConfig = getCheckAndConfirmConfig('nonExistentOutcome');
      expect(checkAndConfirmConfig).toBeUndefined();
    });
  });
});
