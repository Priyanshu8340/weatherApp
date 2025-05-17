// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

const api_key = `7e6067ea0aa872491fddff71912d1541`;

document.getElementById("checkWeather").addEventListener('click',getWeather); 
document.getElementById("yourLocationWeather").addEventListener('click',getLocationWeather); 

async function getWeather() {
    try {
        let city = document.getElementById("city").value;
    
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
        // using city name
    
        // this is called string interpolation in template literal
        // Automatic replacing of variables with real values is called string interpolation.
        // you can substitute variables and expressions
    
        let weatherObject = await fetch(url);
        let weatherData = await weatherObject.json();
        
        console.log(weatherData);
        appendToDOM(weatherData);
        getTenDaysWeather(weatherData.coord.lat,weatherData.coord.lon);
    } catch (err) {
        console.log(err);
    }
}

async function getLocalWeather(lat,lon) {
    try{
        let path = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
        // using latitude and longitude
        
        let weatherObject = await fetch(path);
        let weatherData = await weatherObject.json();

        console.log(weatherData);
        appendToDOM(weatherData);
    } catch(err) {
        console.log(err);
    }
}

function appendToDOM(data) {
    //main data
    let city = document.getElementById("showCity");
    city.innerText = data.name;

    let temp = document.getElementById("temp");
    temp.innerText = (Number(data.main.temp) - 273.15).toPrecision(3) + "°C";

    let weatherType = document.getElementById("weatherType");
    weatherType.innerText = data.weather[0].main;

    //detail weather Data
    let feels_like = document.getElementById("feltTemp");
    feels_like.innerText = (Number(data.main.feels_like) - 273.15).toPrecision(4) + " °C";

    let humidity = document.getElementById("humidity");
    humidity.innerText = data.main.humidity+"%";

    let wind = document.getElementById("wind");
    wind.innerText = (Number(data.wind.speed)*3.6).toPrecision(4)+" km/h";

    let visibility = document.getElementById("visibility");
    visibility.innerText = Number(data.visibility)/1000 + " km";

    let max_temp = document.getElementById("maxTemp");
    max_temp.innerText = (Number(data.main.temp_max) - 273.15).toPrecision(4) + " °C";

    let min_temp = document.getElementById("minTemp");
    min_temp.innerText = (Number(data.main.temp_min) - 273.15).toPrecision(4) + " °C";
    
    // map data
    let iframe = document.getElementById("gmap_canvas");
    iframe.src = `https://maps.google.com/maps?q=${data.name}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(currPosition);

    function currPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        getLocalWeather(latitude,longitude);
        getTenDaysWeather(latitude,longitude);
    }
}

async function getTenDaysWeather(lat,lon) {
    let path = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
    console.log(path);

    let response = await fetch (path);
    let data = await response.json();

    appendForecast(data);
}

function appendForecast(data) {
    console.log(data);
    let container = document.getElementById("forecast");
    container.innerHTML = null;

    // console.log(data.daily);

    data.daily.forEach(function(elem) {
        let d = new Date(0);
        // epoc time/UNIX time = Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)
        // will break in 2038 due to a 32-bit int overflow error
        let date = new Date(d.setUTCSeconds(elem.dt));
        let todayDate = new Date();
        
        if(date.getDate() != todayDate.getDate()) {
            // console.log(date);
 
            let item = document.createElement("div");
            item.style.height = "160px";
            item.style.width = "120px";
            //item.style.border = "1px solid red";
            item.style.borderRadius = "15px";
            item.style.display = "flex";
            item.style.flexDirection = "column";
            item.style.alignItems = "center";
            item.style.justifyContent = "center";
            item.style.boxShadow = "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px";   
            item.className = "zoom";
            item.style.textAlign = "center";

            let dateDiv = document.createElement("div");
            dateDiv.style.height = "35%";
            dateDiv.style.width = "100%";
            //dateDiv.style.border = "1px solid blue";
            dateDiv.style.backgroundColor = "#5E82F4";
            dateDiv.style.borderTopLeftRadius = "15px";
            dateDiv.style.borderTopRightRadius = "15px";
            dateDiv.style.display = "flex";
            dateDiv.style.flexDirection = "column";
            dateDiv.style.alignItems = "center";
            dateDiv.style.justifyContent = "center";
            dateDiv.style.gap = "0px";
            
            
            let dt = document.createElement("p");
            dt.style.margin = "2px";
            dt.innerText = `${date.getDate()} ${getMonthInAlpha(date.getMonth())} ${date.getFullYear()}` ;

            let dayName = document.createElement("p");
            dayName.style.margin = "2px";
            dayName.innerText = `${getDayInAlpha(date.getDay())}`;

            dateDiv.append(dt,dayName);


            weatherDiv = document.createElement("div");
            weatherDiv.style.height = "65%";
            weatherDiv.style.width = "100%";
            //weatherDiv.style.border = "1px solid green";
            weatherDiv.style.borderBottomLeftRadius = "15px";
            weatherDiv.style.borderBottomRightRadius = "15px";
            weatherDiv.style.backgroundColor = "white";
            weatherDiv.style.color = "#5E82F4";
            weatherDiv.style.display = "flex";
            weatherDiv.style.flexDirection = "column";
            weatherDiv.style.alignItems = "center";
            weatherDiv.style.justifyContent = "center";
            weatherDiv.style.gap = "2px";
            

            let dayTemp = document.createElement("p");
            dayTemp.innerText = (Number(elem.temp.day) - 273.15).toPrecision(4) + " °C";
            dayTemp.style.margin = "2px";
            
            let nightTemp = document.createElement("p");
            nightTemp.innerText = (Number(elem.temp.night) - 273.15).toPrecision(4) + " °C";
            nightTemp.style.margin = "2px";
            
            let weatherType = document.createElement("p");
            weatherType.innerText = elem.weather[0].main;
            weatherType.style.margin = "2px";
            
            weatherDiv.append(dayTemp,nightTemp,weatherType);


            item.append(dateDiv,weatherDiv);
            
            container.append(item);
        }


    })
}

getLocationWeather();

function getDayInAlpha(num) {
    let day = {
        0 : "Sun", 
        1 : "Mon",
        2 : "Tue",
        3 : "Wed",
        4 : "Thurs",
        5 : "Fri",
        6 : "Sat"
    };
    return day[num];
}

function getMonthInAlpha(num) {
    let month = {
        0 : "Jan",
        1 : "Feb",
        2 : "Mar",
        3 : "Apr",
        4 : "May",
        5 : "June",
        6 : "July",
        7 : "Aug",
        8 : "Sept",
        9 : "Oct",
        10 : "Nov",
        11 : "Dec",
    };
    return month[num];
}

function getTime() {
    let date = new Date();
    // date is of type object

    // date
    console.log(`date : ${date.getDate()}`);

    // day
    console.log(`day : ${date.getDay()}`);
    /*
        0 - Sun 
        1 - Mon
        2 - Tue
        3 - Wed
        4 - Thurs
        5 - Fri
        6 - Sat 
    */

    // month
    console.log(`month : ${date.getMonth()}`);
    /*
        0 - Jan
        1 - Feb
        2 - Mar
        3 - Apr
        4 - May
        5 - June
        6 - July
        7 - Aug
        8 - Sept
        9 - Oct
        10 - Nov
        11 - Dec
    */

    // year
    console.log(`Year : ${date.getFullYear()}`);

    // hours
    console.log(`Hours : ${date.getHours()}`);

    // Minutes
    console.log(`Minutes : ${date.getMinutes()}`);

    // Seconds
    console.log(`Seconds : ${date.getSeconds()}`);

    // Milliseconds
    console.log(`Milliseconds : ${date.getMilliseconds()}`);

}

// async function getTimeAPI(lat,lon) {
//     let time_url = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;

//     // let time_data = await fetch(time_url);
    
//     let timeData = await fetch(time_url);
//     console.log(timeData);
    
//     let time = timeData.json();
//     console.log(time); 

// }