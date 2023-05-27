import React from 'react';
import { useState, useEffect } from 'react';
import BMICalculator from './Components/BMICalculator/BMICalculator';
import './App.css';
import TDEECalculator from './Components/TDEECalculator/TDEECalculator';
import WeightProjector from './Components/WeightProjector/WeightProjector';
import ProjectionStats from './Components/ProjectionStats/ProjectionStats';
import Navbar from './Components/Common/Navbar/NavBar';
import NextButton from './Components/Common/NextButton/NextButton';

function App() {

  const [isMetricSystem, setMetricSystem] = useState(true);
  const [traits, setTraits] = useState({
    'isMale': true,
    'age': '',
    'height': '',
    'initialWeight': '',
    'goalWeight': '',
    'bmi': '',
    'bmr': '',
    'activityLvl': 3,
    'tdee': '',
    'startDate': '',
    'endDate': '',
    'dailyCals': ''
  });
  const [stats, setStats] = useState([{},{},{},{},{},{}]);

  useEffect(() => {
    //document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="App">
      <Navbar />
      {/*<div className='page-title-container'>
        <h1 className='page-title'>Calorie Calendar</h1>
      </div>*/}
      <div className='body'>
        <div className="pages-container">
          <div className='page-spacer'/>
          <div className="page-header"/>
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
          <WeightProjector
            traits={traits}
            setTraits={setTraits}
            isMetricSystem={isMetricSystem}
            setMetricSystem={setMetricSystem}
            setStats={setStats}/>
          <ProjectionStats
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}

export default App;