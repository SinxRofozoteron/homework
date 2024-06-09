const cityInputEl = document.getElementById("city");
const inputContainer = document.querySelector("form > div");
const searchButton = document.querySelector("button");

let cityInputTimer;
const checkCityName = async userInput => {
    response = await fetch(`/weather/check-city/${userInput}`);

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

const renderSuggestions = suggestions => {
    elementsStrs = suggestions.map(suggestion => {
        [city, country] = suggestion
        return `<li>${city}, ${country}</li>`
    })
    helperTextEl.innerHTML = `<p>Possible matches:</p> <ul>${elementsStrs.join("")}</ul>`
    if (!helperTextEl.isConnected) {
        inputContainer.insertAdjacentElement('afterend', helperTextEl)
    }

    const optionsEl = helperTextEl.querySelector("ul");
    optionsEl.addEventListener('click', e => {
        const userInput = e.target.innerText;
        cityInputEl.value = userInput;
        getWeather(userInput)
        helperTextEl.remove()
    })
}

const getWeather = async userInput => {
    response = await fetch(`/weather/${userInput}`);
    return response;
}

let helperTextEl = document.createElement("div");
cityInputEl.addEventListener("input", e => {
    clearTimeout(cityInputTimer);

    cityName = e.target.value;

    if (cityName) {
        cityInputTimer = setTimeout(() => {
            checkCityName(cityName).then(result => {
                if (Array.isArray(result)) {
                    renderSuggestions(result)
                } else {
                    helperTextEl.remove();
                }
            })
        }, 1000)
    }
})

const getWeatherEventHandler = async (e) => {
    e.preventDefault();

    userInput = cityInputEl.value;
    response = await fetch(`/weather/${userInput}`);
    const data = await response.json();

    if (response.status === 400) {
        renderSuggestions(data['suggestions']);
    } else if (response.status === 200) {
        console.log(data)
    }
}

searchButton.addEventListener("click", getWeatherEventHandler);
cityInputEl.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        getWeatherEventHandler(e);
    }
})