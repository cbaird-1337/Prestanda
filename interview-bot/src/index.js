import React from 'react';
import './index.css';
import './tailwind.output.css'; // Add this line to import the generated Tailwind CSS output
import App from './components/App'; // Updated the import to App
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import Account from './components/auth/Account'; // Add the Account import
import { BrowserRouter as Router } from 'react-router-dom'; // Add the Router import

ReactDOM.render(
  <React.StrictMode>
    <Account>
      <Router>
        <App />
      </Router>
    </Account>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
