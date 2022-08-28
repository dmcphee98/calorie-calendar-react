import React from 'react'
import { useState, useEffect } from 'react';

import NextButton from '../Common/NextButton/NextButton';
import TraitsForm from './TraitsForm/TraitsForm'
import './BMICalculator.css';

import treeImg from './tree.svg'


const BMICalculator = ({ traits, setTraits, isMetricSystem, setMetricSystem}) => {


  const [BMI, setBMI] = useState('');
  const [lockedBMI, setLockedBMI] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [healthColor, setHealthColor] = useState('#ffffff');
  const [isValidBMI, setValidBMI] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [mayProceed, setMayProceed] = useState(false);

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
      setMayProceed(true);
    } else {
      setValidBMI(false);
      setMayProceed(false);
    }
  }

  const goNextPage = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
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

  return (
    <div>
      <div className='landing-header'>
        <h1 className='landing-title'>Calorie Calendar</h1>
      </div>
      <div className='landing-body'>
        <div className='landing-left'/>
        <div className='landing-img-container'>
          <img className='landing-img' src={treeImg} alt="My Happy SVG"/>
        </div>
        <div className='landing-form-container'>
          <div className='landing-info-container'>
            <p className='landing-info'>
              <span>First, let's calculate your BMI.</span>
            </p>
          </div>
          <div className='landing-form'>
            <TraitsForm 
                setTraits={setTraits}
                callback={onformSubmission}
                isMetricSystem={isMetricSystem}
                setMetricSystem={setMetricSystem}/>
          </div>
            {isFormSubmitted && isValidBMI &&
              <div className='landing-output-valid'>
                <div className='landing-output-column'>
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
                <div className='landing-output-column'>
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
              <div className='landing-output-invalid'>
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
        <div className='landing-right'/>
      </div>
      <div className='landing-footer'>
        {mayProceed && <NextButton callback={goNextPage}/>}
      </div>
    </div>
  )
}

export default BMICalculator