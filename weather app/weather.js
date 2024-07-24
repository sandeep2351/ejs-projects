const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const getWeatherByLocation = async (city) => {
    try {
        const response = await fetch(`/weather/${city}`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        addWeatherToPage(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

function addWeatherToPage(data) {
    const temp = KtoC(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const weather = document.createElement("div");
    weather.classList.add("weather");

    weather.innerHTML = `
        <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
        <small>${data.weather[0].main}</small>
        <div class="more-info">
            <p>Humidity : <span>${humidity}%</span></p>
            <p>Wind speed : <span>${+Math.trunc(windSpeed * 3.6)} km/h</span></p>
        </div>
    `;
    
    main.innerHTML = "";
    main.appendChild(weather);
}

function KtoC(K) {
    return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = search.value.trim();

    if (city) {
        getWeatherByLocation(city);
    }
});
