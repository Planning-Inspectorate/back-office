import { pageHeading as pageHeadingObject } from "../PageObjects/common-po";

export const verifyPageHeading = (pageHeading) => {
    pageHeadingObject()
        .invoke( 'text' )
        .then( (text) => {
            expect( text ).to.contain( pageHeading );
        } );
}
