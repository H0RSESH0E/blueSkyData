
var openWeatherAPIKey = "3fd922e8cac3e8747c787364f94aace5";
var theFormEl = document.querySelector("#search-form");
var units = "metric";

// http://api.openweathermap.org/data/2.5/weather?id=524901&appid={API key}&lang={lang}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//http://openweathermap.org/img/wn/10d@2x.png

var fetchWeatherData = function (searchTerm) {
    var weatherDataUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${openWeatherAPIKey}&units=${units}`

    fetch(weatherDataUrl)
    .then(function (responseOne) {

        if(responseOne.ok) {
            console.log("This was the fetch responseOne", responseOne);
            responseOne.json().then(function (weatherData) {
                console.log("This is the JSON weatherData", weatherData);
                var lon = weatherData.coord.lon;
                var lat = weatherData.coord.lat;
                var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=${units}`

                fetch(oneCallUrl)
                .then(function (responseTwo) {

                    if (responseTwo.ok) {
                        console.log("We're killing it");
                        responseTwo.json().then(function (oneCallData) {
                            console.log("This is the JSON oneCallData", oneCallData);
                            console.log(oneCallData.current.dt);
                            var clacTime = moment.unix(oneCallData.current.dt).calendar();
                            console.log(clacTime);
                        })

                    }
                })
            });

        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather server.")
    })

}



var citySubmitHandler = function (event) {
    event.preventDefault();
    var cityToSearchInput = document.getElementById("cityToSearch");
    cityName = cityToSearchInput.value;
    fetchWeatherData(cityName);
}





// Run START

theFormEl.addEventListener("submit", citySubmitHandler);
