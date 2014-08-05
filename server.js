var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.get('/tse/:cb_no', function(request, response){
    // theUrl = 'http://mis.tse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_' + cb_no + '.tw_20140805&json=1&delay=0&_=1407230279';
    // xmlHttp = new XMLHttpRequest();
    // xmlHttp.open( "GET", theUrl, false );
    // xmlHttp.send( null );
    // response.end(xmlHttp.responseText);

    cb_no = request.params.cb_no;

    var options = {
      host: 'mis.tse.com.tw',
      port: 80,
      path: '/stock/api/getStockInfo.jsp?ex_ch=otc_' + cb_no + '.tw_20140805&json=1&delay=0&_=1407230279',
      method: 'GET'
    };

    http.request(options, function(res) {
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        response.end(chunk);
      });
    }).end();
});
app.use(express.static(__dirname));
server.listen(8080,'127.0.0.1',function(){
    console.log('starting..');
});