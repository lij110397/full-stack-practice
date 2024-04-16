import { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country, showSingleCountry }) => {
  return (
    <div>
      <span>{country.name}</span>
      <button onClick={() => showSingleCountry(country)}>show</button>
    </div>
  );
};

const SingleCountry = ({ country, setCountries, countries }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={country.languages[key]}>{country.languages[key]}</li>
        ))}
      </ul>
      <p>{country.flag}</p>
      {/* <img src={countries[0].flag} alt={countries[0].name} /> */}
      <Weather
        country={country}
        setCountries={setCountries}
        countries={countries}
      />
    </div>
  );
};

const Filter = ({ filterName, setCountries, handleFilterChange }) => {
  useEffect(() => {
    if (filterName === "") {
      // Update content if filterName is empty
      setCountries([]);
    } else {
      // Fetch data from API
      axios
        .get(`https://restcountries.com/v3.1/name/${filterName}`)
        .then((response) => {
          console.log("promise fullfilled");
          const countryDetail = response.data.map((one) => ({
            name: one.name.common,
            languages: one.languages,
            capital: one.capital,
            area: one.area,
            flag: one.flag,
            lat: one.latlng[0],
            lon: one.latlng[1],
          }));
          setCountries(countryDetail);
        })
        .catch((error) => {
          console.log(error.message);
          setCountries([]);
        });
    }
  }, [filterName, setCountries]);

  return (
    <p>
      find countries <input value={filterName} onChange={handleFilterChange} />
    </p>
  );
};

const Countries = ({ countries, showSingleCountry, setCountries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length === 0) {
    return <p>Search for country now</p>;
  } else if (countries.length === 1) {
    return (
      <SingleCountry
        country={countries[0]}
        setCountries={setCountries}
        countries={countries}
      />
    );
  } else {
    return (
      <div>
        {countries.map((country) => (
          <Country
            key={country.name}
            country={country}
            showSingleCountry={showSingleCountry}
          />
        ))}
      </div>
    );
  }
};

const Weather = ({ country, setCountries, countries }) => {
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.lat}&lon=${country.lon}&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => {
        const weatherDetail = {
          temperature: response.data.main.temp,
          weatherIcon: response.data.weather[0].icon,
          windSpeed: response.data.wind.speed,
        };

        const updatedCountry = {
          ...country,
          weather: weatherDetail,
        };
        console.log("updatedCountry in weather ", updatedCountry);
        setCountries([updatedCountry]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [country, setCountries]);

  return (
    <div>
      <h2>Weather in {country.name}</h2>
      {countries.length > 0 && countries[0].weather && (
        <>
          <p>Temperature is {countries[0].weather.temperature} Celsius</p>
          <img src={countries[0].weather.weatherIcon} alt={countries[0].name}/>
          <p>Wind {countries[0].weather.windSpeed} m/s</p>
        </>
      )}
    </div>
  );
};


const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterName, setFilterName] = useState("");
  //const [country, setCountry] = useState({})

  const showSingleCountry = (country) => {
    console.log("click country ", country.name);
    //setCountry(country)
    setCountries([country]);
  };

  return (
    <div>
      <Filter
        filterName={filterName}
        setCountries={setCountries}
        countries={countries}
        handleFilterChange={(event)=>setFilterName(event.target.value)}
      />
      <Countries
        countries={countries}
        showSingleCountry={showSingleCountry}
        setCountries={setCountries}
      />
    </div>
  );
};

export default App;
