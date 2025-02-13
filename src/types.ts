export interface WeatherData {
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

export interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

export interface ForecastData {
  list: ForecastItem[];
}

export interface DailyForecast {
  date: string;
  temps: number[];
  descriptions: string[];
}