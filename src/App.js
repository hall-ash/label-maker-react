// import logo from './logo.svg';
import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import Navigation from './Navigation';
import useLocalStorage from './useLocalStorage';
import SettingsContext from './SettingsContext';
import _ from 'lodash';

const App = () => {

  const defaultSettings = {
    'hasBorder': false, 
    'fontSize': 12, 
    'padding': 1.75,
    'fileName': 'labels',
  };

  const [localStorageSettings, setLocalStorageSettings] = useLocalStorage('LabelSettings', defaultSettings);
  const [savedSettings, setSavedSettings] = useState(localStorageSettings);

  const handleBeforeUnload = (e) => {
    // check to see if savedSettings have changed
    console.log('savedSettings', savedSettings);
    if (! _.isEqual(localStorageSettings, savedSettings)) {
      setLocalStorageSettings(savedSettings); // Save the current settings before unload
    }

    e.preventDefault(); // Prevent the default unload action
    e.returnValue = ''; // Required for showing the confirmation dialog
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // No dependencies, runs once when the component mounts


  return (
    <SettingsContext.Provider value={{ savedSettings, setSavedSettings }}>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </SettingsContext.Provider>
  );
};

export default App;
