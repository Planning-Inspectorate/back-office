const {Given, When, Then} = require( 'cucumber' );
const {reviewAppealSubmissionPage} = require( '../../../support/PageObjects/vo-review-appeal-submission-page-po' );


Given( 'the user is on the Review appeal submission page', () => {
    reviewAppealSubmissionPage();
} );

When( 'the user selects the outcome as {string} and click on Continue button', (outcome) => {
    switch (outcome) {
        case 'valid':
            //outcomeValid();
            break;
        case 'invalid':
           // outcomeInvalid();
            break;
        case 'something is missing or wrong':
            //somethingMissingOrWrong();
            break;
    }
} );

Then( 'the {string} is displayed', (nextpage) => {
    switch (nextpage) {
        case 'valid appeal details':
           // pageValidAppealDetails();
            break;
        case 'invalid appeal details':
          //  pageInvalidAppealDetails();
            break;
        case 'what is missing or wrong':
           // pageWhatIsMissingOrWrong();
            break;
    }
  } );

When( 'the user selects or enters {string} and click on Continue button', (outcomeReason) => {
    switch (outcomeReason) {
        case 'description of development':
         //  enterDescriptionOfDevelopment();
        break;
        case 'out of time':
         //   selectOutOfTime();
        break;
        case 'names do not match':
         //  selectNamesDoNotMatch();
        break;
    }
} );

Then( 'the Check and confirm page is displayed', () => {
   // checkConfirmPage();
} );

When( 'the user clicks on the {string}', (confirmButton) => {
    switch (confirmButton) {
        case 'confirm and start appeal':
           // confirmStartAppeal();
        break;
        case 'confirm and turn away appeal':
           // confirmTurnAwayAppeal();
        break;
        case 'confirm and finish review':
           // confirmFinishReview();
        break;
    }
} );

Then( 'the review is complete and the appeal status is {string}', (reviewStatus) => {
    switch (reviewStatus) {
        case'valid':
          //  outcomeValid();
        break;
        case'invalid':
           // outcomeInvalid();
        break;
        case'something is missing or wrong':
          //  somethingMissingOrWrong();
        break;
    }
} );

