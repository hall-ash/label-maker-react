// import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CalculatePage from './CalculatePage';
import Navigation from './Navigation';

const App = () => {

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculate" element={<CalculatePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
