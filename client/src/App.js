import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import TourFeature from './features/Tours';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

function App() {
  const name = 'Nguyen Minh Tam';
  const role = 'Software Developer';

  const { enqueueSnackbar } = useSnackbar();
  const showNotistack = () => {
    enqueueSnackbar('Show noti successfully', { variant: 'success' });
  };

  return (
    <>
      <Header />

      <Button onClick={showNotistack}>Show notistack</Button>

      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Welcome to NodeJS tour</p>
                <Link className="App-link" to="/tours">
                  Explore this site
                </Link>
                <br />
                <p>My name is {name}</p>
                <p>I am a {role}</p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit my personal profile
                </a>
              </header>
            </div>
          }
        />
        <Route path="/tours/*" element={<TourFeature />} />
      </Routes>
    </>
  );
}

export default App;
