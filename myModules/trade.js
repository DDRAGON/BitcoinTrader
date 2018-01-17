var request = require('request');
var crypto = require('crypto');
var moment = require('moment-timezone');

const config = require('../config.js');

const API_Key    = config.API_keys.API_Key;
const API_Secret = config.API_keys.API_Secret;


function getBalance(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getbalance';
   var body = JSON.stringify({});

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
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function getTradingCommission(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/gettradingcommission?product_code=BTC_JPY';
   var text = timestamp + method + path;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function getMarket(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/markets';
   var body = JSON.stringify();

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
      payload = JSON.parse(payload);
      console.log(payload);
      callback(err, response, payload);
   });
}

function cancelAll(callback) {
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
      console.log(response.statusCode);
      callback(err, response, payload);
   });
}

function cancelOrder(child_order_acceptance_id, callback) {
   var timestamp = Date.now().toString();
   var method = 'POST';
   var path = '/v1/me/cancelchildorder';
   var body = JSON.stringify(
      {
         "product_code": "BTC_JPY",
         "child_order_acceptance_id": child_order_acceptance_id
      }
   );

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
      console.log(response.statusCode);
      callback(err, response, payload);
   });
}



function buyOrder(price, BTCSize, callback) {
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
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function sellOrder(price, BTCSize, callback) {
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
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function getOrders(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getchildorders?product_code=BTC_JPY&child_order_state=ACTIVE';
   var body = JSON.stringify({

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
      payload = JSON.parse(payload);
      for (var order of payload) {
         order.child_order_date = moment(order.child_order_date+'Z').tz("Asia/Tokyo").format("YYYY年M月D日 HH:mm ss杪");
      }
      callback(err, response, payload);
   });
}

function getExecutions(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getexecutions?product_code=BTC_JPY';
   var body = JSON.stringify({});

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
      payload = JSON.parse(payload);
      for (var execution of payload) {
         execution.exec_date = moment(execution.exec_date+'Z').tz("Asia/Tokyo").format("YYYY年M月D日 HH:mm ss杪");
      }
      callback(err, response, payload);
   });
}

function getAverageBitCoinBalance(callback) {
   getBalance(function(err, response, payload) {
      const moneyBalance = payload[0].amount;
      const bitCoinBalance = payload[1].amount;

      getExecutions(function(err, response, payload) {

         if (err) { myLog(err); }
         var totalSize  = 0;
         var totalPrice = 0;
         for (var execution of payload) {
            if (execution.side === 'SELL') { continue; }

            if (totalSize >= bitCoinBalance.toFixed(3)) {
               break;
            }

            totalPrice += execution.price * (execution.size * 1000);
            totalSize  += execution.size;
         }
         const averageBitCoinBalance = Math.floor(totalPrice / (totalSize * 1000));
         callback(averageBitCoinBalance, moneyBalance, bitCoinBalance);
      });
   });
}

module.exports = {
   getBalance: getBalance,
   getTradingCommission: getTradingCommission,
   cancelAll: cancelAll,
   cancelOrder: cancelOrder,
   buyOrder: buyOrder,
   sellOrder: sellOrder,
   getOrders: getOrders,
   getExecutions: getExecutions,
   getAverageBitCoinBalance: getAverageBitCoinBalance
}
