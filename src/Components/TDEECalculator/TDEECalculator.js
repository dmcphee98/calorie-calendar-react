import React from 'react'
import { useState, useEffect } from 'react';

import PrevButton from '../Common/PrevButton/PrevButton';
import NextButton from '../Common/NextButton/NextButton';
import ActivityForm from './ActivityForm/ActivityForm';
import './TDEECalculator.css';

import soccerImg from './soccer.svg'


const TDEECalculator = ({ traits, setTraits }) => {

  const [lockedTDEE, setLockedTDEE] = useState('');
  const [mayProceed, setMayProceed] = useState(false);

  useEffect(() => {
    // Update TDEE
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = traits.bmr * multipliers[traits.activityLvl-1];
    setTraits({...traits, 'tdee':tdee.toFixed(0)}); 
  }, [traits.activityLvl])

  const onFormSubmission = () => {
    setLockedTDEE(traits.tdee);
    setMayProceed(true);
  }
  
  const goPrevPage = () => {
    window.scrollBy({
      top: -window.innerHeight,
      behavior: 'smooth'
    });
  }

  const goNextPage = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
  
  return (
    <div>
      <div className='tdee-header'>
        <PrevButton callback={goPrevPage} fade={true}/>
      </div>

      <div className='tdee-body'>
        <div className='tdee-left'/>
        <div className='tdee-img-container'>
          <img className='tdee-img' src={soccerImg} alt="My Happy SVG"/>
        </div>
        <div className='tdee-form-container'>
          <div className='tdee-info-container'>
            <p className='tdee-info'>
              <span>Next, let's find your activity level.</span>
            </p>
          </div>
          <div className='tdee-form'>
            <ActivityForm 
              traits={traits}
              setTraits={setTraits}
              callback={onFormSubmission}/>
          </div>
          {mayProceed && 
            <div className='tdee-result-container'>
            <div>TDEE</div>
            <div className='tdee-result'>{lockedTDEE}</div>
            <div className='tdee-definition'>
              Your Total Daily Energy Expenditure (TDEE) is the average number of calories your body burns each day.
            </div>
          </div>
          }
          </div>
        <div className='tdee-right'/>
      </div>

      <div className='tdee-footer'>
        {mayProceed && <NextButton callback={goNextPage}/>}
      </div>
    </div>
  )
}

export default TDEECalculator