const searchBarValue = $("#search-bar").val();

const weatherApp = () => {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchBarValue +
      "&appid=977cc3d092b336617ae6ce66a9d60dac"
  )
    .then((response) => {
      if (response.ok) return response.json();
    })

    .then((data) => {
      $("#location-name-date").text(data[0].name);
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=minutely,hourly&appid=977cc3d092b336617ae6ce66a9d60dac&units=imperial`
      );
    })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
      $("#current-weather-icon").attr(
        `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
      );
      $("#temp").text("Temp: " + data.current.temp);
      $("#wind").text("Wind: " + data.current.wind_speed);
      $("#humidity").text("Humidity: " + data.current.humidity);
      $("#uv-index").text("UV-Index: " + data.current.uvi);
      $(".current-date").text(
        moment.unix(data.current.dt).format("MMM Do YYYY")
      );

      // 5 daily cards weather prediction
      for (let i = 1; i < 6; i++) {
        const day = data.daily[i];
        let cardContainer = $("#card-container");
        let dateEl = $("<h4>").text(moment.unix(day.dt).format("MMM Do"));
        cardContainer.append(dateEl);
        let weatherIcon = $("<img>", {
          src: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          class: "weather-icon",
        });
        cardContainer.append(weatherIcon);
        let tempEl = $("<p>").text("Temp: " + day.temp.day + "°F");
        cardContainer.append(tempEl);
        let windEl = $("<p>").text("Wind: " + day.wind_speed + "mph");
        cardContainer.append(windEl);
        let humidEl = $("<p>").text("Humidity: " + day.humidity + "%");
        cardContainer.append(humidEl);
      }
    });
};

weatherApp();

// press enter to go to location
const logKey = (e) => {
  if (e.code === "Enter") {
    weatherApp();
    searchBarValue.trigger("focus");
  }
};

$("#search-button").on("click", function () {
  weatherApp();
});
