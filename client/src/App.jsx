import React from 'react';
import { Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { AllToursPage } from './features/Tours';

function App() {
  const name = 'Minh Tam';
  const role = 'Cloud Engineer';
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
                <br />
                Your name: {name}.<br />
                Role: {role}.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        }
      />
      <Route path="/tours" element={<AllToursPage />} />
    </Routes>
  );
}

export default App;
