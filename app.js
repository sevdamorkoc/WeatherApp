const form = document.querySelector("section.top-banner form")
const input = document.querySelector(".container input")
const msg = document.querySelector("span.msg")
const list = document.querySelector(".ajax-section ul.cities")

localStorage.setItem("tokenKey", "CArmDZWtBpZau6Pvph5Qeu4KaKikCqtiKonWNtHuEgQMeJ1+UCGmbckm1jHWrNoP")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeatherDataFormApi();
})

const getWeatherDataFormApi = async () => {
    const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));
    const inputValue = input.value;
    const units = "metric"
    const lang = "tr"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

    try {
        const response = await axios(url)
        console.log(response)
        const {
            main,
            sys,
            weather,
            name
        } = response.data;

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

        const cityNameSpans = list.querySelectorAll(".city span")
        const cityNameSpansArray = Array.from(cityNameSpans)
        if (cityNameSpansArray.length > 0) {
            const filteredArray = cityNameSpansArray.filter((span) => span.innerText == name);
            if (filteredArray.length > 0) {
                msg.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(() => {
                    msg.innerText = ""
                }, 5000)
                form.reset();
                return;
            }
        }

        const createdLi = document.createElement("li")
        createdLi.classList.add("city")
        createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${sys.country}">
                                      <span>${name}</span>
                                      <sup>${sys.country}</sup>
                                  </h2>
                                  <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                                  <figure>
                                      <img class="city-icon" src="${iconUrl}">
                                      <figcaption>${weather[0].description}</figcaption>
                                  </figure>`;
        list.prepend(createdLi)


        //  bubbling -- kartin i̇çi̇nde her hangi̇ bi̇r yere cli̇k yapildiğinda createdLi nin clik i çalıssın

        createdLi.addEventListener("click", (e)=> {
          alert("Sevdaaa") 
        })

    } catch (error) {
        console.log(error)
        msg.innerText = `404 (City Not Found)`
        setTimeout(() => {
            msg.innerText = ""
        }, 5000)
    }
    form.reset()
}