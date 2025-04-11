document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector(".search-btn");
    const searchInput = document.querySelector("input");
    const weatherCard = document.getElementById("weather-card");
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.querySelector(".get-weather");

    // General search button for weather (used in search box)
    searchButton.addEventListener("click", async () => {
        const city = searchInput.value.trim();
        fetchWeather(city);
    });

    // Show input field and button when clicking the weather card
    weatherCard.addEventListener("click", () => {
        cityInput.style.display = "block";
        getWeatherBtn.style.display = "block";
    });

    // Fetch weather when clicking "Get Weather" inside the weather card
    getWeatherBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        fetchWeather(city);
    });

    // Function to fetch weather data
    async function fetchWeather(city) {
        if (!city) {
            alert("Please enter a city name!");
            return;
        }

        const apiKey = "70695ca565e8ec54d8d2fa1b9d7fe62e"; // Your API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.cod !== 200) {
                alert("Error fetching weather data: " + data.message);
                return;
            }

            // Display weather details
            alert(`🌤 Weather in ${data.name}:
🌡 Temperature: ${data.main.temp}°C
☁ Condition: ${data.weather[0].description}
💨 Wind Speed: ${data.wind.speed} m/s
💧 Humidity: ${data.main.humidity}%`);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch weather data. Please try again!");
        }
    }
});
