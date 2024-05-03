import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/ScrollToTop'

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
    <ScrollToTop />
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);