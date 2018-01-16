var async = require('async');
var moment = require('moment-timezone');
const trade = require('./myModules/trade');



trade.getExecutions(function(err, response, payload) {
   console.log(payload);
});