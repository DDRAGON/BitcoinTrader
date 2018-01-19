var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var async = require('async');
var moment = require('moment-timezone');

var trade = require('./myModules/trade');
var realTime = require('./myModules/realTime');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/data',function(req,res){
   data.ltp = realTime.getLtp().ltp;
   res.json(data);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


const data = {
   referenceValues: {},
   orders: [],
   executions: [],
   logs: []
};

function setReferenceValues() {
   const ltp = realTime.getLtp();
   myLog('基準： ' + ltp.ltp);
   data.referenceValues.ltp = ltp.ltp;
   data.referenceValues.timestamp = moment(ltp.timestamp).tz("Asia/Tokyo").format("YYYY年M月D日 HH:mm ss杪");
}

const buyPercentages = [
                           0.95, 0.94, 0.93, 0.92, 0.91, 0.9,
   0.89, 0.88, 0.87, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8,
   0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73, 0.72, 0.71, 0.7,
   0.69, 0.68, 0.67, 0.66, 0.65, 0.64, 0.63, 0.62, 0.61, 0.6
];
function init() {

   myLog('日本円残高とビットコイン残高を取得しています。');
   trade.getBalance(function(err, response, payload) {
      data.moneyBalance = payload[0].amount;
      data.bitCoinBalance = payload[1].amount;
      myLog(`あなたの 日本円 の残高は ${payload[0].amount}円 です。`);
      myLog(`あなたの Bitcoin の残高は ${payload[1].amount} Bitcoin です。`);

      myLog('手数料を取得しています。');
      trade.getTradingCommission(function(err, response, payload) {
         if (err) { myLog(err); }
         data.tradingCommission = payload.commission_rate;
         myLog(`手数料は ${payload.commission_rate}円です。`);


         trade.cancelAll(function(){
            myLog('全ての注文をキャンセルしました。');
            setTimeout(function() {

               setReferenceValues();

               // 平均取得額
               trade.getAverageBitCoinBalance(function(averageBitCoinBalance) {
                  data.averagebitCoinBalance = averageBitCoinBalance;
                  myLog('平均取得額: ' + averageBitCoinBalance + '円');

                  // 売り注文
                  var sellPrice = Math.round(data.averagebitCoinBalance * 1.2);
                  var canSellBTCSize = data.bitCoinBalance - data.bitCoinBalance * data.tradingCommission; // 手数料で引かれる
                  var sellBTCSize = Math.floor(canSellBTCSize * 1000) / 1000; // 取引可能額に変更

                  setTimeout(function() {
                     trade.sellOrder(sellPrice, sellBTCSize, function(err, response, payload) {
                        if (err) { myLog(err); }
                        if (payload.error_message) { myLog(payload.error_message); }
                        data.mostRecentrySellId = payload.child_order_acceptance_id;
                        myLog(sellPrice + '円で ' + sellBTCSize + ' BTC 売り注文を出しました ' + payload.child_order_acceptance_id);
                     });
                  }, 3000);
               });

               // 買い注文
               var buyBTCSize = 0;
               var canBuyBTCPrice = data.moneyBalance;
               // 買いループ開始
               async.eachSeries(buyPercentages, function(item, next) {
                  var buyPrice = Math.floor(data.referenceValues.ltp * item); // 買い値段
                  buyBTCSize   = (buyBTCSize * 1000 + 0.001 * 1000) / 1000; // 買う数量
                  var buyTotalPrice = (buyPrice * (buyBTCSize * 1000)) / 1000; // 買う合計額
                  if (canBuyBTCPrice < (0.001 *  buyPrice + buyPrice * data.tradingCommission))
                  {
                     next(); // もう買えない時
                  } else {
                     if (buyTotalPrice > canBuyBTCPrice) { // 買える金額の限界を迎えた時
                        buyBTCSize = Math.floor(canBuyBTCPrice * 1000 / buyPrice) / 1000; // 買える量額調整
                        buyTotalPrice = (buyPrice * (buyBTCSize * 1000)) / 1000; // 買う合計額
                     }
                     canBuyBTCPrice -= (buyTotalPrice + buyTotalPrice * data.tradingCommission);

                     setTimeout(function() {
                        trade.buyOrder(buyPrice, buyBTCSize, function(err, response, payload) {
                           if (err) { myLog(err); }
                           if (payload.error_message) { myLog(payload.error_message); }

                           myLog(buyPrice + '円で ' + buyBTCSize + ' BTC 買い注文を出しました ' + payload.child_order_acceptance_id);
                           next();
                        });
                     }, 1000);
                  }

               }, function(err){
                  //処理2
                  if (err) { myLog(err); }
                  myLog('!買い注文完了!');
               });
            }, 5000);
         });
      });
   });
}
setTimeout(init, 3000);


function myLog(message) {
   console.log(message);
   data.logs.push(message);
   if (data.logs.length > 1000) {data.logs.length = 1000;}
}


// 毎朝４時の cron
new CronJob('21 43 05 * * *', function() { // 毎日 5時43分21杪
   myLog('朝になりました。基準値と注文を更新します。');
   init();
}, null, true, 'Asia/Tokyo');

// ３分おきに実行するもの
setInterval(function () {

   // 注文一覧の取得
   trade.getOrders(function(err, response, payload) {
      data.orders = payload;
   });

   // 約定一覧の取得
   trade.getExecutions(function(err, response, payload) {
      data.executions = payload;
   });

   // 平均取得額
   trade.getAverageBitCoinBalance(function(averageBitCoinBalance, moneyBalance, bitCoinBalance) {
      data.moneyBalance   = moneyBalance;
      data.bitCoinBalance = bitCoinBalance;

      if (data.averagebitCoinBalance != averageBitCoinBalance) { // 平均取得額が変わっている
         data.averagebitCoinBalance = averageBitCoinBalance; // 値更新

         trade.cancelOrder(data.mostRecentrySellId, function(payload) { // 買い注文のキャンセル

            // 売り注文
            var sellPrice = Math.round(data.averagebitCoinBalance * 1.2);
            var canSellBTCSize = data.bitCoinBalance - data.bitCoinBalance * data.tradingCommission; // 手数料で引かれる
            var sellBTCSize = Math.floor(canSellBTCSize * 1000) / 1000; // 取引可能額に変更
            trade.sellOrder(sellPrice, sellBTCSize, function(err, response, payload) {
               if (err) { myLog(err); }
               if (payload.error_message) { myLog(payload.error_message); }
               data.mostRecentrySellId = payload.child_order_acceptance_id;
               myLog(sellPrice + '円で ' + sellBTCSize + ' BTC 売り注文を出しました ' + payload.child_order_acceptance_id);
            });
         });
      }
   });

}, 1000 * 60 * 3);
