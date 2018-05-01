const PubNub = require('pubnub');
const request = require('request');
const crypto = require('crypto');
const CronJob = require('cron').CronJob;
const moment = require('moment-timezone');

const config = require('../config.js');

const API_Key    = config.API_keys.API_Key;
const API_Secret = config.API_keys.API_Secret;

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

function buyOrder(price, BTCSize) {
   return new Promise(function(resolve, reject){
      var timestamp = Date.now().toString();
      var method = 'POST';
      var path = '/v1/me/sendchildorder';
      var body = JSON.stringify({
         "product_code": "BTC_JPY",
         "child_order_type": "LIMIT",
         "side": "BUY",
         "price": price,
         "size": BTCSize,
         "minute_to_expire": 1440,
         "time_in_force": "GTC"
      });

      var text = timestamp + method + path + body;
      var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

      var options = {
         url: 'https://api.bitflyer.jp' + path,
         method: method,
         body: body,
         headers: {
            'ACCESS-KEY': API_Key,
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-SIGN': sign,
            'Content-Type': 'application/json'
         }
      };
      request(options, function (err, response, payload) {
         if (err){
            reject(err);
            return;
         }
         try {
            payload = JSON.parse(payload);
            if (payload.error_message) {
               reject(payload.error_message);
               return;
            }
            resolve(payload);
         } catch (err) {
            reject(payload);
         }
      });
   });
}

function sellOrder(price, BTCSize) {
   return new Promise(function(resolve, reject){
      var timestamp = Date.now().toString();
      var method = 'POST';
      var path = '/v1/me/sendchildorder';
      var body = JSON.stringify({
         "product_code": "BTC_JPY",
         "child_order_type": "LIMIT",
         "side": "SELL",
         "price": price,
         "size": BTCSize,
         "minute_to_expire": 1440,
         "time_in_force": "GTC"
      });

      var text = timestamp + method + path + body;
      var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

      var options = {
         url: 'https://api.bitflyer.jp' + path,
         method: method,
         body: body,
         headers: {
            'ACCESS-KEY': API_Key,
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-SIGN': sign,
            'Content-Type': 'application/json'
         }
      };
      request(options, function (err, response, payload) {
         if (err){
            reject(err);
            return;
         }
         try {
            payload = JSON.parse(payload);
            if (payload.error_message) {
               reject(payload.error_message);
               return;
            }
            resolve(payload);
         } catch (err) {
            reject(payload);
         }
      });
   });
}

function cancelAll() {
   return new Promise(function(resolve, reject){
      var timestamp = Date.now().toString();
      var method = 'POST';
      var path = '/v1/me/cancelallchildorders';
      var body = JSON.stringify({"product_code": "BTC_JPY"});

      var text = timestamp + method + path + body;
      var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

      var options = {
         url: 'https://api.bitflyer.jp' + path,
         method: method,
         body: body,
         headers: {
            'ACCESS-KEY': API_Key,
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-SIGN': sign,
            'Content-Type': 'application/json'
         }
      };
      request(options, function (err, response, payload) {
         if (err){
            reject(err);
            return;
         }
         try {
            if (response.statusCode !== 200) {
               reject(payload.error_message);
               return;
            }
            resolve(response.statusCode);
         } catch (err) {
            reject(err);
         }
      });
   });
}



// 毎朝４時の cron
new CronJob('00 53 23 * * *', function() { // 毎日 4時00分00杪
   console.log('朝になりました。基準値と注文を更新します。');
   cancelAll().then((statusCode) => {
      console.log(statusCode);
      setTimeout(function() {
         let buyPrice = Math.floor(ltp * 0.9);
         let sellPrice = Math.floor(ltp * 1.1);
         buyOrder(buyPrice, 0.001).then((payload) => {
            console.log(`注文に成功しました。注文ID ${payload.child_order_acceptance_id}`);
         }).catch((err) => {
            console.log(`注文に失敗しました。`);
            console.log(err);
         });
         sellOrder(sellPrice, 0.001).then((payload) => {
            console.log(`注文に成功しました。注文ID ${payload.child_order_acceptance_id}`);
         }).catch((err) => {
            console.log(`注文に失敗しました。`);
         console.log(err);
         });
      }, 1000 * 10);
   }).catch((err) => {
      console.log(err);
   });
}, null, true, 'Asia/Tokyo');