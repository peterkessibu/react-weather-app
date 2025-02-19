import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { WeatherData } from "../types";
import { ThermostatAuto, WaterDrop, Air } from "@mui/icons-material";

interface CurrentWeatherProps {
  location: string;
}

export const CurrentWeather = ({ location }: CurrentWeatherProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [location]);

  // If weather data is not loaded yet, display a loading message
  if (!weatherData) {
    return <Typography variant="body1">Current Weather data is loading...</Typography>;
  }

  return (
    <Card
      sx={{
        mb: 4,
        border: 2,
        borderRadius: 4,
        backgroundColor: "rgba(24, 7, 7, 0.12)",
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              data-testid={`current_weather-details-${weatherData.name} - ${weatherData.sys.country}`}
              gutterBottom
            >
              {weatherData.name}, {weatherData.sys.country}
            </Typography>
            <Typography
              data-testid="current_weather-temperature"
              variant="h2"
              gutterBottom
            >
              {Math.round(weatherData.main.temp)}°C
            </Typography>
            <Typography data-testid="current_weather-description" variant="h6">
              {weatherData.weather[0].description}
            </Typography>
          </Grid>
            <Grid item xs={12} md={6} container justifyContent="center" alignItems="center">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ThermostatAuto />
              <Typography data-testid="current_weather-temperature">
                Feels like: {Math.round(weatherData.main.feels_like)}°C
              </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WaterDrop />
              <Typography data-testid="current_weather-humidity">
                Humidity: {weatherData.main.humidity}%
              </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Air />
              <Typography data-testid="current_weather-wind">
                Wind: {weatherData.wind.speed} km/h, {weatherData.wind.deg}°
              </Typography>
              </Box>
            </Box>
            </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
