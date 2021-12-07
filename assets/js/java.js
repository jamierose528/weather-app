let cardContainer = $("#card-container");

const weatherApp = () => {
  cardContainer.html("");
  const searchBarValue = $("#search-bar");
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchBarValue.val() +
      "&appid=977cc3d092b336617ae6ce66a9d60dac"
  )
    .then((response) => {
      console.log(response);
      if (response.ok) return response.json();
    })

    .then((data) => {
      if (data[0] === undefined) {
        alert("Invalid City Name");
        searchBarValue.val("");
        throw "Invalid City Name.";
      }
      console.log(data[0]);
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
      $("#current-weather-icon")
        .attr(
          "src",
          `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
        )
        .attr("alt", data.current.weather[0].description);
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

        let card = $("<card>");
        let dateEl = $("<h5>").text(moment.unix(day.dt).format("MMM Do"));
        card.append(dateEl);
        let weatherIcon = $("<img>", {
          src: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          class: "weather-icon",
        });
        card.append(weatherIcon);
        let tempEl = $("<p>").text("Temp: " + day.temp.day + "°F");
        card.append(tempEl);
        let windEl = $("<p>").text("Wind: " + day.wind_speed + "mph");
        card.append(windEl);
        let humidEl = $("<p>").text("Humidity: " + day.humidity + "%");
        card.append(humidEl);
        cardContainer.append(card);
      }
    });
};

// press enter to go to location
const logKey = (e) => {
  if (e.code === "Enter") {
    weatherApp();
  }
};

$("#search-button").on("click", function () {
  weatherApp();
});

$("#search-bar").keypress(logKey);
