let cardContainer = $("#card-container");
let pastSearches = [];
let recentSearchList = $("#recents");
const searchBarValue = $("#search-bar");

if (localStorage.getItem("pastSearches")) {
  pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
}

const searchList = () => {
  recentSearchList.empty();
  for (let i = 0; i < pastSearches.length; i++) {
    let li = $(`<li class="recent-search"> ${pastSearches[i]} </li> `);
    recentSearchList.append(li);
  }
  $(".recent-search").on("click", function () {
    weatherApp($(this).text());
  });
};

searchList();

const weatherApp = (city) => {
  cardContainer.html("");

  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
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
      if (pastSearches.indexOf(data[0].name) === -1) {
        pastSearches.push(data[0].name);
        localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
        searchBarValue.val("");

        searchList();
      }

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
    weatherApp($("#search-bar").val());
  }
};

$("#search-button").on("click", function () {
  console.log($("#search-bar").val());
  weatherApp($("#search-bar").val());
});

$("#search-bar").keypress(logKey);
