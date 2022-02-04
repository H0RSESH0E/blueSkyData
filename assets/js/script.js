
var openWeatherAPIKey = "3fd922e8cac3e8747c787364f94aace5";
var theFormEl = document.querySelector("#search-form");
var theSearchHistoryContainer = document.querySelector("#search-history-container");
var currentAndForecast = document.querySelector("#all-search-results");
currentAndForecast.hidden = true;
var currentConditionsCard = document.querySelector("#search-results-current");
var theFiveDaySection = document.querySelector("#five-day-section");
var theInputField = document.querySelector("#cityToSearch");

var forecastCard1 = document.querySelector("#card1");
var forecastCard2 = document.querySelector("#card2");
var forecastCard3 = document.querySelector("#card3");
var forecastCard4 = document.querySelector("#card4");
var forecastCard5 = document.querySelector("#card5");


var units = "metric";
var currentSearchWeatherObject = {};
var searchHistory = [];
var dateOfSearch;
var currentWeatherIconSrc;

var starterHistoryArray = ["Jackson", "Dubai", "Tulsa", "Bangkok", "London", "Cape Town", "Toronto", "Lagos"];

// http://api.openweathermap.org/data/2.5/weather?id=524901&appid={API key}&lang={lang}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//http://openweathermap.org/img/wn/10d@2x.png

var fetchWeatherData = function (searchTerm) {
    var weatherDataUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${openWeatherAPIKey}&units=${units}`

    fetch(weatherDataUrl)
        .then(function (responseOne) {

            if (responseOne.ok) {
                // console.log("This was the fetch responseOne", responseOne);
                responseOne.json().then(function (weatherData) {
                    // console.log("This is the JSON weatherData", weatherData);
                    var lon = weatherData.coord.lon;
                    var lat = weatherData.coord.lat;
                    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=${units}`

                    fetch(oneCallUrl)
                        .then(function (responseTwo) {

                            if (responseTwo.ok) {
                                console.log("We're killing it");
                                responseTwo.json().then(function (oneCallData) {
                                    // console.log("This is the JSON oneCallData", oneCallData);
                                    // console.log(oneCallData.current.dt);
                                    var clacTime = moment.unix(oneCallData.current.dt).calendar();
                                    addToSearchHistory(searchTerm);
                                    displaySearchHistoryButtons();
                                    // console.log(clacTime);
                                    currentSearchWeatherObject.currentConditions = oneCallData.current;
                                    currentSearchWeatherObject.dailyForecast = oneCallData.daily;
                                    dateOfSearch = moment.unix(oneCallData.current.dt).format("M/DD/YYYY");
                                    currentWeatherIconSrc = `http://openweathermap.org/img/wn/${currentSearchWeatherObject.currentConditions.weather[0].icon}@2x.png`
                                    // console.log("weather icon", currentWeatherIconSrc);
                                    // console.log("here's the date: ", dateOfSearch);
                                    // console.log("Current Conditions property", currentSearchWeatherObject.currentConditions);
                                    // console.log("Daily Forecast Conditions property", currentSearchWeatherObject.dailyForecast);
                                    displayForcast(cityName);

                                })

                            }
                        })
                });

            }
            else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Open Weather server.")
        })

}

var displaySearchHistoryButtons = function () {
    console.log("trying to display search history", searchHistory);
    theSearchHistoryContainer.innerHTML = "";

    for (var i = 0; i < searchHistory.length; i++) {
        var searchHistoryButton = document.createElement("button");
        searchHistoryButton.classList.add("btn", "past-search");
        searchHistoryButton.setAttribute("id", "btn" + i);
        searchHistoryButton.setAttribute("type", "button");
        searchHistoryButton.textContent = searchHistory[i];
        theSearchHistoryContainer.appendChild(searchHistoryButton);
    }
}

var displayForcast = function (cityName) {

    var uvRatingValue = currentSearchWeatherObject.currentConditions.uvi;
    console.log(uvRatingValue);

    var uvRatingStyle;

    if (uvRatingValue < 3) {
        uvRatingStyle = "low";
    }
    else if (uvRatingValue < 6) {
        uvRatingStyle = "mod";
    }
    else if (uvRatingValue < 8) {
        uvRatingStyle = "high";
    }
    else if (uvRatingValue < 11) {
        uvRatingStyle = "vHigh";
    }
    else {
        uvRatingStyle = "ext";
    }

    console.log(uvRatingStyle, "is the rating style");
    currentConditionsCard.innerHTML = "";

    var currentWeatherHeader = document.createElement("header");
    currentWeatherHeader.classList.add("d-flex", "flex-horiz", "flex-justify-content-right", "align-items-end");
    currentConditionsCard.appendChild(currentWeatherHeader);

    var cityCurrentHeading = document.createElement("h3");
    cityCurrentHeading.classList.add("main-card");
    cityCurrentHeading.textContent = `${cityName} ${dateOfSearch} `
    var cityCurrentHeadingImg = document.createElement("img")
    cityCurrentHeadingImg.src = currentWeatherIconSrc;
    currentWeatherHeader.appendChild(cityCurrentHeading);
    currentWeatherHeader.appendChild(cityCurrentHeadingImg);

    var cityCurrentTemp = document.createElement("p");
    cityCurrentTemp.classList.add("main-card");
    cityCurrentTemp.textContent = `Temp: ${currentSearchWeatherObject.currentConditions.temp} °C`;
    currentConditionsCard.appendChild(cityCurrentTemp);

    var cityCurrentWind = document.createElement("p");
    cityCurrentWind.classList.add("main-card");
    cityCurrentWind.textContent = `Wind: ${currentSearchWeatherObject.currentConditions.wind_speed} km/h`
    currentConditionsCard.appendChild(cityCurrentWind);

    var cityCurrentHumid = document.createElement("p");
    cityCurrentHumid.classList.add("main-card");
    cityCurrentHumid.textContent = `Humidity: ${currentSearchWeatherObject.currentConditions.humidity} %`
    currentConditionsCard.appendChild(cityCurrentHumid);

    var uvDiv = document.createElement("div");
    uvDiv.classList.add("d-flex", "flex-justify-content-right")
    var cityCurrentUvi = document.createElement("p");
    var uvParagIcon = document.createElement("p");
    cityCurrentUvi.classList.add("main-card");
    cityCurrentUvi.textContent = `UV Index:\u00a0`;
    uvParagIcon.classList.add("uv-icon", "d-flex", "flex-justify-content-center", "align-items-center", uvRatingStyle);
    uvParagIcon.textContent = uvRatingValue;
    uvDiv.appendChild(cityCurrentUvi);
    uvDiv.appendChild(uvParagIcon)
    currentConditionsCard.appendChild(uvDiv);
    currentAndForecast.hidden = false;

}

var addToSearchHistory = function (searchedTerm) {

    if (!searchHistory.includes(searchedTerm)) {

        searchHistory.unshift(searchedTerm)
        if (searchHistory.length > 8) {
            searchHistory.length = 8;
        }
    }
    else {
        var pos = searchHistory.indexOf(searchedTerm);
        searchHistory.splice(pos, 1);
        searchHistory.unshift(searchedTerm)
    }
    var x = JSON.stringify(searchHistory)
    window.localStorage.setItem("blueSkiesApp", x);
}

var loadSearchHistory = function () {
    var x = window.localStorage.getItem("blueSkiesApp");
    if (x) {
        searchHistory = JSON.parse(x);
    }
    else {
        searchHistory = starterHistoryArray;
    }
    displaySearchHistoryButtons();
}


var citySubmitHandler = function (event) {
    event.preventDefault();
    console.log(event.type, " --- is the event type");

    switch (event.type) {
        case "submit":
            var cityToSearchInput = document.getElementById("cityToSearch");
            cityName = cityToSearchInput.value;
            fetchWeatherData(cityName);
            cityToSearchInput.value = "";
            break;

        case "click":
            cityName = event.target.outerText;
            fetchWeatherData(cityName);
    }

}





// Run START
loadSearchHistory();
theFormEl.addEventListener("submit", citySubmitHandler);
theSearchHistoryContainer.addEventListener("click", citySubmitHandler);
