import React, { useState, useEffect } from 'react';
import search_icon from "./assets/component/search.png";  
import rain_icon from "./assets/component/raining.png";
import storm_icon from "./assets/component/storm.png";
import sunny_icon from "./assets/component/sun.png"; 

const Weather = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [units, setUnits] = useState('metric');
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedUnits = localStorage.getItem('units') || 'metric';
    const storedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    setTheme(storedTheme);
    setUnits(storedUnits);
    setSavedLocations(storedLocations);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(null, latitude, longitude);
        },
        () => {
          fetchWeatherData(city);
        }
      );
    } else {
      fetchWeatherData(city);
    }
  }, [city]);

  const fetchWeatherData = async (city = null, lat = null, lon = null) => {
    try {
      const url = lat && lon
        ? `http://localhost:5000/weather?lat=${lat}&lon=${lon}&units=${units}`
        : `http://localhost:5000/weather?city=${city}&units=${units}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setError('An error occurred while fetching weather data');
    }
  };

  const handleSearch = () => {
    fetchWeatherData(city);
  };

  const handleSaveLocation = () => {
    const updatedLocations = [...savedLocations, city];
    setSavedLocations(updatedLocations);
    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleUnitsToggle = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    localStorage.setItem('units', newUnits);
  };

  return (
    <div className={`main ${theme}`} style={{ alignSelf: 'center', padding: '40px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input type='text' placeholder='Search' value={city} onChange={(e) => setCity(e.target.value)} style={{ height: '50px', border: 'none', outline: 'none', borderRadius: '40px', paddingLeft: '25px', color: '#8BC34F', backgroundColor: '#64FFDA', fontSize: '13px' }} />
        <img src={search_icon} alt='' style={{ width: '50px', padding: '15px', borderRadius: '50%', background: '#64FFDA', cursor: 'pointer' }} onClick={handleSearch} />
      </div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <img src={sunny_icon} alt='' style={{ width: '150px', margin: '30px' }} />
          <p style={{ color: '#fff', fontSize: '80px', lineHeight: '1' }}>{weatherData.main ? `${weatherData.main.temp}°${units === 'metric' ? 'C' : 'F'}` : '16°C'}</p>
          <p style={{ color: '#fff', fontSize: '40px' }}>{weatherData.name ? weatherData.name : 'London'}</p>
          <div style={{ width: '100%', marginTop: '40px', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '22px' }}>
              <img src={storm_icon} alt='' style={{ width: '26px', marginTop: '10px' }} />
              <div>
                <p>{weatherData.main ? `${weatherData.main.humidity} %` : '91 %'}</p>
                <span style={{ display: 'block', fontSize: '16px' }}>Humidity</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '22px' }}>
              <img src={rain_icon} alt='' style={{ width: '26px', marginTop: '10px' }} />
              <div>
                <p>{weatherData.wind ? `${weatherData.wind.speed} Km/h` : '3.6 Km/h'}</p>
                <span style={{ display: 'block', fontSize: '16px' }}>Wind Speed</span>
              </div>
            </div>
          </div>
          <button onClick={handleSaveLocation}>Save Location</button>
          <button onClick={handleThemeToggle}>Toggle Theme</button>
          <button onClick={handleUnitsToggle}>Toggle Units</button>
        </>
      )}
    </div>
  );
};

export default Weather;
