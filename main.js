const api_key = 'd34ca682514df4d8def16d7294841de9'; // Ключ с сайта openweathermap.org из личного кабинета после ругистрации
const map_key = '8b947c34-afb2-44d8-b610-da8972b2976c'; 
const geocodeUrl = 'https://api.openweathermap.org/geo/1.0/direct'; // Адрес
const wetherUrl = 'https://api.openweathermap.org/data/2.5/weather'; // Адрес второй api, которая по коордлинатам показывает погоду

const sidebarNode = document.querySelector('.sidebar');
const inputNode = document.querySelector('#search-input');
const btnNode = document.querySelector('#search-btn');
const cityNameNode = document.querySelector('#city-name');
const cardNode = document.querySelector('.card');

let cityName = '';
let map = null; // Переменная для хранения объекта "Карта" от яндекса

ymaps.ready(() => { // Мы подключили скрипт яндекса в index.html в строке 34
    map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 9
    })
})

sidebarNode.addEventListener('click', (e) => {
    if(e.target.classList.contains('city-btn')) {// Нажали по картинке с городом
        const city = e.target.getAttribute('data-src');
        inputNode.value = city;
    }
})

btnNode.addEventListener('click', () => {
    const queryStr = `appid=${api_key}&q=${inputNode.value}`; // Строка запроса
    const url = geocodeUrl + '?' + queryStr; // Строка запроса
    fetch(url) // get-запрос
        .then((response) => { // подписываемся на ответ
            if(response.status == 200) {
                console.log(response)
                return response.json() // возвращаем новый promisse                
            }            
        }) 
        .then((data) => {
            console.log(data);
            cityName = data[0]['local_names'].ru; // Данные из Json (на сайте в режиме разработчика)
            cityNameNode.textContent = cityName;
            const lat = data[0].lat; // Координаты широты города
            const lon = data[0].lon; // Координаты долготы города
            const queryStr = `appid=${api_key}&lat=${lat}&lon=${lon}`;
            const url = wetherUrl + '?' + queryStr;
            map.setCenter([lat, lon])
            return fetch(url);
        })
        .then((response) => {
            if(response.status == 200){
                return response.json();
            }
        })
        .then((data) => {
            console.log(data);
            cardNode.textContent = '';
            // переменная для хранения html-кода для создания элемента
            const html = `<h2 class="temp">${Math.round(data.main.temp - 273)} &deg;C</h2>
            <p>Ощущается как: ${Math.round(data.main.feels_like - 273)} &deg;C</p>
            <p>Влажность: ${data.main.humidity}%</p>
            <p>Давление: ${data.main.pressure} Па</p>`;             
            cardNode.insertAdjacentHTML('afterbegin', html);            
        })
})