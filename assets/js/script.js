// Data array (exam question implementation)
const weatherData = [
    { district: "Dhaka", temperature: 32, condition: "Sunny", key: "sunny" },
    { district: "Sylhet", temperature: 27, condition: "Rainy", key: "rainy" },
    { district: "Khulna", temperature: 30, condition: "Cloudy", key: "cloudy" }
];

// Helper to find entry
function findWeatherByDistrict(d) {
    return weatherData.find(w => w.district === d);
}

// UI elements
const selectEl = document.getElementById('citySelect');
const msgEl = document.getElementById('msg');
const showBtn = document.getElementById('showBtn');

// Graphic elements from the page
const sunEl = document.querySelector('.sun');
const cloudEl = document.querySelector('.cloud-glass');
const bodyEl = document.body;

// Create a dynamic rain element (for rainy state)
let rainContainer = null;

function showSunny() {
    // show sun, hide cloud
    if (sunEl) sunEl.style.opacity = '1';
    if (cloudEl) cloudEl.style.opacity = '0.25';
    // remove rain
    if (rainContainer) { rainContainer.remove(); rainContainer = null; }
    bodyEl.setAttribute('data-weather', 'sunny');
}

function showCloudy() {
    if (sunEl) sunEl.style.opacity = '0.35';
    if (cloudEl) cloudEl.style.opacity = '1';
    if (rainContainer) { rainContainer.remove(); rainContainer = null; }
    bodyEl.setAttribute('data-weather', 'cloudy');
}

function showRainy() {
    if (sunEl) sunEl.style.opacity = '0.2';
    if (cloudEl) cloudEl.style.opacity = '1';
    // add simple raindrop animation if not present
    if (!rainContainer) {
        rainContainer = document.createElement('div');
        rainContainer.id = 'rainContainer';
        rainContainer.style.position = 'absolute';
        rainContainer.style.top = '0';
        rainContainer.style.right = '0';
        rainContainer.style.width = '40%';
        rainContainer.style.height = '100%';
        rainContainer.style.pointerEvents = 'none';
        // create some raindrops
        for (let i = 0; i < 12; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.position = 'absolute';
            drop.style.width = '2px';
            drop.style.height = '14px';
            drop.style.background = 'rgba(255,255,255,0.9)';
            drop.style.left = (5 + i * 7) + '%';
            drop.style.top = (20 + (i % 3) * 10) + '%';
            drop.style.opacity = '0.9';
            drop.style.borderRadius = '2px';
            drop.style.transform = 'translateY(0)';
            drop.style.animation = 'fall 1s linear infinite';
            drop.style.animationDelay = (i * 0.08) + 's';
            rainContainer.appendChild(drop);
        }
        document.body.appendChild(rainContainer);
    }
    bodyEl.setAttribute('data-weather', 'rainy');
}

// core show function
function showWeather() {
    const district = selectEl.value;
    if (!district) {
        msgEl.textContent = '⚠ Please select a city from the dropdown.';
        // reset visuals
        if (sunEl) sunEl.style.opacity = '';
        if (cloudEl) cloudEl.style.opacity = '';
        if (rainContainer) { rainContainer.remove(); rainContainer = null; }
        bodyEl.removeAttribute('data-weather');
        return;
    }
    const found = findWeatherByDistrict(district);
    if (!found) {
        msgEl.textContent = 'Selected city not found in dataset.';
        return;
    }
    // text output like exam answer
    msgEl.textContent = `${found.district} | ${found.temperature}°C | ${found.condition}`;

    // update graphics
    if (found.key === 'sunny') showSunny();
    else if (found.key === 'cloudy') showCloudy();
    else if (found.key === 'rainy') showRainy();
}

// event listeners
selectEl.addEventListener('change', showWeather);
showBtn.addEventListener('click', showWeather);

// add subtle CSS for raindrops and weather-themed backgrounds
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
  0% { transform: translateY(-10px); opacity: 0.8; }
  100% { transform: translateY(180px); opacity: 0.2; }
}
body[data-weather="sunny"] {
  background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%);
}
body[data-weather="rainy"] {
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%);
}
body[data-weather="cloudy"] {
  background: linear-gradient(120deg, #bdc3c7 0%, #2c3e50 100%);
}
`;
document.head.appendChild(style);