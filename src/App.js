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
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [useMetricSystem, setMetricSystem] = useState(true);
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

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  )

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0)
  }, []);

  // Keeps an up-to-date record of whether the display is mobile or desktop
  useEffect(() => {
    window
    .matchMedia("(max-width: 768px)")
    .addEventListener('change', e => setIsMobile( e.matches ));
    return () => {
      window
      .matchMedia("(max-width: 768px)")
      .removeEventListener('change', e => setIsMobile( e.matches ));
    }
  }, []);

  return (
    <div className="App">
      <Navbar 
        activePageIndex={activePageIndex}/>
      <div className='body'>
        <div className={`pages-container page-index-${activePageIndex}`}>
          <div className='first page-spacer'/>
          <BMICalculator 
            healthData={healthData}
            setHealthData={setHealthData}
            useMetricSystem={useMetricSystem}
            setMetricSystem={setMetricSystem}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}/>
          <TDEECalculator
            healthData={healthData}
            setHealthData={setHealthData}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}/>
          <WeightProjector
            healthData={healthData}
            goalData={goalData}
            setGoalData={setGoalData}
            useMetricSystem={useMetricSystem}
            setProjectionData={setProjectionData}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}/>
          <StatsCalculator
            healthData={healthData}
            goalData={goalData}
            projectionData={projectionData}
            stats={stats}
            setStats={setStats}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            useMetricSystem={useMetricSystem}/>
          <GraphPage 
            projectionData={projectionData}
            useMetricSystem={useMetricSystem}
            activePageIndex={activePageIndex}
            isMobile={isMobile}/>
        </div>
      </div>
    </div>
  );
}

export default App;