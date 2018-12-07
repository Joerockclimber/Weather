var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');
var apiKey = '5471ad3689f4376e5e13457053a9a305';
var request = require('request');
var Cookies = require('cookies');
var fetch = require('node-fetch');

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
    setCookie(req,res);
    renderweather(req,res,req.body.city);
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

/*******************************************************
* Load Cookies 
* input: request, responce, city string 
*******************************************************/
app.post('/loadCookies', function (req, res) {
    //set keys so users can't mess with app
    var keys = ['keyboard cat'];

    //cookie object
    var cookies = new Cookies(req, res, { keys: keys })

    // Get a cookie
    var citiesComma = cookies.get('city', { signed: true })

    console.log("parse cookies");
    var cities = String(citiesComma).split(',');
    var fetches = [];
    for(var i = 1; i < cities.length; i++){
        console.log(cities[i]);
        renderCookies(req,res,cities[i], fetches);
    }
    Promise.all(fetches).then(function() {
        res.end();
    });

})

/******************************************************
* SET COOKIE
*******************************************************/
function setCookie(req, res){    
    var keys = ['keyboard cat'];
    var cookies = new Cookies(req, res, { keys: keys })

    // Get a cookie
    var cities = cookies.get('city', { signed: true })

    // Set the cookie to a value
    cities += "," + req.body.city;
    cookies.set('city', cities , {signed: true, overwrite: true})
}

/*******************************************************
* Renders Weather 
* input: request, responce, city string 
*******************************************************/
function renderweather(req,res,city)
{ 
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
}

/**************************************************
*RENDER COOKIES
***************************************************/
function renderCookies(req,res,city, fetches){
    console.log(`Rendering ${city}`);
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    let array = new Array;
    fetches.push(
        fetch(url).then(res => res.json()).then(function(weather){
            //let weather; //= JSON.parse(body);
            if(weather.main == undefined){
                res.write('Error, please try again^');
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!^`;
                res.write( weatherText);
            }
        }).catch( err => {return console.log(err);})
    );
}





















