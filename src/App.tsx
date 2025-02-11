import axios from "axios";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null); 

  const searchLocation = async (event: any) => {
    // Added event parameter
    if (event.key === "Enter") {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setWeatherData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  return (
    <div className="App">
      <div className="search">
        <input
          type="text"
          placeholder="Search Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
        />
      </div>
      <h1>Weather App</h1>
      <div className="top">
        <div className="location">
          {weatherData ? weatherData.name : "Location"}
        </div>{" "}
        <div className="location">
          {weatherData ? weatherData.sys.country : "Country"}
        </div>{" "}
        {/* Display location */}
        <div className="temp">
          {weatherData ? weatherData.main.temp : "Temperature"}
        </div>{" "}
        {/* Display temperature */}
        <div className="clouds">
          {weatherData
            ? weatherData.weather[0].description
            : "Cloud Description"}
        </div>{" "}
        {/* Display cloud description */}
      </div>
      <div className="bottom">
        <div className="feels">
          <div>Feels Like</div>
          <span>
            {weatherData ? weatherData.main.feels_like : "Feels Like"}
          </span>{" "}
          {/* Display feels like temperature */}
        </div>
        <div className="humidity">
          <div>Humidity</div>
          <span>
            {weatherData ? weatherData.main.humidity : "Humidity"}%
          </span>{" "}
          {/* Display humidity */}
        </div>
        <div className="winds">
          <div>Winds</div>
          <div className="description">
            <div>{weatherData ? weatherData.wind.speed : "Wind Speed"} km/h</div>{" "}
            <div>
              {weatherData ? weatherData.wind.deg : "Wind direction"} deg
            </div>{" "}
          </div>
          {/* Display wind speed */}
        </div>
      </div>
    </div>
  );
}

export default App;
