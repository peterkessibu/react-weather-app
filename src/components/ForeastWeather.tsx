import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ForecastData, DailyForecast } from "../types";

interface ForecastProps {
  location: string;
}

export const Forecast = ({ location }: ForecastProps) => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const response = await axios.get<ForecastData>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=ab38d7731466c31227cd4701f7d9aa27`
        );
        setForecastData(response.data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [location]);

  // If forecast data is not loaded yet, display a loading message
  if (!forecastData) {
    return <Typography variant="body1">Forecast data is loading...</Typography>;
  }

  const getDailyForecasts = (): DailyForecast[] => {
    const dailyForecasts: { [date: string]: DailyForecast } = {};

    forecastData.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(" ")[0];
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

    return Object.values(dailyForecasts);
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <Card>
      <CardContent>
        <Typography data-testid="Forecast" variant="h5" gutterBottom>
          5-Day Forecast
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {dailyForecasts.map((day) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={2.4}
              key={day.date}
              data-testid="forecast-card"
            >
              <Card variant="outlined" sx={{ border: 1, borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" data-testid="forecast-day">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </Typography>
                  <Typography variant="h6" data-testid="forecast-date">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body1">
                    <Typography variant="body1" data-testid="forecast-min-temp">
                      Min Temperature: {Math.round(Math.min(...day.temps))}°C
                    </Typography>
                    <Typography variant="body1" data-testid="forecast-max-temp">
                      Max Temperature: {Math.round(Math.max(...day.temps))}°C
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    data-testid="forecast-description"
                    sx={{ mt: 2, fontStyle: "italic" }}
                  >
                    {day.descriptions[0]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
