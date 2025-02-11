import axios from "axios";
import { useState } from "react";

// Define types for weather data
interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
}

// Define types for forecast data
interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

interface ForecastData {
  list: ForecastItem[];
}

interface DailyForecast {
  date: string;
  temps: number[];
  descriptions: string[];
}

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const searchLocation = async (event: any) => {
    if (event.key === "Enter") {
      try {
        // Current weather
        const currentWeatherResponse = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setWeatherData(currentWeatherResponse.data);

        // 5-day forecast
        const forecastResponse = await axios.get<ForecastData>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setForecastData(forecastResponse.data);
        console.log(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  // Function to process forecast data to get daily forecasts
  const getDailyForecasts = (): DailyForecast[] => {
    if (!forecastData || !forecastData.list) return [];

    const dailyForecasts: { [date: string]: DailyForecast } = {};

    forecastData.list.forEach((forecast: ForecastItem) => {
      const date = forecast.dt_txt.split(" ")[0]; // Extract date
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temps: [],
          descriptions: [],
        };
      }
      dailyForecasts[date].temps.push(forecast.main.temp);
      dailyForecasts[date].descriptions.push(forecast.weather[0].description);
    });

    // Convert the object to an array
    return Object.values(dailyForecasts);
  };

  const dailyForecasts = getDailyForecasts();

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
          Location: {weatherData ? weatherData.name : "Location"}
        </div>
        <div className="location">
          Country: {weatherData ? weatherData.sys.country : "Country"}
        </div>
        <div className="temp">
          Temperature: {weatherData ? weatherData.main.temp : "Temperature"}
        </div>
        <div className="clouds">
          {weatherData
            ? weatherData.weather[0].description
            : "Cloud Description"}
        </div>
      </div>
      <div className="bottom">
        <div className="feels">
          <div>Feels Like</div>
          <span>
            {weatherData ? weatherData.main.feels_like : "Feels Like"} deg
          </span>
        </div>
        <div className="humidity">
          <div>Humidity</div>
          <span>{weatherData ? weatherData.main.humidity : "Humidity"}%</span>
        </div>
        <div className="winds">
          <div>Winds</div>
          <div className="description">
            <div>
              {weatherData ? weatherData.wind.speed : "Wind Speed"} km/h
            </div>
            <div>
              {weatherData ? weatherData.wind.deg : "Wind direction"} deg
            </div>
          </div>
        </div>
      </div>

      {/* Display forecast data */}
      <div className="forecast">
        <h2>5-Day Forecast</h2>
        {dailyForecasts.map((day: DailyForecast) => (
          <div key={day.date} className="forecast-item">
            <h3>{day.date}</h3>
            <div>
              Temperature: {Math.min(...day.temps)} - {Math.max(...day.temps)}
            </div>
            <div>Description: {day.descriptions[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
