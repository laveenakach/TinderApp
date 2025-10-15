import axios from 'axios';

const client = axios.create({
  baseURL: 'https://hyperglycemic-yuonne-deltaic.ngrok-free.dev/api', // ngrok URL
  timeout: 10000,
  headers: { Accept: 'application/json' },
  withCredentials: true // for Laravel Sanctum cookies
});

export default client;
