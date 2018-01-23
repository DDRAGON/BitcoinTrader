const PubNub = require('pubnub');
const pubnub = new PubNub({
   subscribeKey: 'sub-c-52a9ab50-291b-11e5-baaa-0619f8945a4f'
});


let ltp;
let timestamp;

const listener =
   {
      message: function (message) {
         timestamp = message.message.timestamp;
         ltp = message.message.ltp;
      }
   };

pubnub.addListener(listener);
pubnub.subscribe({
   channels: ['lightning_ticker_BTC_JPY']
});


function getLtp() {
   return {
      ltp: ltp,
      timestamp: timestamp
   };
}

function resetListener () {
   pubnub.removeListener(listener);
   pubnub.addListener(listener);
}

setInterval(resetListener, 1000 * 60 * 60 * 2);


module.exports = {
   ltp: ltp,
   getLtp: getLtp
};