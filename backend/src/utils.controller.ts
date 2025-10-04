import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface Country {
    name: { common: string };
    currencies: { [key: string]: { name: string; symbol: string } };
}

export const getCurrencies = async (req: Request, res: Response) => {
    try {
        const response = await fetch('[https://restcountries.com/v3.1/all?fields=name,currencies](https://restcountries.com/v3.1/all?fields=name,currencies)');
        const data = await response.json() as Country[];
        const currencies = data
            .filter(country => country.currencies)
            .map(country => {
                const currencyCode = Object.keys(country.currencies)[0];
                return {
                    code: currencyCode,
                    name: country.currencies[currencyCode].name,
                };
            })
            .filter((c, index, self) => self.findIndex(t => t.code === c.code) === index) // Unique
            .sort((a, b) => a.name.localeCompare(b.name));
        
        res.json(currencies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch currencies.' });
    }
};
