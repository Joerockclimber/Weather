var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');
var apiKey = '5471ad3689f4376e5e13457053a9a305';
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

/*******************************************************
* GET CURRENT WEATHER FORM
*******************************************************/
app.get('/weather', function (req, res) {
    res.render('pages/weather2', {weather: null, error: null});
    //console.log(req.query.city); how it works with get
    //public is used so nethier get or post have effects on page?? 
    //Sessions?
});

/*******************************************************
* GET FIVE WEATHER DAY WEATHER FORCAST FORM
*******************************************************/
app.get('/5weather', function (req, res) {
    res.render('pages/weather3', {weather: null, city: null, error: null});
});


/*******************************************************
* CURRENT WEATHER
* Respond to weather request
*******************************************************/
app.post('/weather', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    request(url, function (err, response, body) {
        if(err){
            res.send('Error, please try again');
        } else {
            let weather = JSON.parse(body)
            if(weather.main == undefined){
                res.send('Error, please try again');
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.send( weatherText);
            }
        }
    });
})

/*******************************************************
* FIVE DAY WEATHER FORCAST 
* Respond to weather request
*******************************************************/
app.post('/5weather', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}` 
    //`api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&appid=${apiKey}`
    request(url, function (err, response, body) {
        if(err){
            res.render('pages/weather3', {weather: null, city: null, error: 'Error1, please try again'});
        } else {
            let weather = JSON.parse(body)
            if(weather.list == undefined){
                res.render('pages/weather3', {weather: null, city: null, error: 'Error2, please try again'});
            } else {
                console.log(JSON.stringify(weather.list));
                res.render('pages/weather3', {weather: weather.list, city: weather.city.name, error: null});
            }
        }
    });
})

























