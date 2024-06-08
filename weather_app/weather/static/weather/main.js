const cityInputEl = document.getElementById("city");
const inputContainer = document.querySelector("form > div");

let cityInputTimer;
const checkCityName = async (cityName) => {
    response = await fetch(`/weather/check-city/${cityName}`);

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

let helperTextEl = document.createElement("div");
cityInputEl.addEventListener("input", e => {
    clearTimeout(cityInputTimer);

    cityName = e.target.value;

    if (cityName) {
        cityInputTimer = setTimeout(() => {
            checkCityName(cityName).then(result => {
                if (Array.isArray(result)) {
                    elementsStrs = result.map(suggestion => `<a>${suggestion}</a>`)
                    helperTextEl.innerHTML = `<p>Did you mean: ${elementsStrs.join(", ")}?</p>`
                    if (!helperTextEl.isConnected) {
                        inputContainer.insertAdjacentElement('afterend', helperTextEl)
                    }
                } else if (result) {
                    helperTextEl.remove();
                }
            })
        }, 1000)
    }
})