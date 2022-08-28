import React from 'react';
import { useState, useEffect } from 'react';
import BMICalculator from './Components/BMICalculator/BMICalculator';
import './App.css';
import TDEECalculator from './Components/TDEECalculator/TDEECalculator';

function App() {

  const [isMetricSystem, setMetricSystem] = useState(true);
  const [traits, setTraits] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden"
  }, [])

  return (
    <div className="App">
      <BMICalculator 
        traits={traits}
        setTraits={setTraits}
        isMetricSystem={isMetricSystem}
        setMetricSystem={setMetricSystem}/>
      <TDEECalculator
        traits={traits}
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