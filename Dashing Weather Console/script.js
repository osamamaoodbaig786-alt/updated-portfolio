const API_KEY = "9ccfa59f9b2ce86cfd0f7917b2d27a29";

const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');

// Live Date and Day Update Function
function updateLiveDate() {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;

    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleDateString('en-US', { month: 'short' });

    dateEl.innerText = `${weekday}, ${day} ${month}`;
}

// Call on page load
updateLiveDate();

async function getLiveWeather(city) {
    if (!city) return;

    try {
        // 1. Fetch Live Current Weather
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!currentRes.ok) {
            alert("City nahi mili! Baraye karam naam dobara check karen.");
            return;
        }

        const currentData = await currentRes.json();
        updateCurrentUI(currentData);

        // 2. Fetch Forecast Data
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        const forecastData = await forecastRes.json();
        updateHourlyUI(forecastData.list.slice(0, 9));

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// 3-hour intervals ko 24 consecutive 1-hour slots mein split karne wala function (Modal Data ke Saath)
function interpolateHourlyData(threeHourList) {
    const hourly24 = [];
    const limit = Math.min(8, threeHourList.length - 1);
    
    for (let i = 0; i < limit; i++) {
        const currentBlock = threeHourList[i];
        const nextBlock = threeHourList[i + 1] || currentBlock;

        const startTime = currentBlock.dt * 1000;
        const tempStart = currentBlock.main.temp;
        const tempEnd = nextBlock.main.temp;

        for (let step = 0; step < 3; step++) {
            const timeOffset = step * 3600 * 1000;
            const interpolatedTemp = tempStart + ((tempEnd - tempStart) * (step / 3));

            hourly24.push({
                dt: (startTime + timeOffset) / 1000,
                temp: Math.round(interpolatedTemp),
                feels_like: Math.round(currentBlock.main.feels_like),
                humidity: currentBlock.main.humidity,
                wind_speed: (currentBlock.wind.speed * 3.6).toFixed(1),
                pressure: currentBlock.main.pressure,
                description: currentBlock.weather[0].description,
                icon: currentBlock.weather[0].icon
            });
        }
    }
    return hourly24;
}

function updateCurrentUI(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1);
    const pressure = data.main.pressure;
    const condition = data.weather[0].main;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    const cityEl = document.querySelector('.city-name');
    const tempEl = document.querySelector('.temp-display');
    const condEl = document.querySelector('.condition-text');
    const iconImg = document.querySelector('.weather-icon');
    const windEl = document.querySelector('.wind-value');
    const humEl = document.querySelector('.humidity-value');
    const pressEl = document.querySelector('.pressure-value');

    if (cityEl) cityEl.innerText = `${cityName.toUpperCase()}, ${country}`;
    if (tempEl) tempEl.innerText = `${temp}°C`;
    if (condEl) condEl.innerText = `Weather: ${condition} | ${description}`;
    if (iconImg) iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    if (windEl) windEl.innerText = `${windSpeed} km/h`;
    if (humEl) humEl.innerText = `${humidity}%`;
    if (pressEl) pressEl.innerText = `${pressure} hPa`;
}

function updateHourlyUI(threeHourList) {
    const hourlyContainer = document.getElementById('hourlyCards');
    if (!hourlyContainer) return;

    hourlyContainer.innerHTML = '';
    const full24Hours = interpolateHourlyData(threeHourList);

    full24Hours.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const hours = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const cardHTML = `
            <div class="f-card" data-index="${index}">
                <div class="f-time">${hours}</div>
                <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="weather condition">
                <div class="f-temp">${item.temp}°C</div>
            </div>
        `;
        hourlyContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Event listeners on each card
    document.querySelectorAll('.f-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            openWeatherModal(full24Hours[index]);
        });
    });
}

// Modal Functions
function openWeatherModal(data) {
    const modal = document.getElementById('weatherModal');
    const date = new Date(data.dt * 1000);

    document.getElementById('modalTime').innerText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('modalDate').innerText = date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    document.getElementById('modalTemp').innerText = `${data.temp}°C`;
    document.getElementById('modalCondition').innerText = data.description;
    document.getElementById('modalIcon').src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.getElementById('modalFeels').innerText = `${data.feels_like}°C`;
    document.getElementById('modalHumidity').innerText = `${data.humidity}%`;
    document.getElementById('modalWind').innerText = `${data.wind_speed} km/h`;
    document.getElementById('modalPressure').innerText = `${data.pressure} hPa`;

    modal.style.display = 'flex';
}

const modal = document.getElementById('weatherModal');
const closeModal = document.querySelector('.close-modal');

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Event Listeners for Search Button and Enter Key
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) getLiveWeather(query);
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) getLiveWeather(query);
        }
    });
}

getLiveWeather('Karachi');