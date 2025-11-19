const input = document.getElementById("city-input");
const btn = document.getElementById("btnlocation");
const weatherDisplay = document.getElementById("weather-display");

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
    .then((response) => response.json())
    .then((weather) => {
      
      weatherDisplay.classList.add('show');

      
      document.getElementById("city").innerText = weather.location.name;
      document.getElementById("country").innerText = weather.location.country;
      document.getElementById("temp").innerText = weather.current.temp_c + "°C";
      document.getElementById("condition").innerText = weather.current.condition.text;
      document.getElementById("humidity").innerText = weather.current.humidity + "%";
      document.getElementById("wind").innerText = weather.current.wind_kph + " kph";
      document.getElementById("feelslike").innerText = weather.current.feelslike_c + "°C";
      document.getElementById("time").innerText = weather.location.localtime;
      document.getElementById("uv").innerText = weather.current.uv;
      document.getElementById("visibility").innerText = weather.current.vis_km + " km";
      document.getElementById("location").innerText = `${weather.location.name}, ${weather.location.country}`;
      document.getElementById("icon").innerHTML = `<img src="${weather.current.condition.icon}" alt="Weather icon">`;

     
      return fetch(`https://restcountries.com/v3.1/name/${weather.location.country}`);
    })
    .then((res) => res.json())
    .then((data) => {
      countryDataGlobal = data[0];
    })
    .catch((err) => alert("Error: " + err.message));
}


btn.addEventListener("click", () => {
  if (!countryDataGlobal) {
    alert("Search for a city first.");
    return;
  }

  const data = countryDataGlobal;

  const win = window.open("", "_blank", "width=650,height=900");

  win.document.write(`
    <html>
    <head>
      <title>${data.name.common} - Country Info</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: "Poppins", Arial, sans-serif; 
          padding: 30px;
          background: linear-gradient(135deg, #1e2633, #0f1620);
          color: #fff;
          min-height: 100vh;
        }
        
        .container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          padding: 40px;
          border-radius: 25px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        h1 { 
          margin-bottom: 30px;
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #3478f6, #5590ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        h2 {
          font-size: 24px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: 600;
          opacity: 0.95;
        }
        
        p {
          margin: 15px 0;
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        strong {
          color: #3478f6;
          font-weight: 600;
        }
        
        img { 
          margin-top: 15px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        iframe {
          border-radius: 15px;
          margin-top: 15px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #444b57;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${data.name.common}</h1>

        <p><strong>Capital:</strong> ${data.capital ? data.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${data.region}</p>
        <p><strong>Subregion:</strong> ${data.subregion || "N/A"}</p>
        <p><strong>Languages:</strong> ${
          data.languages ? Object.values(data.languages).join(", ") : "N/A"
        }</p>
        <p><strong>Currencies:</strong> ${
          data.currencies
            ? Object.values(data.currencies)
                .map((c) => c.name)
                .join(", ")
            : "N/A"
        }</p>

        <h2>Flag</h2>
        <img src="${data.flags.png}" width="220">

        <h2>Map</h2>
        <iframe
          width="100%"
          height="350"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${
            data.latlng[1] - 5
          },${data.latlng[0] - 5},${data.latlng[1] + 5},${data.latlng[0] + 5}&layer=mapnik&marker=${data.latlng[0]},${data.latlng[1]}">
        </iframe>
      </div>
    </body>
    </html>
  `);

  win.document.close();
});