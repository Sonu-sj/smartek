var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var request = require('request');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.get('/directive', function (req, res) {
    res.sendfile('views/new.html');

});
app.get('/modal', function (req, res) {
    res.sendfile('views/modal.html');

});

app.get('/retrieve', function (req, res) {
    var data = [{name: "Reload", artist: 'Sebastin Ingrosso', url: 'http://digi10ve.com/wp-content/uploads/2013/04/reload.jpg'},
        {name: "Love Me Again", artist: 'John Newman', url: 'http://ecx.images-amazon.com/images/I/51rvHl8rlsL._SL500_AA280_.jpg'},
    ];

    res.json(data);
});
app.post('/send',function(req,res){

    request('http://itunes.apple.com/search?term=' + req.body.trackname + '&country=us&limit=1&entity=song', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(typeof (body)) // Print the google web page.
        console.log(JSON.parse(body).results[0].artistName);
        var resp = JSON.parse(body).results[0].artistName;
        res.send(resp);
    }
})
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
