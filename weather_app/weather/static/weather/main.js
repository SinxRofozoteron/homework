const cityInputEl = document.getElementById("city");

let cityInputTimer;
cityInputEl.addEventListener("input", e => {
    clearTimeout(cityInputTimer);
    cityInputTimer = setTimeout(() => {
        console.log(e.target.value)
    }, 1000)
})