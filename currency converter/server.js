const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('public'));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Endpoint to render the home page
app.get('/', async (req, res) => {
  const apiKey = '29f06cd724f85d685270ee9e'; // Replace with your actual API key
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
    const currencies = response.data.supported_codes;
    res.render('index', { currencies, convertedAmount: null, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { error: 'Error fetching currencies', currencies: [], convertedAmount: null });
  }
});

// Endpoint to handle the conversion
app.post('/convert', async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;
  const apiKey = '29f06cd724f85d685270ee9e'; // Replace with your actual API key

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
    const rate = response.data.conversion_rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);

    const currencyResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
    const currencies = currencyResponse.data.supported_codes;

    res.render('index', { convertedAmount, fromCurrency, toCurrency, amount, currencies, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { error: 'Error fetching exchange rate', currencies: [], convertedAmount: null });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
