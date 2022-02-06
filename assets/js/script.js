
var openWeatherAPIKey = "3fd922e8cac3e8747c787364f94aace5";
var theFormEl = document.querySelector("#search-form");
var theSearchHistoryContainer = document.querySelector("#search-history-container");
var currentConditionsCard = document.querySelector("#search-results-current");
var theFiveDaySection = document.querySelector("#five-day-section");
var theInputField = document.querySelector("#cityToSearch");
var theBGImage = document.querySelector("#background");
document.querySelector(".current-day").hidden = true;
document.querySelector(".five-day").hidden = true;
var units = "metric";
var currentSearchWeatherObject = {};
var searchHistory = [];
var dateOfSearch;
var currentWeatherIconSrc;

var starterHistoryArray = ["Jackson", "Dubai", "Tulsa", "Bangkok", "London", "Cape Town", "Toronto", "Lagos"];
var randomBG = {
    0: "https://c.pxhere.com/images/44/8e/6a598ea940cea51806267676787f-1438901.jpg!d",
    1: "https://c.pxhere.com/photos/24/7e/mountain_cloud_sunset_sunrise_mountain_range-19749.jpg!d",
    2: "https://c.pxhere.com/photos/db/61/cloud_sky_plane_silhouette_airplane-107895.jpg!d",
    3: "https://c.pxhere.com/photos/0f/22/rainbow_background_roadway_beautiful_landscape_country_road_countryside_blue_sky_clouds_sky-657518.jpg!d",
    4: "https://c.pxhere.com/photos/38/c6/cloud_sky_dawn_dusk_sunrise-7672.jpg!d",
    5: "https://c.pxhere.com/photos/65/cf/barn_lightning_bolt_storm_thunderstorm_clouds_night_shack-804994.jpg!d",
    6: "https://c.pxhere.com/photos/54/9a/l_ner_lake_clouds_mirroring_water_sky_blue_lake_reflections-1332502.jpg!d",
    7: "https://c.pxhere.com/photos/2d/ee/forest_fog_nature_winter_trees_winter_mood_atmospheric_romantic-769880.jpg!d"
}


// http://api.openweathermap.org/data/2.5/weather?id=524901&appid={API key}&lang={lang}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//http://openweathermap.org/img/wn/10d@2x.png

var fetchWeatherData = function (searchTerm) {
    var weatherDataUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${openWeatherAPIKey}&units=${units}`

    fetch(weatherDataUrl)
        .then(function (responseOne) {

            if (responseOne.ok) {
                responseOne.json().then(function (weatherData) {
                    var lon = weatherData.coord.lon;
                    var lat = weatherData.coord.lat;
                    var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=${units}`

                    fetch(oneCallUrl)
                        .then(function (responseTwo) {

                            if (responseTwo.ok) {
                                console.log("We're killing it");
                                responseTwo.json().then(function (oneCallData) {
                                    console.log(oneCallData);
                                    var clacTime = moment.unix(oneCallData.current.dt).calendar();
                                    addToSearchHistory(searchTerm);
                                    displaySearchHistoryButtons();
                                    currentSearchWeatherObject.currentConditions = oneCallData.current;
                                    currentSearchWeatherObject.dailyForecast = oneCallData.daily;
                                    dateOfSearch = moment.unix(oneCallData.current.dt).format("M/DD/YYYY");
                                    currentWeatherIconSrc = `http://openweathermap.org/img/wn/${currentSearchWeatherObject.currentConditions.weather[0].icon}@2x.png`
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

var returnUvIndexStyle = function (uvRatingValue) {
    if (uvRatingValue < 3) {
        return "low";
    }
    else if (uvRatingValue < 6) {
        return "mod";
    }
    else if (uvRatingValue < 8) {
        return "high";
    }
    else if (uvRatingValue < 11) {
        return "vHigh";
    }
    else {
        return "ext";
    }


}


var displayForcast = function (cityName) {

    document.querySelector(".current-day").hidden =true;
    document.querySelector(".five-day").hidden = true;


    var uvRatingValue = currentSearchWeatherObject.currentConditions.uvi;
    console.log(uvRatingValue);

    var uvRatingStyle = returnUvIndexStyle(uvRatingValue);

    currentConditionsCard.innerHTML = "";
    currentConditionsCard.classList.add("current-c");
    var currentWeatherHeader = document.createElement("header");
    currentWeatherHeader.classList.add("d-flex", "flex-horiz", "flex-justify-content-start", "align-items-end");
    currentConditionsCard.appendChild(currentWeatherHeader);

    var cityCurrentHeading = document.createElement("h1");
    cityCurrentHeading.classList.add("main-card");
    cityCurrentHeading.textContent = `${cityName} (${dateOfSearch})\u00a0 `;
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
    cityCurrentWind.textContent = `Wind: ${currentSearchWeatherObject.currentConditions.wind_speed} km/h`;
    currentConditionsCard.appendChild(cityCurrentWind);

    var cityCurrentHumid = document.createElement("p");
    cityCurrentHumid.classList.add("main-card");
    cityCurrentHumid.textContent = `Humidity: ${currentSearchWeatherObject.currentConditions.humidity} %`;
    currentConditionsCard.appendChild(cityCurrentHumid);

    var uvDiv = document.createElement("div");
    uvDiv.classList.add("d-flex", "flex-justify-content-start");
    var cityCurrentUvi = document.createElement("p");
    var uvParagIcon = document.createElement("p");
    cityCurrentUvi.classList.add("main-card");
    cityCurrentUvi.textContent = `UV Index:\u00a0`;
    uvParagIcon.classList.add("uv-icon", "d-flex", "flex-justify-content-center", "align-items-center", uvRatingStyle);
    uvParagIcon.textContent = uvRatingValue;
    uvDiv.appendChild(cityCurrentUvi);
    uvDiv.appendChild(uvParagIcon)
    currentConditionsCard.appendChild(uvDiv);

    displayFiveDayForecast ()
    loadRandomBG();

    var delay = setTimeout(function(){
        document.querySelector(".current-day").hidden = false;
        document.querySelector(".five-day").hidden = false;
            
    }, 750);
}



var displayFiveDayForecast = function () {

    theFiveDaySection.innerHTML = "";

    for (var i = 0; i < 5; i++) {

        var day = {
            date: moment().add(i+1, "d").format("dddd"),
            icon: `http://openweathermap.org/img/wn/${currentSearchWeatherObject.dailyForecast[i].weather[0].icon}.png`,
            temp: currentSearchWeatherObject.dailyForecast[i].temp.day,
            wind: currentSearchWeatherObject.dailyForecast[i].wind_speed,
            humid: currentSearchWeatherObject.dailyForecast[i].humidity,

        }        
        var markup = `
        <p>${day.date}</p>
        <p><img src="${day.icon}"></P>
        <p>Temp: ${day.temp} °C</p>
        <p>Wind: ${day.wind} km/h</p>
        <p>Humidity: ${day.humid} %</p>
           `;

        var dailyDiv = document.createElement("div");
        dailyDiv.classList.add("daily-card", "col", "d-flex", "flex-column");
        dailyDiv.innerHTML = markup;
        theFiveDaySection.appendChild(dailyDiv);        
    }


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


var userInputHandler = function (event) {
    event.preventDefault();

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

var loadRandomBG = function() {

    let x = Math.floor((Math.random() * 8));
    console.log(x);
    y = randomBG[x];
    theBGImage.setAttribute("style", `background-image:url("${y}"); background-size: cover;`)

}

// Run START
loadRandomBG();
loadSearchHistory();
theFormEl.addEventListener("submit", userInputHandler);
theSearchHistoryContainer.addEventListener("click", userInputHandler);
