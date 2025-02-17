import { useState, Suspense } from "react";
import { Container, TextField, Box, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/ForeastWeather";
import { WeatherData, ForecastData } from "./types";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface LocationOption {
  label: string;
}

const App = () => {
  const [, setLocation] = useState("");
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [inputValue, setInputValue] = useState("");

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) return;

    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=ab38d7731466c31227cd4701f7d9aa27`,
      );

      const suggestions = response.data.map(
        (city: { name: string; country: string }) => ({
          label: `${city.name}, ${city.country}`,
        }),
      );

      setOptions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const fetchWeatherData = async (searchLocation: string) => {
    try {
      const currentWeatherResponse = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`,
      );
      setWeatherData(currentWeatherResponse.data);

      const forecastResponse = await axios.get<ForecastData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchLocation}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`,
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

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
          <Autocomplete
            freeSolo
            options={options}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              fetchLocationSuggestions(newInputValue);
            }}
            onChange={(_, newValue) => {
              if (newValue) {
                const locationName =
                  typeof newValue === "string" ? newValue : newValue.label;
                setLocation(locationName);
                fetchWeatherData(locationName);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Search Location"
                variant="outlined"
                sx={{ mb: 4, maxWidth: 400 }}
              />
            )}
          />
          <Suspense fallback={<div>Loading...</div>}>
            {weatherData && <CurrentWeather weatherData={weatherData} />}
            {forecastData && <Forecast forecastData={forecastData} />}
          </Suspense>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
