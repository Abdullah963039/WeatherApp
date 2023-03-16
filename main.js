const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".wrapper .input-part"),
  infoTxt = document.querySelector(".wrapper .input-part .info-txt"),
  inputField = document.querySelector(".wrapper .input-part input"),
  locationBtn = document.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = document.querySelector("header i");

const apiKey = ""; // Write Here Your API Key On openweathermap.org , You Should Sign Up

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser Not Support This Feature");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerHTML = error.message;
  infoTxt.classList.add("pending");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerHTML = "Getting Weather Details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerHTML = `${inputField.value} Isn't a Valid City Name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "icons/rain.svg";
    }

    wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
    wrapper.querySelector(".weather").innerHTML = description;
    wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
  inputField.focus();
});
