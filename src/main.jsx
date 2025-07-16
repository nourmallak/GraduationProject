import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import router from './routes/Router';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App/>
);

