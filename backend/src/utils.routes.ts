import { Router } from 'express';
import axios from 'axios';

const router = Router();

// GET /api/utils/countries
router.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('[https://restcountries.com/v3.1/all?fields=name,currencies](https://restcountries.com/v3.1/all?fields=name,currencies)');
    const countries = response.data
      .filter((country: any) => country.currencies && Object.keys(country.currencies).length > 0)
      .map((country: any) => {
        const currencyCode = Object.keys(country.currencies)[0];
        const currencyName = country.currencies[currencyCode].name;
        return {
          name: country.name.common,
          currencyCode,
          currencyName
        };
      })
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch country data.' });
  }
});

// GET /api/utils/exchange-rate?base=USD
router.get('/exchange-rate', async (req, res) => {
    const { base } = req.query;
    if (!base) {
        return res.status(400).json({ message: 'Base currency is required.'});
    }
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
        res.json(response.data.rates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch exchange rates.' });
    }
});

export default router;