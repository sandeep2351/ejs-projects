const express = require('express');
const path = require('path');
const cors = require('cors'); // npm install cors

const app = express();
const port = 3000;

const apiKey = '505bd77e23e802f35f9c8c73f73a027f';

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for all routes

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('weather');
});

app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response not ok');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
