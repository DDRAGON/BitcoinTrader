

setInterval(getAPI, 500);

function getAPI() {
   $.ajax({
      url: "/data",
      data: {},
      success: function( result ) {

         let diff = result.ltp - result.referenceValues.ltp;
         let diffText = '';
         if (diff >= 0) {
            let percentage = (diff * 100 / result.referenceValues.ltp).toFixed(4);
            diffText = '<span style="color: #00FF00";>+' + diff + ' 円 ' + percentage + '％</span>';
         } else {
            diff = diff * (-1);
            let percentage = (diff * 100 / result.referenceValues.ltp).toFixed(4);
            diffText = '<span style="color: #FF0000";>-' + diff + ' 円 ' + percentage + '％</span>';
         }

         $("#realTime-ltp").html("現在の最終取引額は " + result.ltp + " 円です。" + diffText);

         // 平均値からの差額の計算
         let differenceFromAverage = Math.floor((result.ltp - result.averagebitCoinBalance) * result.bitCoinBalance);
         let differenceFromAverageText = '';
         if (differenceFromAverage >= 0) {
            differenceFromAverageText += '<span style="color: #00FF00";>+' + differenceFromAverage + '円';
         } else {
            differenceFromAverageText += '<span style="color: #FF0000";>-' + (differenceFromAverage * (-1)) + '円';
         }
         differenceFromAverageText += '</span>';

         $("#realTime-balance").html(
            "あなたの Bitcoin の残高は " + result.bitCoinBalance + " Bitcoin です。<br>" +
            "平均 Bitcoin 取得額は " + result.averagebitCoinBalance + "円 です。 " + differenceFromAverageText +"<br>"
         );
         $("#reference-values").html(
            "基準値： " + result.referenceValues.ltp + " 円 です。<br>" +
            "基準値の時刻は " + result.referenceValues.timestamp + " です。"
         );

         // 注文一覧の作成
         let ordersText = '';
         for (let order of result.orders) {
            if (order.side === 'BUY') {
               ordersText += '<div style="background-color: #FFcccc";>';
               ordersText += '<span style="font-size: 120%";>'+order.price+'</span> ';
               ordersText += '<span style="color: #DD0000";>買い</span>　';
            } else if (order.side === 'SELL') {
               ordersText += '<div style="background-color: #ccFFcc";>';
               ordersText += '<span style="font-size: 120%";>'+order.price+'</span> ';
               ordersText += '<span style="color: #00DD00";>売り</span>　';
            }
            let commissionText = Math.round(result.ltp * order.total_commission);
            ordersText += '数量:' + order.size + '　手数料:' + commissionText +'円　'+ order.child_order_date;
            ordersText += '</div><hr>'


         }
         $("#orders").html(ordersText);

         // 約定一覧の作成
         let executionsText = '';
         for (let execution of result.executions) {
            executionsText += '<div>';
            if (execution.side === 'BUY') {
               executionsText += '<span style="font-size: 110%";>'+execution.price+'</span> ';
               executionsText += '<span>買った</span>　';
            } else if (execution.side === 'SELL') {
               executionsText += '<span style="font-size: 110%";>'+execution.price+'</span> ';
               executionsText += '<span style="color: #00DD00";>売った</span>　';
            }
            let commissionText = Math.round(result.ltp * execution.commission);
            executionsText += '数量:' + execution.size + '　手数料:' + commissionText +'円　'+ execution.exec_date;
            executionsText += '</div><hr>'


         }
         $("#executions").html(executionsText);


         // ログ
         let logsText = '';
         for (let log of result.logs) {
            logsText += '<p style="font-size: 80%;">' + log + '</p>';
         }
         // $("#logs").html(logsText);
      }
   });
}