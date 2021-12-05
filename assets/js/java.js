const searchBarValue = "boston";
// $("#search-bar").val();

fetch(
  `http://api.openweathermap.org/geo/1.0/direct?q=${searchBarValue}&appid=977cc3d092b336617ae6ce66a9d60dac`
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
    $("#temp").text("Temp: " + data.current.temp);
    $("#wind").text("Wind: " + data.current.wind_speed);
    $("#humidity").text("Humidity: " + data.current.humidity);
    $("#uv-index").text("UV-Index: " + data.current.uvi);
    $(".current-date").text(moment.unix(data.current.dt).format("MMM Do YYYY"));

    // 5 daily cards weather prediction
    for (let i = 1; i < 6; i++) {
      const day = data.daily[i];
      let cardContainer = $("#card-container");
      let dateEl = $("<h4>").text(moment.unix(day.dt).format("MMM Do"));
      cardContainer.append(dateEl);
      let tempEl = $("<p>").text("Temp: " + day.temp.day + "°F");
      cardContainer.append(tempEl);
      let windEl = $("<p>").text("Wind: " + day.wind_speed + "mph");
      cardContainer.append(windEl);
      let humidEl = $("<p>").text("Humidity: " + day.humidity + "%");
      cardContainer.append(humidEl);
    }
  });
