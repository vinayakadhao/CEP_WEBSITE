document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector(".search-btn");
    const searchInput = document.getElementById("main-search");

    const weatherCard = document.getElementById("weather-card");
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.querySelector(".get-weather");

    const mspCard = document.getElementById("msp-card");
    const mspInput = document.getElementById("msp-input");
    const getMspBtn = document.querySelector(".get-msp");
    const mspResult = document.getElementById("msp-result");

    // ✅ General Search (Weather or MSP)
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();

        if (!query) {
            alert("Please enter a city or crop name!");
            return;
        }

        if (isCity(query)) {
            fetchWeather(query);
        } else {
            fetchMSP(query);
        }
    });

    // ✅ Show Weather input when clicking the card
    weatherCard.addEventListener("click", () => {
        cityInput.style.display = "block";
        getWeatherBtn.style.display = "block";
    });

    // ✅ Fetch weather when clicking "Get Weather"
    getWeatherBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        fetchWeather(city);
    });

    // ✅ Fetch MSP when clicking "Get MSP" inside MSP box
    getMspBtn.addEventListener("click", () => {
        const crop = mspInput.value.trim();
        fetchMSP(crop);
    });

    // ✅ Function to fetch weather data
    async function fetchWeather(city) {
        if (!city) {
            alert("Please enter a city name!");
            return;
        }

        const apiKey = "70695ca565e8ec54d8d2fa1b9d7fe62e"; // OpenWeather API Key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.cod !== 200) {
                alert("Error fetching weather data: " + data.message);
                return;
            }

            /
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

    async function fetchMSP(crop) {
        if (!crop) {
            alert("Please enter a crop name!");
            return;
        }

        const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"; // MSP API Key
        const apiUrl = `https://api.data.gov.in/resource/msp-data?api-key=${apiKey}&format=json&limit=1&filters[crop]=${encodeURIComponent(crop)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.records || data.records.length === 0) {
                mspResult.style.display = "block";
                mspResult.innerHTML = `❌ No MSP data found for <strong>${crop}</strong>`;
                return;
            }

            const mspDetails = data.records[0];

            // ✅ Display MSP details inside the card
            mspResult.style.display = "block";
            mspResult.innerHTML = `
                🌾 MSP for <strong>${mspDetails.crop}</strong>: <br>
                💰 Price: ₹${mspDetails.msp} per quintal <br>
                📅 Year: ${mspDetails.year}
            `;
        } catch (error) {
            console.error("Error:", error);
            mspResult.style.display = "block";
            mspResult.innerHTML = "⚠ Failed to fetch MSP data. Please try again!";
        }
    }

    // ✅ Function to determine if input is a city or crop
    function isCity(query) {
        return /^[a-zA-Z\s]+$/.test(query);
    }
});
