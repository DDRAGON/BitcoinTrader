var async = require('async');


const testArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
async.eachSeries(testArray, function(item, next){
   setTimeout(function() {
      console.log(item);
      next();
   }, 5000);

}, function(err){
   //処理2
   if (err) { myLog(err); }
   console.log('!async finish!');
});
