var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var csvParser = require('csv-parse');

var cb_list;
var parser = csvParser({delimiter: ',', columns: true, trim: true}, function(err, data){
  cb_list = data;
  console.log("DEBUG: parse: " + JSON.stringify(cb_list[0]));
});

fs.createReadStream(__dirname+'/cb_list.csv').pipe(parser);

var getCBInfo = function(cb_no) {
  for ( var i = 0 ; i < cb_list.length ; i++ ) {
    if( cb_no == cb_list[i].cb_no ) {
      return cb_list[i];
    }
  }
  return null;
};

var app = express();
var server = http.createServer(app);

app.get('/cb/:cb_no', function(request, response){

    var cb_no = request.params.cb_no;

    var options = {
      host: 'mis.tse.com.tw',
      port: 80,
      path: '/stock/api/getStockInfo.jsp?ex_ch=otc_' + cb_no + '.tw_20140806&json=1&delay=0',
      method: 'GET'
    };

    http.request(options, function(res) {
      res.on('data', function (data) {
        var dataObj = JSON.parse(data);
        var cb_info = getCBInfo(cb_no);
        if (cb_info != null ) {
          cb_info['price'] = dataObj.msgArray[0].z;
          cb_info['total_volume'] = dataObj.msgArray[0].v;
          response.set('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify(cb_info));
        }
        else {
          cb_info = {};
          response.send(404);
        }
      });
    }).end();
});
app.use(express.static(__dirname));
server.listen(8080,'127.0.0.1',function(){
    console.log('starting..');
});