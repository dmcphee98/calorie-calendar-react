import React from 'react'
import { useState, useEffect } from 'react';

import NavButton from '../Common/NavButton/NavButton';
import ActivityForm from './ActivityForm/ActivityForm';
import './TDEECalculator.css';
import { Tooltip } from 'react-tooltip'
import soccerImg from './soccer.svg'

const TDEECalculator = ({ healthData, setHealthData, activePageIndex, setActivePageIndex }) => {

  const [TDEEData, setTDEEData] = useState({
    'activityLvl': 3,
    'tdee': '',
  });

  useEffect(() => {
    const bmr = healthData.bmr;
    const activityLvl = TDEEData.activityLvl;
    // Update TDEE
    if (bmr !== '' && activityLvl !== '') {
      const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
      const tdee = bmr * multipliers[activityLvl-1];
      setTDEEData({...TDEEData, 'tdee':tdee.toFixed(0)}); 
      console.log('Updated TDEE data.')
    }
  }, [TDEEData.activityLvl, healthData.bmr])

  const submitTDEEData = () => {
    console.log("SUCCESS: Submitted TDEE data.")
    setHealthData({...healthData, ...TDEEData}); 
  }
    
  return (
    <div style={{height: '18%'}}>
      <div className='page-container'>
        <div className='img-container'>
          <img className='tdee-img' src={soccerImg} alt="My Happy SVG"/>
        </div>
        <div className='form-container tdee-form-container'>
          <div className='tdee-info-container'>
            <p className='tdee-info'>
              <span>Next, let's determine your activity level.</span>
            </p>
          </div>
          <div className='tdee-form'>
            <ActivityForm 
              TDEEData={TDEEData}
              setTDEEData={setTDEEData}
              pageIndex={2}
              activePageIndex={activePageIndex}
            />
          </div>
          <div className='tdee-result-container'>
            <div className='title' style={{position: 'relative'}}>
              TDEE 
              <i className='tooltip-anchor fa-solid fa-circle-question' style={{position: 'absolute', top: '55%', left: '110%', transform: 'translate(0%, -50%)'}}/>
            </div>
            <Tooltip className='tooltip' anchorSelect='.tooltip-anchor' place='right'>
              Total Daily Energy Expenditure<br/>
              <span style={{color: 'rgb(150, 150, 150)'}}><i>The total number of calories your <br/> body burns each day, on average.</i></span>
            </Tooltip>
            <div className='result'>{TDEEData.tdee}</div>
          </div>
        </div>
      </div>
      <div className='page-spacer'>
        <NavButton 
          pageIndex={2} 
          enabled={true}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          callbackNext={submitTDEEData}/>
      </div>
    </div>
  )
}

export default TDEECalculator