console.log("JS connected ✅");

const apiKey = "d771fb6ced9a20dbc9315926427a45c9";

// Button click
document.getElementById("btn").addEventListener("click", getWeather);

function getWeather() {
  const city = document.getElementById("city-input").value.trim();

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Clear previous data (loading state)
  document.getElementById("city").textContent = "Loading...";
  document.getElementById("temp").textContent = "";
  document.getElementById("desc").textContent = "";
  document.getElementById("hourly").innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.cod !== 200) {
        alert(data.message || "City not found");
        return;
      }

      const name = data.name;
      const temp = data.main.temp;
      const description = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      document.getElementById("city").textContent = `📍 ${name}`;
      document.getElementById("temp").textContent = `🌡 ${temp}°C`;
      document.getElementById("desc").textContent = description;

      // 🔥 Load hourly forecast
      getHourlyForecast(city);
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching weather data");
    });
}

// 🌤 Hourly Forecast
function getHourlyForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const hourlyDiv = document.getElementById("hourly");
      hourlyDiv.innerHTML = "";

      const nextHours = data.list.slice(0, 6);

      nextHours.forEach(item => {
        const time = new Date(item.dt * 1000).getHours();
        const temp = item.main.temp;

        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const card = document.createElement("div");
        card.classList.add("hour-card");

        card.innerHTML = `
          <p>${time}:00</p>
          <img src="${iconUrl}">
          <p>${temp}°C</p>
        `;

        hourlyDiv.appendChild(card);
      });
    })
    .catch(err => console.log(err));
}
