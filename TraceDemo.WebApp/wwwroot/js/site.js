$(function () {
    //$.ajax({
    //    method: "GET",
    //    url: "http://api.ipstack.com/49.145.205.173?access_key=66a0f82b63ae8175ce47f03ab2052256",
    //})
    //    .done(function (data) {
    //        callback(data);
    //    })
    //    .fail(function (data) {
    //        console.log('fail: ', data);
    //    });

    function getGeoIpLookUp(callback) {
        $.ajax({
            method: "GET",
            url: "https://json.geoiplookup.io/api"
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (data) {
            console.log('fail: ', data);
        });
    }

    function getWeather(lat, lon, callback) {
        $.ajax({
            method: "GET",
            url: "https://localhost:44313/api/trace/weather?" + "lat=" + lat + "&lon=" + lon,
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (data) {
            console.log('fail: ', data);
        });
    }
    
    function loadAll() {
        getGeoIpLookUp((geoIpLookUp) => {
            console.log('geoIpLookUp: ', geoIpLookUp);
            if (!geoIpLookUp) return;
            let lat = geoIpLookUp.latitude;
            let lon = geoIpLookUp.longitude
            getWeather(lat, lon, (weather) => {
                console.log('weather: ', weather);
                buildContent(weather);
            });
        });
    }

    function buildContent(weather) {
        let current = weather.current;
        let daily = weather.daily;
        let currentWeather = '';
        currentWeather += '<p class="cloudy"> ' + current.clouds + '</p >';
        currentWeather += '<image src>';

        let dailyWeather = '';
        $.each(daily, (key, val) => {
            console.log('key: ', key);
            console.log('val: ', val.weather[0].main);
            dailyWeather += '<p class="cloudy"> ' + current.clouds + '</p >';
        });


        $('#test').append(currentWeather);
        $('#test').append(dailyWeather);
    }

    function getWClass() {
        return "";
    }

    loadAll();
});