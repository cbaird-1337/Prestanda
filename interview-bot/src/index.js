import React from 'react';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import "@mantine/core/lib/index.css";
import "./tailwind.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
