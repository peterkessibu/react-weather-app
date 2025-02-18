import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Box,
  Typography,
  CssBaseline,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/ForeastWeather";
import { WeatherData, ForecastData } from "./types";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface LocationOption {
  label: string;
}

const App = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [inputValue, setInputValue] = useState("");

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Fetch location suggestions when the input value changes
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (inputValue.length < 2) return;

      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=ab38d7731466c31227cd4701f7d9aa27`
        );

        const suggestions = response.data.map(
          (city: { name: string; country: string }) => ({
            label: `${city.name}, ${city.country}`,
          })
        );

        setOptions(suggestions);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    fetchLocationSuggestions();
  }, [inputValue]);

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
        setForecastData(forecastResponse.data);
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
          <Autocomplete
            data-testid="Autocomplete"
            freeSolo
            options={options}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onChange={(_, newValue) => {
              if (newValue) {
                setLocation(
                  typeof newValue === "string" ? newValue : newValue.label
                );
              }
            }}
            renderInput={(params) => (
              <TextField
                data-testid="TextField"
                {...params}
                fullWidth
                label="Search Location"
                variant="outlined"
                sx={{ mb: 4, maxWidth: 400 }}
              />
            )}
          />
          {weatherData && <CurrentWeather weatherData={weatherData} />}
          {forecastData && <Forecast forecastData={forecastData} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
