

setInterval(getAPI, 500);

function getAPI() {
   $.ajax({
      url: "/data",
      data: {},
      success: function( result ) {

         let diff = result.ltp - result.referenceValues.ltp;
         let diffText = '';
         if (diff >= 0) {
            let percentage = (diff / result.referenceValues.ltp).toFixed(4);
            diffText = '<span style="color: #00FF00";>+' + diff + ' 円 ' + percentage + '％</span>';
         } else {
            diff = diff * (-1);
            let percentage = (diff / result.referenceValues.ltp).toFixed(4);
            diffText = '<span style="color: #FF0000";>-' + diff + ' 円 ' + percentage + '％</span>';
         }

         $("#realTime-ltp").html("現在の最終取引額は " + result.ltp + " 円です。" + diffText);
         $("#realTime-balance").html(
            "あなたの 日本円 の残高は " + result.moneyBalance + "円 です。<br>" +
            "あなたの Bitcoin の残高は " + result.bitCoinBalance + " Bitcoin です。<br>" +
            "平均 Bitcoin 取得額は " + result.averagebitCoinBalance + "円 です。<br>"
         );
         $("#reference-values").html(
            "基準値： " + result.referenceValues.ltp + " 円 です。<br>" +
            "基準値の時刻は " + result.referenceValues.timestamp + " です。"
         );
      }
   });
}