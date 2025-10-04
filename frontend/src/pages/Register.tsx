import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Country {
  name: string;
  currencyCode: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    currency: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await api.get('/utils/countries');
        setCountries(res.data);
      } catch (err) {
        setError('Failed to load currency data. Please try again later.');
      }
    };
    fetchCountries();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Create Your Company Account</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          <input type="text" name="companyName" onChange={onChange} placeholder="Company Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select name="currency" onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select Company Currency</option>
            {countries.map(c => <option key={c.currencyCode} value={c.currencyCode}>{c.name} ({c.currencyCode})</option>)}
          </select>
          <div className="flex space-x-4">
            <input type="text" name="firstName" onChange={onChange} placeholder="Your First Name" required className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" name="lastName" onChange={onChange} placeholder="Your Last Name" required className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <input type="email" name="email" onChange={onChange} placeholder="Admin Email Address" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="password" name="password" onChange={onChange} placeholder="Password" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
