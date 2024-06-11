const cityInputEl = document.getElementById("city");
const inputContainer = document.querySelector("form > div:first-child");
const searchButton = document.querySelector("button");

let cityInputTimer;
const checkCityName = async userInput => {
    response = await fetch(`/check-city/${userInput}/`);

    switch (response.status) {
        case 204:
            // If response has 204 status it means that city name matched
            return true;
        case 200:
            const suggestions = await response.json();
            return suggestions;
        default:
            console.error(`Got unexpected reponse with ${response.status} status.`)
            return false
    }
}

let currentWeatherEl;
const renderWeather = ({ temperature, precipitation, wind_speed, city, country }) => {
    if (currentWeatherEl) {
        currentWeatherEl.remove();
    }

    currentWeatherEl = document.createElement("div");
    currentWeatherEl.classList.add("weather-container")
    currentWeatherEl.innerHTML = `
        <h1>Current weather in ${city}, ${country}</h1>
        <div class="weather-grid">
            <div>
                <p>Temperature</p>
                <p>${Math.round(temperature)}°C</p>
            </div>
            <div>
                <p>Precipitation</p>
                <p>${precipitation.toFixed(2)} mm</p>
            </div>
            <div>
                <p>Wind speed</p>
                <p>${Math.round(wind_speed)} kmh</p>
        </div>
    `
    document.body.appendChild(currentWeatherEl);
}

const renderSuggestions = suggestions => {
    elementsStrs = suggestions.map(suggestion => {
        [city, country] = suggestion
        return `<li>${city}, ${country}</li>`
    })
    helperTextEl.innerHTML = `<p id="matches-label">Possible matches:</p> <ul aria-labelledby="matches-label">${elementsStrs.join("")}</ul>`;
    helperTextEl.classList.add("open");

    const optionsEl = helperTextEl.querySelector("ul");
    optionsEl.addEventListener('click', e => {
        const userInput = e.target.innerText;
        cityInputEl.value = userInput;
        getWeather(userInput).then(response => {
            response.json().then(data => {
                renderWeather(data);
            })
        })
        helperTextEl.classList.remove("open");
    })
}

const getWeather = async userInput => {
    response = await fetch(`/${userInput}/`);
    return response;
}

let helperTextEl = document.createElement("div");
helperTextEl.classList.add("drawer");
inputContainer.appendChild(helperTextEl)
cityInputEl.addEventListener("input", e => {
    clearTimeout(cityInputTimer);

    cityName = e.target.value;

    if (cityName) {
        cityInputTimer = setTimeout(() => {
            checkCityName(cityName).then(result => {
                if (Array.isArray(result)) {
                    renderSuggestions(result)
                } else {
                    helperTextEl.classList.remove("open");
                }
            })
        }, 1000)
    } else {
        helperTextEl.classList.remove("open");
    }
})

const getWeatherEventHandler = async (e) => {
    e.preventDefault();

    userInput = cityInputEl.value;
    response = await fetch(`/${userInput}/`);
    const data = await response.json();

    if (response.status === 400) {
        if (data['suggestions']) {
            renderSuggestions(data['suggestions']);
        } else {
            // No suggestions, city does not exist.
            // Render error message
            helperTextEl.innerHTML = '<p class="error-message">Unable to find weather for the provided city.</p>'
            helperTextEl.classList.add("open")
        }
    } else if (response.status === 200) {
        renderWeather(data);
    }
}

searchButton.addEventListener("click", getWeatherEventHandler);
cityInputEl.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        getWeatherEventHandler(e);
    }
})