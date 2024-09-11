import React, { useState, useEffect } from 'react'

import search_icon from "../src/assets/component/search.png"
import rain_icon from "../src/assets/component/raining.png"
import storm_icon from "../src/assets/component/storm.png"
import sunny_icon from "../src/assets/component/sun.png"

const Weather = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState({});

  const search = async (city) => {
    try {
      const url = `http://localhost:5000/weather?city=${city}`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {}
  }
  useEffect(() => {
    search(city)
  }, [city])

  const handleSearch = () => {
    search(city);
  }

  return (
    <div className='main' style={{
      alignSelf: 'center',
      padding: '40px',
      borderRadius: '10px',
      
    
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <input type='text' placeholder='Search' value={city} onChange={(e) => setCity(e.target.value)} style={{
          height: '50px',
          border: 'none',
          outline: 'none',
          borderRadius: '40px',
          paddingLeft: '25px',
          color: '#8BC34F',
          backgroundColor: '#64FFDA',
          fontSize: '13px'
        }} />
        <img src={search_icon} alt='' style={{
          width: '50px',
          padding: '15px',
          borderRadius: '50%',
          background: '#64FFDA',
          cursor: 'pointer'
        }} onClick={handleSearch} />
      </div>
      <img src={sunny_icon} alt='' style={{
        width: '150px',
        margin: '30px'
      }} />
      <p style={{
        color: '#fff',
        fontSize: '80px',
        lineHeight: '1'
      }}>{weatherData.main ? `${weatherData.main.temp}°c` : '16°c'}</p>
      <p style={{
        color: '#fff',
        fontSize: '40px'
      }}>{weatherData.name ? weatherData.name : 'London'}</p>
      <div style={{
        width: '100%',
        marginTop: '40px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '22px'
        }}>
          <img src={storm_icon} alt='' style={{
            width: '26px',
            marginTop: '10px'
          }} />
          <div>
            <p>{weatherData.main ? `${weatherData.main.humidity} %` : '91 %'}</p>
            <span style={{
              display: 'block',
              fontSize: '16px'
            }}>Humidity</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '22px'
        }}>
          <img src={rain_icon} alt='' style={{
            width: '26px',
            marginTop: '10px'
          }} />
          <div>
            <p>{weatherData.wind ? `${weatherData.wind.speed} Km/h` : '3.6 Km/h'}</p>
            <span style={{
              display: 'block',
              fontSize: '16px'
            }}>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather