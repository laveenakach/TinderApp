import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000//api', // 👈 your local Laravel IP
  headers: {
    Accept: 'application/json',
  },
});

export default API;
