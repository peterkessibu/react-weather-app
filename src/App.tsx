import { useState } from "react";
import { Container, Box, Typography, CssBaseline } from "@mui/material";
import { CurrentWeather } from "./components/CurrentWeather";
import { Forecast } from "./components/ForeastWeather";
import { LocationSearch } from "./components/Autocompletes";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const App = () => {
  const [location, setLocation] = useState<string | null>(null);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
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
          <LocationSearch
            onLocationSelect={(location) => setLocation(location)}
          />
          {location && (
            <>
              <CurrentWeather location={location} />
              <Forecast location={location} />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
