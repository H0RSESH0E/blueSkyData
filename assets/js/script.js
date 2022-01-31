
var openWeatherAPIKey = "3fd922e8cac3e8747c787364f94aace5";
var theFormEl = document.querySelector("#theForm");
var cityName;


var runFetch = function (url) {


    fetch(url)

}



var citySubmitHandler = function (event) {
    event.preventDefault();
    var cityToSearchInput = document.getElementById("cityToSearch");
    cityName = cityToSearchInput.value;
    var url = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherAPIKey}`;

    runFetch(url);
}





// Run START

theFormEl.addEventListener("submit", citySubmitHandler);
