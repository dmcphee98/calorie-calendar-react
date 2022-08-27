import React from 'react';
import { useState, useEffect } from 'react';
import LandingPage from './Components/LandingPage/LandingPage';
import './App.css';

function App() {

  const [isMetricSystem, setMetricSystem] = useState(true);
  const [traits, setTraits] = useState({});

  return (
    <div className="App">
      <LandingPage 
        setTraits={setTraits}
        isMetricSystem={isMetricSystem}
        setMetricSystem={setMetricSystem}/>
    </div>
  );
}

export default App;

/*
    const traits = {
      gender: "male",
      age: 28,
      height: 186,               
      initialWeight: 90,         
      goalWeight: 70,            
      activityLevel: 1
    }
*/