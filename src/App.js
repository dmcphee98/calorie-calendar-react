import React from 'react';
import { useState, useEffect } from 'react';
import BMICalculator from './Components/BMICalculator/BMICalculator';
import './App.css';
import TDEECalculator from './Components/TDEECalculator/TDEECalculator';
import WeightProjector from './Components/WeightProjector/WeightProjector';
import StatsCalculator from './Components/StatsCalculator/StatsCalculator';
import GraphPage from './Components/GraphPage/GraphPage';
import Navbar from './Components/Common/Navbar/NavBar';

function App() {

  const [isMetricSystem, setMetricSystem] = useState(true);
  const [healthData, setHealthData] = useState({
    'isMale': true,
    'age': '',
    'height': '',
    'initialWeight': '',
    'bmi': '',
    'bmr': '',
    'activityLvl': 3,
    'tdee': '',
  });
  const [goalData, setGoalData] = useState({
    'goalWeight': '',
    'startDate': '',
    'finishDate': '',
    'dailyCals': '',
    'totalDays': ''
  });
  const [projectionData, setProjectionData] = useState('');
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
            healthData={healthData}
            setHealthData={setHealthData}
            isMetricSystem={isMetricSystem}
            setMetricSystem={setMetricSystem}/>
          <TDEECalculator
            healthData={healthData}
            setHealthData={setHealthData}/>
          <WeightProjector
            healthData={healthData}
            goalData={goalData}
            setGoalData={setGoalData}
            projectionData={projectionData}
            setProjectionData={setProjectionData}/>
          <StatsCalculator
            healthData={healthData}
            goalData={goalData}
            projectionData={projectionData}
            stats={stats}
            setStats={setStats}/>
          <GraphPage 
            projectionData={projectionData}/>
        </div>
      </div>
    </div>
  );
}

export default App;