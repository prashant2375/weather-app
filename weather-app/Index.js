const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode === 13) getResults(searchbox.value);
}

async function getResults(query) {
  try {
    const response = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
    const weather = await response.json();
    displayResults(weather);
  } catch (err) {
    displayError();
  }
}

function displayError() {
  document.querySelector('.location .city').innerText = "City Not Found";
  document.querySelector('.location .date').innerText = "--";
  document.querySelector('.current .temp').innerHTML = "--<span>°c</span>";
  document.querySelector('.current .weather').innerText = "--";
  document.querySelector('.hi-low').innerText = "--";
  document.querySelector('.current-time').innerText = "--:--";
  document.querySelector('.wind-speed').innerText = "Wind Speed: -- m/s";
  document.querySelector('.humidity').innerText = "Humidity: -- %";
  document.querySelector('.air-speed').innerText = "Air Speed: -- m/s";
  document.querySelector('.pressure').innerText = "Pressure: -- hPa";
  document.querySelector('.weather-icon').src = "";
  document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=1400&q=80')";
}

function displayResults(weather) {
  if (weather.cod !== 200) {
    displayError();
    return;
  }

  try {
    document.querySelector('.location .city').innerText = `${weather.name}, ${weather.sys.country}`;
  } catch { document.querySelector('.location .city').innerText = "City Not Found"; }

  let now = new Date();
  document.querySelector('.location .date').innerText = dateBuilder(now);
  document.querySelector('.current-time').innerText = formatTime(now);

  try {
    document.querySelector('.current .temp').innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  } catch { document.querySelector('.current .temp').innerHTML = "--<span>°c</span>"; }

  try {
    document.querySelector('.current .weather').innerText = weather.weather[0].main;
  } catch { document.querySelector('.current .weather').innerText = "--"; }

  try {
    document.querySelector('.hi-low').innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
  } catch { document.querySelector('.hi-low').innerText = "--"; }

  // Wind speed
  try {
    document.querySelector('.wind-speed').innerText = `Wind Speed: ${weather.wind.speed} m/s`;
  } catch { document.querySelector('.wind-speed').innerText = "Wind Speed: -- m/s"; }

  // Humidity
  try {
    document.querySelector('.humidity').innerText = `Humidity: ${weather.main.humidity} %`;
  } catch { document.querySelector('.humidity').innerText = "Humidity: -- %"; }

  // Air speed (wind speed)
  try {
    document.querySelector('.air-speed').innerText = `Air Speed: ${weather.wind.speed} m/s`;
  } catch { document.querySelector('.air-speed').innerText = "Air Speed: -- m/s"; }

  // Pressure
  try {
    document.querySelector('.pressure').innerText = `Pressure: ${weather.main.pressure} hPa`;
  } catch { document.querySelector('.pressure').innerText = "Pressure: -- hPa"; }

  // Weather icon
  try {
    document.querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  } catch { document.querySelector('.weather-icon').src = ""; }

  // Improved dynamic backgrounds by weather type
  let weatherDesc;
  try { weatherDesc = weather.weather[0].main.toLowerCase(); } catch { weatherDesc = ""; }

  let bgUrl;
  if (weatherDesc === "clear") {
    // Clear blue sky
    bgUrl = "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "clouds") {
    // Dramatic clouds
    bgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "rain" || weatherDesc === "drizzle") {
    // Rainy window
    bgUrl = "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "snow") {
    // Snowy trees
    bgUrl = "https://images.unsplash.com/photo-1518085250887-2b579a2fd929?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "thunderstorm") {
    // Thunderstorm with lightning
    bgUrl = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "mist" || weatherDesc === "fog" || weatherDesc === "haze") {
    // Foggy forest
    bgUrl = "https://images.unsplash.com/photo-1502086223501-3c6b63c3a9b7?auto=format&fit=crop&w=1400&q=80";
  } else if (weatherDesc === "sunny") {
    // Sunny day (extra keyword, though OWM usually returns "Clear")
    bgUrl = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1400&q=80";
  } else {
    // Fallback nature
    bgUrl = "https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=1400&q=80";
  }
  document.body.style.backgroundImage = `url('${bgUrl}')`;
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day} ${date} ${month} ${year}`;
}

function formatTime(d) {
  let h = d.getHours().toString().padStart(2, '0');
  let m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
