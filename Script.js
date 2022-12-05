const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input_part");
const infoTextPartStatus = wrapper.querySelector(".info_text");
const inputText = wrapper.querySelector(".input_part input");
const btnLocation = wrapper.querySelector(".btn_location");

const weatherIcons = wrapper.querySelector("img");
const btnBack = wrapper.querySelector("header i");

inputText.addEventListener("keydown", function (e) {
  // if user pressed enter btn and input value is not empty
  if (e.key === "Enter" && inputText.value !== "") {
    resquestAPI(inputText.value);
  }
});

function resquestAPI(city) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${"b8f0f6ff291f9108c99243ebbe2e6c56"}`;

  fetchData(api);
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTextPartStatus.innerText = `${inputText.value} isn't a valid city name`;
    infoTextPartStatus.classList.replace("pending", "error");
  } else {
    // lets get required properties value from info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const {
      temp: cityTemp,
      feels_like: cityTempFeels,
      humidity: cityHumidity,
    } = info.main;

    // using custom icon according id which api return us

    if (id === 800) {
      weatherIcons.src = "./Weather Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcons.src = "./Weather Icons/strom.svg";
    } else if (id >= 300 && id <= 321) {
      weatherIcons.src = "./Weather Icons/rain.svg";
    } else if (id >= 500 && id <= 531) {
      weatherIcons.src = "./Weather Icons/rain.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcons.src = "./Weather Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcons.src = "./Weather Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcons.src = "./Weather Icons/cloud.svg";
    }
    // let's pass these values to a particular element

    wrapper.querySelector(".weather_temp .numb").innerText =
      Math.floor(cityTemp);
    wrapper.querySelector(".feels .numb-2").innerText =
      Math.floor(cityTempFeels);
    wrapper.querySelector(".humidity span").innerText = `${Math.floor(
      cityHumidity
    )}%`;

    wrapper.querySelector(".weather_info").innerText = description;
    wrapper.querySelector(
      ".weather_location span"
    ).innerText = `${city}, ${country}`;

    infoTextPartStatus.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

/// btn click - Get user Device loaction

btnLocation.addEventListener("click", function () {
  if (navigator.geolocation) {
    // If browser support geolocation api

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation API");
  }
});

function onSuccess(position) {
  // getting lat and long of user device from croods object

  const { latitude, longitude } = position.coords;
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${"b8f0f6ff291f9108c99243ebbe2e6c56"}`;
  fetchData(api);
}

function onError(error) {
  infoTextPartStatus.innerText = error.message;
  infoTextPartStatus.classList.add("error");
}

function fetchData(api) {
  infoTextPartStatus.innerText = "Getting weather details...";
  infoTextPartStatus.classList.add("pending");

  // Getting api response and returning it with parsing into js object and in another the function calling weatherDetails function with passing api result as an argument

  fetch(api)
    .then((res) => res.json())
    .then((data) => weatherDetails(data));
}

btnBack.addEventListener("click", function () {
  wrapper.classList.remove("active");
  inputText.innerText = "";
});
