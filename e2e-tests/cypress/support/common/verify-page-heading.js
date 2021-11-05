import{pageHeading as pageHeadingObject} from "../PageObjects/common-po";
export const verifyPageHeading = (pageHeading) => {
    cy.checkPageA11y();
    pageHeadingObject()
        .invoke('text')
        .then((text) => {
            expect(text).to.contain(pageHeading);
        });
}