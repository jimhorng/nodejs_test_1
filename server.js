var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var csvParser = require('csv-parse');
var moment = require('moment');

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

app.get('/cb/:cb_no/:date', function(request, response){

        var cb_no = request.params.cb_no;
        var date = request.params.date;

        // var today = moment();
        // var latest_trade_day = today;
        // if ( today.isoWeekday() > 5 ) {
        //     latest_trade_day = today.subtract(today.isoWeekday() - 5, 'days');
        // }

        var options = {
            host: 'mis.tse.com.tw',
            port: 80,
            path: '/stock/api/getStockInfo.jsp?ex_ch=otc_' + cb_no + '.tw_' + date + '&json=1&delay=0',
            method: 'GET'
        };

        http.request(options, function(res) {
            res.on('data', function (data) {
                var dataObj = JSON.parse(data);
                var cb_info = (cb_no);
                console.log("DEBUG: getting cbgetCBInfo: " + cb_no);
                if (cb_info != null 
                    && dataObj.hasOwnProperty('msgArray') 
                    && dataObj.msgArray.length != 0) {
                    cb_info['price'] = Number(dataObj.msgArray[0].z);
                    cb_info['total_volume'] = Number(dataObj.msgArray[0].v);
                    cb_info['convert_share'] = Math.round(100000 / parseInt(cb_info.convert_price));
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

var port = Number(process.env.PORT || 8080);
server.listen(port, function(){
        console.log('starting web server on port:' + port + '...');
});