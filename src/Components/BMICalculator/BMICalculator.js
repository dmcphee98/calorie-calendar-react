import React from 'react'
import { useState, useEffect } from 'react';

import NextButton from '../Common/NextButton/NextButton';
import TraitsForm from './TraitsForm/TraitsForm'
import './BMICalculator.css';

import treeImg from './tree.svg'


const BMICalculator = ({ traits, setTraits, isMetricSystem, setMetricSystem}) => {

  const [BMI, setBMI] = useState('');
  const [BMR, setBMR] = useState('');
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
  const onFormSubmission = () => {
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
  
  // Add new locked BMI to traits, assign health status and colour to locked-in BMI value
  useEffect(() => {
    if (lockedBMI === '' || lockedBMI === undefined) return;

    calculateBMR();

    // Assign health status and colour to locked-in BMI value
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

    // Changing gender requires recalculation of BMR but not BMI
    useEffect(() => {
      const {initialWeight, height, age } = traits;
      if (initialWeight !== '' && height !== '' && age !== '') calculateBMR();
    }, [traits.isMale])

  const calculateBMR = () => {
    const { isMale, initialWeight, height, age } = traits;
    if (isMale) {
      setBMR((88.362 + (13.397 * initialWeight) + (479.9 * height) - (5.677 * age)).toFixed(0));
    } else {
      setBMR((447.593 + (9.247 * initialWeight) + (309.8 * height) - (4.330 * age)).toFixed(0));
    }
  }

  useEffect(() => {
    // Add updated BMI and BMR to traits
    setTraits({...traits, 'bmi':lockedBMI, 'bmr':BMR});
  }, [BMR])

  return (
    <div>
      <div className='bmi-header'>
        <h1 className='bmi-title'>Calorie Calendar</h1>
      </div>
      <div className='bmi-body'>
        <div className='bmi-left'/>
        <div className='bmi-img-container'>
          <img className='bmi-img' src={treeImg} alt="My Happy SVG"/>
        </div>
        <div className='bmi-form-container'>
          <div className='bmi-info-container'>
            <p className='bmi-info'>
              <span>First, let's calculate your BMI.</span>
            </p>
          </div>
          <div className='bmi-form'>
            <TraitsForm 
                traits={traits}
                setTraits={setTraits}
                callback={onFormSubmission}
                isMetricSystem={isMetricSystem}
                setMetricSystem={setMetricSystem}/>
          </div>
            {isFormSubmitted && isValidBMI &&
              <div className='bmi-output-valid'>
                <div className='bmi-output-column'>
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
                <div className='bmi-output-column'>
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
              <div className='bmi-output-invalid'>
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
        <div className='bmi-right'/>
      </div>
      <div className='bmi-footer'>
        {mayProceed && <NextButton callback={goNextPage}/>}
      </div>
    </div>
  )
}

export default BMICalculator