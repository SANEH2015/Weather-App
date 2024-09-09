// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Set up SQLite database
const db = new sqlite3.Database(':memory:');

// Create table
db.serialize(() => {
  db.run("CREATE TABLE weather (id INTEGER PRIMARY KEY, city TEXT, temperature REAL, description TEXT)");
});

// API endpoint to get weather data
app.get('/weather', (req, res) => {
  db.all("SELECT * FROM weather", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// API endpoint to add weather data
app.post('/weather', (req, res) => {
  const { city, temperature, description } = req.body;
  const stmt = db.prepare("INSERT INTO weather (city, temperature, description) VALUES (?, ?, ?)");
  stmt.run(city, temperature, description, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});



const axios = require('axios');

async function fetchAndSaveWeather(city) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
    const { temp } = response.data.main;
    const { description } = response.data.weather[0];
    db.run("INSERT INTO weather (city, temperature, description) VALUES (?, ?, ?)", [city, temp, description]);
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
  }
}

fetchAndSaveWeather('London');

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
