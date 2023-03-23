// Import required modules

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// Create an Express application

const app = express();

// Use body-parser middleware to handle URL encoded data

app.use(bodyParser.urlencoded({ extended: true }));

// Set up a GET route to serve the index.html file

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Set up a POST route to handle form submission and retrieve weather data

app.post("/", (req, res) => {

    // Extract the city name from the form data

    const query = req.body.cityName;
    // Set up the OpenWeatherMap API endpoint URL
    const apiKey = "4bc0ebbda71dac9c6106daed836bca64";
    const unit = "metric";
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    // Make a GET request to the OpenWeatherMap API

    https.get(weatherUrl, (weatherRes) => {

        // Log the response status code

        console.log(weatherRes.statusCode);

        // Set up a listener for data events and parse the returned JSON data
        weatherRes.on("data", (data) => {
            const weatherData = JSON.parse(data);

            // Extract the relevant weather data fields

            const temp = weatherData.main.feels_like
            const weatherDescription = weatherData.weather[0].description;
            const weathericon = weatherData.weather[0].icon;
            const urlIcon = "http://openweathermap.org/img/wn/" + weathericon + "@2x.png";

            // Send the weather data to the client's web page

            res.write("<h1>The weather is currently " + weatherDescription + "</h1>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
            res.write("<img src=" + urlIcon + ">");
            res.send();
        });
    })
})

// Start the server on port 3000

app.listen(3000, () => {
    console.log("This is port 3000");
});