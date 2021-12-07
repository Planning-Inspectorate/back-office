import {
    inputAddressLine1,
    inputAddressLine2,
    inputCounty, inputPostcode,
    inputTownCity
} from "../PageObjects/cst-edit-site-address-po";

export const validateSiteAddress = (addr1,addr2,town,county,postcode) => {
    inputAddressLine1().type( `{selectall}{backspace}${addr1}` );
    inputAddressLine2().type(`{selectall}{backspace}${addr2}`);
    inputTownCity().type(`{selectall}{backspace}${town}`);
    inputCounty().type(`{selectall}{backspace}${county}`);
    inputPostcode().type(`{selectall}{backspace}${postcode}`);
}

