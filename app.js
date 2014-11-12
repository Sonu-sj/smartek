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
var mongoose = require("mongoose");
var track = require('./models/model.js');
var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    //'mongodb://localhost/Trackdb';
   'mongodb://sonu:sonu123@ds051970.mongolab.com:51970/tracks'
// view engine setup


mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});
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
app.get('/directive', function(req, res) {
    res.sendfile('views/new.html');

});
app.get('/tracks', function(req, res) {
    res.sendfile('views/tracks.html');

});
app.get('/modal', function(req, res) {
    res.sendfile('views/modal.html');

});

app.get('/retrieve', function(req, res) {
    var data = [{
        name: "Reload",
        artist: 'Sebastin Ingrosso',
        url: 'http://digi10ve.com/wp-content/uploads/2013/04/reload.jpg'
    }, {
        name: "Love Me Again",
        artist: 'John Newman',
        url: 'http://ecx.images-amazon.com/images/I/51rvHl8rlsL._SL500_AA280_.jpg'
    }, ];

    res.json(data);
});
app.get('/getdata',function(req,res){
    track.find({}).limit(8).sort({'_id':-1}).exec(function(err,data)
{
    res.json(data);
}
        )
})
app.post('/send', function(req, res) {
    console.log(req.body.trackname);
    request('http://itunes.apple.com/search?term=' + req.body.trackname + '&country=us&limit=1&entity=song', function(error, response, body) {
    //request('http://localhost:3000/testdata', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Print the google web page.
            //console.log(JSON.parse(body).results[0].artistName);
            var result = JSON.parse(body).results[0];
           if(result)
           {
            var resp = result.artistName;
            
            var ntrack = new track();
            ntrack.name = result.trackName; 
            ntrack.artist = result.artistName;
            ntrack.year = result.releaseDate;
            ntrack.trackurl = result.previewUrl;
            ntrack.imgurl = result.artworkUrl100;
            ntrack.save(function(err) {
                if (err) console.log(err)
                    else
                        res.send(resp);
            });

            }
        } else
            console.log(error);
    })
})
app.get('/testdata', function(req, res) {

        var td = {
            "resultCount": 1,
            "results": [{
                "wrapperType": "track",
                "kind": "song",
                "artistId": 156807,
                "collectionId": 74767723,
                "trackId": 74767600,
                "artistName": "Disturbed",
                "collectionName": "The Sickness",
                "trackName": "Down With the Sickness",
                "collectionCensoredName": "The Sickness",
                "trackCensoredName": "Down With the Sickness",
                "artistViewUrl": "https://itunes.apple.com/us/artist/disturbed/id156807?uo=4",
                "collectionViewUrl": "https://itunes.apple.com/us/album/down-with-the-sickness/id74767723?i=74767600&uo=4",
                "trackViewUrl": "https://itunes.apple.com/us/album/down-with-the-sickness/id74767723?i=74767600&uo=4",
                "previewUrl": "http://a1694.phobos.apple.com/us/r1000/119/Music/b7/5f/79/mzm.ppslswjo.aac.p.m4a",
                "artworkUrl30": "http://a3.mzstatic.com/us/r30/Music/y2005/m07/d12/h09/s06.neivmedj.30x30-50.jpg",
                "artworkUrl60": "http://a2.mzstatic.com/us/r30/Music/y2005/m07/d12/h09/s06.neivmedj.60x60-50.jpg",
                "artworkUrl100": "http://a4.mzstatic.com/us/r30/Music/y2005/m07/d12/h09/s06.neivmedj.100x100-75.jpg",
                "collectionPrice": 7.99,
                "trackPrice": 1.29,
                "releaseDate": "2000-02-25T08:00:00Z",
                "collectionExplicitness": "explicit",
                "trackExplicitness": "explicit",
                "discCount": 1,
                "discNumber": 1,
                "trackCount": 12,
                "trackNumber": 4,
                "trackTimeMillis": 278667,
                "country": "USA",
                "currency": "USD",
                "primaryGenreName": "Rock",
                "contentAdvisoryRating": "Explicit",
                "radioStationUrl": "https://itunes.apple.com/station/idra.74767600"
            }]
        }

        res.json(td);

    })
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
