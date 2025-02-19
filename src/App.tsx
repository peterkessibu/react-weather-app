import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  CssBaseline,
} from "@mui/material";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/ForeastWeather";
import { LocationSearch } from "./components/Autocomplete";
import { WeatherData, ForecastData } from "./types";
import { ThemeProvider, createTheme } from "@mui/material/styles";


const App = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Fetch weather data when a location is selected
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;
      try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
          axios.get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
          ),
          axios.get<ForecastData>(
            `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
          ),
        ]);

        setWeatherData(currentWeatherResponse.data);
        console.log(currentWeatherResponse.data);
        
        setForecastData(forecastResponse.data);
        console.log(forecastResponse.data);

      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [location]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography
            data-testid="Weather-app"
            variant="h3"
            component="h1"
            gutterBottom
          >
            Weather App
          </Typography>
          <LocationSearch onLocationSelect={(loc) => setLocation(loc)} />
          {weatherData && <CurrentWeather weatherData={weatherData} />}
          {forecastData && <Forecast forecastData={forecastData} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
