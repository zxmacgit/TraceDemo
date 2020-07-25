$(function () {
    const backendApi = "https://localhost:44313";

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
            url: `${backendApi}/api/trace/weather?lat=${lat}&lon=${lon}`,
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (data) {
            console.log('fail: ', data);
            $('#loader').hide();
        });
    }

    function getGeoByIp(ip, callback) {
        $.ajax({
            method: "GET",
            url: `${backendApi}/api/trace/locate?ip=${ip}`,
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (data) {
            console.log('fail: ', data);
        });
    }
    
    function loadInit() {
        getGeoIpLookUp((geoIpLookUp) => {
            console.log('geoIpLookUp: ', geoIpLookUp);
            if (!geoIpLookUp) return;
            let lat = geoIpLookUp.latitude;
            let lon = geoIpLookUp.longitude;

            getWeather(lat, lon, (weather) => {
                console.log('weather: ', weather);
                buildContent(geoIpLookUp, weather);
            });
        });
    }

    function loadByIp(ip) {
        $('#loader').show();

        getGeoByIp(ip, (geo) => {
            console.log('getGeoByIp: ', geo);
            if (!geo) return;
            let lat = geo.lat;
            let lon = geo.lon;

            getWeather(lat, lon, (weather) => {
                console.log('weather: ', weather);
                buildContent(geo, weather);
                $('#loader').hide();
            });
        });
    }

    function getWeatherIcon(key) {
        let w = {
            Rain: 'fas fa-cloud-rain',
            Clear: 'far fa-sun',
            Clouds: 'fas fa-cloud-meatball',
            Sun: 'far fa-sun',
            CloudSun: 'fas fa-cloud-sun'
        };
        return w[key] ?? w['CloudSun'];
    }

    function buildContent(geo, weather) {
        $('#currentWeather1').children().remove();
        $('#currentWeather2').children().remove();
        $('#dailyWeather').children().remove();

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let current = weather.current;
        let daily = weather.daily;
        let date = new Date();
        let time = `${days[date.getDay()]} ${(date.getHours() > 12 ? date.getHours() - 12 : date.getHours())}:${date.getMinutes()}`;
        let createElem = (el, data, attr = '') => `<${el}${attr}>${data}</${el}>`;
        let combineElems = (elems) => elems.join('');
        let conv = (valNum) => (parseFloat(valNum) - 273.15).toFixed();

        let currentWeather1 = combineElems([
            createElem('h3', `${geo.city}, ${geo.regionName}`),
            createElem('p', time),
            `<i class="${getWeatherIcon(current.weather[0].main)}"></i>`
        ]);

        let currentWeather2 = combineElems([
            createElem('p', 'Precipitation: ' + current.uvi + ' %'),
            createElem('p', 'Humidity: ' + current.humidity + ' %'),
            createElem('p', 'Wind: ' + current.wind_deg + ' km/hr')
        ]);

        let dailyWeather = '';
        let day = new Date().getDay();
        $.each(daily, (index, val) => {
            let w = val.weather[0];
            dailyWeather += combineElems([
                '<div class="col-6 col-xs-6 col-md-1">',
                createElem('p', days[day]),
                `<i class="${getWeatherIcon(w.main)}"></i>`,
                createElem('p', `${conv(val.temp.max)}° ${conv(val.temp.min)}°`),
                '</div>'
            ]);
            day = day !== 0 ? day - 1 : 6;
        });

        $('#publicIp').text(`IP: ${geo.query}`);
        $('#currentWeather1').append(currentWeather1);
        $('#currentWeather2').append(currentWeather2);
        $('#dailyWeather').append(dailyWeather);
    }

    $('#locateIpBtn').click(() => {
        loadByIp($('#ip').val());
    });

    $('#loader').hide();

    // loadInit();
    /* I prefer to use this because it is more accurate */
    loadByIp('');
});