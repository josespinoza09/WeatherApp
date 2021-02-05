//Required Variables
var searchData
var searchDataForecast
var uvValue

//Dates 
var date = moment().format("MMM Do YY");

//Loads saved cities
let savedCities = localStorage.savedCities ? JSON.parse(localStorage.savedCities) : [];
if (savedCities.length > 0) {
  for (let i = 0; i < savedCities.length; i++) {
    document.querySelector('#cityList').innerHTML += 
    `<li><button type="button" class="btn btn-light" onClick=getSearch('${savedCities[i]}')>${savedCities[i]}</li>`
  }
}
//get search and display
async function getSearch() {
  // Clears search before running
  document.querySelector('#currentWeather').innerHTML = "";
  document.querySelector('#forecast').innerHTML = "";
  //fetch search input
  var search = document.querySelector('#search').value
  search = search[0].toUpperCase() + search.substring(1);
  //Api request
  getApi(search)
  //check if city already exist in list
  let exist = false;
  for (let i = 0; i < savedCities.length; i++) {
    if (search === savedCities[i]) {
      exist = true;
      break;
    }
  }
  
  //adds cities to saved list 
  if (!exist) {
    savedCities.push(search)
    document.querySelector('#cityList').innerHTML += `
    <li><button type="button" class="btn btn-light" onClick=getApi('${search}')>${search}</li>`
    localStorage.savedCities = JSON.stringify(savedCities)
  }
}
async function getApi(city) {
  //Clears search before adding new cards
  document.querySelector('#currentWeather').innerHTML = "";
  document.querySelector('#forecast').innerHTML = "";
  //url's needed for the api's
  var searchUrl = ` http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a40946fd9d2010f2fa6e5550cbf15f24&units=metric`
  var searchForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a40946fd9d2010f2fa6e5550cbf15f24&units=metric`
  //fetch info from api
  searchData = await fetch(searchUrl).then(r => r.json())
  searchDataForecast = await fetch(searchForecast).then(r => r.json())
  var searchUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${searchData.coord.lat}&lon=${searchData.coord.lon}&appid=a40946fd9d2010f2fa6e5550cbf15f24`
  uvValue = await fetch(searchUv).then(r => r.json())
  displayData(searchData, searchDataForecast, uvValue)
}

function displayData(weatherInfo, weatherforecast, uv) {
  //checks uv conditions
  let color = ""
  if (uvValue.value <= 2) {
    color = "success"
  } else if (uvValue.value <= 7) {
    color = "warning"
  } else {
    color = "danger"
  }
  //Weather Icon
  var iconUrl = `http://openweathermap.org/img/w/${weatherInfo.weather.icon}.png`
  //Display cards
  document.querySelector('#currentWeather').innerHTML += `
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${weatherInfo.name} ${date} <img id='weatherIcon' src="http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png"> </h5>
              <p class="card-text">Temperature: ${weatherInfo.main.temp}°C</p>
              <p class="card-text">Humidity: ${weatherInfo.main.humidity}%</p>
              <p class="card-text">Wind Speed: ${weatherInfo.wind.speed}MPH</p>
              <p class="card-text" style="width:15% ; background-color:">UV Index: <button type="button" class="btn btn-${color}">${uv.value}</button></p>
            </div>
          </div>`
  document.querySelector('#forecast').innerHTML += `<div class="col"><h3>5-Day Forecast:</h3></div>`
  for (var i = 0; i < 5; i++) {
    date = moment().add(i + 1, 'days').format("MMM Do YY");
    document.querySelector('#forecast').innerHTML += `
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${date}</h5>
              <img id='weatherIcon' src="http://openweathermap.org/img/w/${weatherforecast.list[i].weather[0].icon}.png">
              <p class="card-text">Temp: ${weatherforecast.list[i].main.temp}°C</p>
              <p class="card-text">Humidity: ${weatherforecast.list[i].main.humidity}%</p>
            </div>
          </div>`
  }
}
