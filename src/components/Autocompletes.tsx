import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";

interface LocationOption {
  label: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<LocationOption[]>([]);

  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (inputValue.length < 2) return;
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=ab38d7731466c31227cd4701f7d9aa27`,
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
    fetchLocationSuggestions();
  }, [inputValue]);

  return (
    <Autocomplete
      data-testid="Autocomplete"
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={(_, newValue) => {
        if (newValue) {
          onLocationSelect(
            typeof newValue === "string" ? newValue : newValue.label,
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
  );
};
