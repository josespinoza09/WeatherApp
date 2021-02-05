//Required Variables
var searchData
var searchDataForecast
var uvValue

//Dates 
var date = moment().format("MMM Do YY");


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

