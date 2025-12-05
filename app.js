const input = document.getElementById("city-input");
const btn = document.getElementById("btnlocation");
const weatherDisplay = document.getElementById("weather-display");
const countryInfoDiv = document.getElementById("country-info");

let countryDataGlobal = null;

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") loadWeather();
});

function loadWeather() {
  const location = input.value.trim();
  if (!location) return alert("Please enter a city name.");

  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=93e92490cb5d44c88fd90338251211&q=${location}&days=1`
  )
    .then((r) => r.json())
    .then((weather) => {
      weatherDisplay.style.display = "block";
      countryInfoDiv.style.display = "none";

      document.getElementById("city").innerText = weather.location.name;
      document.getElementById("country").innerText = weather.location.country;
      document.getElementById("temp").innerText = weather.current.temp_c + "°C";
      document.getElementById("condition").innerText =
        weather.current.condition.text;
      document.getElementById("humidity").innerText =
        weather.current.humidity + "%";
      document.getElementById("wind").innerText =
        weather.current.wind_kph + " kph";
      document.getElementById("feelslike").innerText =
        weather.current.feelslike_c + "°C";
      document.getElementById("time").innerText = weather.location.localtime;
      document.getElementById("uv").innerText = weather.current.uv;
      document.getElementById("visibility").innerText =
        weather.current.vis_km + " km";

      document.getElementById(
        "icon"
      ).innerHTML = `<img src="${weather.current.condition.icon}">`;

      return fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          weather.location.country
        )}?fullText=false`
      );
    })
    .then((r) => r.json())
    .then((data) => {
      if (!data || data.status === 404) {
        alert("Country details not found");
        countryDataGlobal = null;
        return;
      }

      countryDataGlobal = data[0];
    })
    .catch((err) => alert("Error: " + err.message));
}


btn.addEventListener("click", () => {
  if (!countryDataGlobal) {
    alert("Search for a city first.");
    return;
  }

  const d = countryDataGlobal;

  weatherDisplay.style.display = "none";

  countryInfoDiv.style.display = "block";

  countryInfoDiv.innerHTML = `
    <div style="
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(25px);
      padding: 30px;
      border-radius: 20px;
      color: #fff;
      animation: fadeIn .3s ease;
    ">
      <h1 style="font-size: 32px; margin-bottom: 10px; color:#5ea0ff;">
        ${d.name.common}
      </h1>
      
      <img src="${d.flags.png}" width="550" 
           style="margin-top:10px; border-radius:10px; filter: drop-shadow(0 4px 15px rgba(255, 255, 255, 0.2));
  animation: bounce 3s infinite ease-in-out; align-self: center;"/>
     
      <div class="detail-cardC">
        <p><strong>CAPITAL:</strong> ${d.capital ? d.capital[0] : "N/A"}</p>
      </div>
      <div class="detail-cardC">
        <p><strong>POPULATION:</strong> ${d.population.toLocaleString()}</p>
      </div>
      <div class="detail-cardC">
        <p><strong>REGION:</strong> ${d.region}</p>
      </div>
      <div class="detail-cardC">
        <p><strong>SUBREGION:</strong> ${d.subregion || "N/A"}</p>
      </div>
      <div class="detail-cardC">
        <p><strong>LANGUAGES:</strong> ${d.languages ? Object.values(d.languages).join(", ") : "N/A"}</p>
      </div>
      <div class="detail-cardC">
        <p><strong>CURRENCIES:</strong> ${d.currencies
      ? Object.values(d.currencies)
        .map((c) => c.name)
        .join(", ")
      : "N/A"
      }</p>
    </div>
      

      

      <h2 style="margin-top:25px; text-align: center; color: white;">Map</h2>
      <iframe
        width="100%"
        height="350"
        style="border-radius:12px; margin-top:10px;"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${d.latlng[1] - 5
    },${d.latlng[0] - 5},${d.latlng[1] + 5},${d.latlng[0] + 5
    }&layer=mapnik&marker=${d.latlng[0]},${d.latlng[1]}"
      ></iframe>

      <button id="backBtn" style="
        margin-top:20px;
        padding:12px 20px;
        background:#5ea0ff;
        border:none;
        border-radius:10px;
        color:#fff;
        font-size:16px;
        cursor:pointer;
      ">Back to Weather</button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    countryInfoDiv.style.display = "none";
    weatherDisplay.style.display = "block";
  });
});
