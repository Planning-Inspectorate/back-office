const moment = require( "moment" );
export const dateFormat = (date,format) => {
    return moment(date).format(format);
};
