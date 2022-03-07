'use strict';

exports.getValidation = function(request, response) {
    response.send([{AppealId : 1,
        AppealReference: "APP/Q9999/D/21/1345264",	
        AppealStatus:"new",
        Received: "23 Feb 2022",
        AppealSite:"96 The Avenue, Maidstone, Kent, MD21 5XY"},
        {AppealId : 2,
        AppealReference: "APP/Q9999/D/21/5463281",	
        AppealStatus:"incomplete",
        Received: "25 Feb 2022",
        AppealSite:"55 Butcher Street, Thurnscoe, S63 0RB"}]);
}