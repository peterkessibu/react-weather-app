import { useState } from "react";
import { Container, TextField, Box, Typography } from "@mui/material";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/ForeastWeather";
import { WeatherData, ForecastData } from "./types";
import axios from "axios";

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const searchLocation = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        const currentWeatherResponse = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setWeatherData(currentWeatherResponse.data);

        const forecastResponse = await axios.get<ForecastData>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setForecastData(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Weather App
        </Typography>
        <TextField
          fullWidth
          label="Search Location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={searchLocation}
          sx={{ mb: 4, maxWidth: 400 }}
        />
        {weatherData && <CurrentWeather weatherData={weatherData} />}
        {forecastData && <Forecast forecastData={forecastData} />}
      </Box>
    </Container>
  );
};

export default App;
