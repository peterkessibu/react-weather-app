import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ForecastData, DailyForecast } from "../types";

interface ForecastProps {
  forecastData: ForecastData;
}

export const Forecast = ({ forecastData }: ForecastProps) => {
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
        <Typography variant="h5" gutterBottom>
          5-Day Forecast
        </Typography>
        <Grid container spacing={2}>
          {dailyForecasts.map((day) => (
            <Grid item xs={12} sm={6} md={2.4} key={day.date}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </Typography>
                  <Typography variant="h6">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body1">
                    <Typography variant="body1">
                      Min Temperature: {Math.round(Math.min(...day.temps))}°C
                    </Typography>
                    <Typography variant="body1">
                      Max Temperature: {Math.round(Math.max(...day.temps))}°C
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
