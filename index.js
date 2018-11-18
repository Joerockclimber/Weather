var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');
var apiKey = '5471ad3689f4376e5e13457053a9a305';
const request = require('request');

/*how to parse post without framework
if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        console.log(body);
        res.end('ok');
    });
}
*/

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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
            res.render('pages/weather2', {weather: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body)
            if(weather.main == undefined){
                res.render('pages/weather2', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('pages/weather2', {weather: weatherText, error: null});
            }
        }
    });
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

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
                //weather.list.dt_txt // weather.list.main.temp //dt_txt //temp // city //JSON.stringify()
            }
        }
    });
})



















/*var c1 = cookie.serialize(key1, value1, {httpOnly: true, path: '/', signed: true});
var c2 = cookie.serialize(key2, value2, {httpOnly: true, path: '/', signed: true});
res.setHeader('Set-Cookie', weather1);
res.append('Set-Cookie', weather2);*/

/*    res.setHeader('Set-Cookie', cookie.serialize('name', String(query.name), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }));*/


/*cookie{weather{temp, city}}*/



/* var serializeCookie = function(key, value, hrs) {
 // This is res.cookie’s code without the array management and also ignores signed cookies.
 if ('number' == typeof value) value = val.toString();
 if ('object' == typeof value) value = JSON.stringify(val);
 return cookie.serialize(key, value, { expires: new Date(Date.now() + 1000 * 60 * hrs), httpOnly: true });
};*/

/* var setMultipleCookies = function(res) {
    set_cookies.push(getCookie(myCookie1, myValue1.toString(), default_cookie_age);
    set_cookies.push(getCookie(myCookie2, myValue2.toString(), default_cookie_age);
    res.header("Set-Cookie", set_cookies);
}*/

///addcity
///delete city



