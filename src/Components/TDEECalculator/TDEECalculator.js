import React from 'react'
import { useState, useEffect } from 'react';

import PrevButton from '../Common/PrevButton/PrevButton';
import NextButton from '../Common/NextButton/NextButton';
import ActivityForm from './ActivityForm/ActivityForm';
import './TDEECalculator.css';

import soccerImg from './soccer.svg'


const TDEECalculator = ({ traits, setTraits, isMetricSystem, setMetricSystem}) => {


  const [BMI, setBMI] = useState('');
  const [lockedBMI, setLockedBMI] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [healthColor, setHealthColor] = useState('#ffffff');
  const [isValidBMI, setValidBMI] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  // Recalculate BMI as information is entered into form
  useEffect(() => {
    let weight = traits.initialWeight;
    let height = traits.height;
    if (height !== ''  && height !== undefined & weight !== '' && weight !== undefined) {
      if (height > 0 && weight > 0) {
        setBMI((weight / Math.pow(height, 2)).toFixed(1));
      } else {
        setBMI('');
      }
    } else {
      setBMI('');
    }
  }, [traits])

  // Update BMI display on press of 'submit' button
  const onformSubmission = () => {
    setFormSubmitted(true);
    if (BMI > 0 && BMI < 100) {
      setValidBMI(true);
      setLockedBMI(BMI);
    } else {
      setValidBMI(false);
    }
  }

  // Assign health status and colour to locked-in BMI value
  useEffect(() => {
    if (lockedBMI === '' || lockedBMI === undefined) return;
    switch (true) {
      case (lockedBMI < 18.5):
        setHealthStatus('underweight');          
        setHealthColor('#87b1d9');
        break;
      case (lockedBMI >= 18.5 && lockedBMI < 25):
        setHealthStatus('healthy');         
        setHealthColor('#3dd365'); 
        break;
      case (lockedBMI >= 25 && lockedBMI < 30):
        setHealthStatus('overweight');       
        setHealthColor('#eee133');    
        break;
      case (lockedBMI >= 30):
        setHealthStatus('obese');      
        setHealthColor('#fd802e');     
        break;
  }
    }, [lockedBMI])

  const goPrevPage = () => {
    window.scrollBy({
      top: -window.innerHeight,
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
              <span>Next, lets figure out your activity level.</span>
            </p>
          </div>
          <div className='tdee-form'>
            <ActivityForm 
                setTraits={setTraits}
                callback={onformSubmission}
                isMetricSystem={isMetricSystem}
                setMetricSystem={setMetricSystem}/>
          </div>
            {isFormSubmitted && isValidBMI &&
              <div className='tdee-output-valid'>
                <div className='tdee-output-column'>
                  <div style={{margin: '0.5rem 0rem'}}>BMI</div>
                  <div 
                    className='inline-bold' 
                    style={{
                      color: healthColor,
                      borderBottom: `3px solid ${healthColor}`,
                      marginRight: '0.2rem'
                      }}
                  >{lockedBMI}</div>
                </div>
                <div className='tdee-output-column'>
                <div style={{margin: '0.5rem 0rem'}}>Category</div>
                  <div 
                    className='inline-bold' 
                    style={{
                      color: healthColor,
                      borderBottom: `3px solid ${healthColor}`,
                      marginLeft: '0.2rem'
                    }}>
                      {healthStatus} </div>
                </div>
              </div>
            }
            {isFormSubmitted && !isValidBMI &&
              <div className='tdee-output-invalid'>
                  <div>Your BMI is </div>
                  <div 
                    className='inline-bold' 
                    style={{
                      fontWeight: 'bold', 
                      color: 'red',
                      borderBottom: `3px solid red`,
                    }}
                    >Invalid</div>
              </div>
            }

          </div>
        <div className='tdee-right'/>
      </div>
      <div className='tdee-result-container'></div>
      <div className='tdee-footer'>
        <NextButton fade={true}/>
      </div>
    </div>
  )
}

export default TDEECalculator