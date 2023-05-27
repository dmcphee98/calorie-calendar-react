import React from 'react'
import { useState, useEffect } from 'react';

import NextButton from '../Common/NextButton/NextButton';
import TraitsForm from './TraitsForm/TraitsForm'
import BouncingDotsLoader from '../Common/BouncingDotsLoader/BouncingDotsLoader';
import './BMICalculator.css';

import treeImg from './tree.svg'


const BMICalculator = ({ traits, setTraits, isMetricSystem, setMetricSystem}) => {

  const [BMR, setBMR] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [healthColor, setHealthColor] = useState('#ffffff');
  const [isValidBMI, setValidBMI] = useState(false);
  const [isFormComplete, setFormComplete] = useState(false);
  const [mayProceed, setMayProceed] = useState(false);

  // Recalculate BMI as information is entered into form
  useEffect(() => {
    let weight = traits.initialWeight;
    let height = traits.height;
    let BMI;
    if (!!height && height > 0 && !!weight && weight > 0) {
        BMI = Number((weight / Math.pow(height, 2)).toFixed(1));
    } else {
        BMI = 0;
    }

    if (typeof(BMI) === 'number' && BMI > 0 && BMI < 100) {
      setValidBMI(true);
      setTraits({...traits, 'bmi':BMI});
      setMayProceed(true);
    } else {
      setValidBMI(false);
      setMayProceed(false);
    }

  }, [traits.initialWeight, traits.height])
  
  // Add new locked BMI to traits, assign health status and colour to locked-in BMI value
  useEffect(() => {
    const BMI = traits.bmi;
    if (!!!BMI) return;

    calculateBMR();

    // Assign health status and colour to locked-in BMI value
    switch (true) {
      case (BMI < 18.5):
        setHealthStatus('underweight');          
        setHealthColor('#87b1d9');
        break;
      case (BMI >= 18.5 && BMI < 25):
        setHealthStatus('healthy');         
        setHealthColor('#3dd365'); 
        break;
      case (BMI >= 25 && BMI < 30):
        setHealthStatus('overweight');       
        setHealthColor('#eee133');    
        break;
      case (BMI >= 30):
        setHealthStatus('obese');      
        setHealthColor('#fd802e');     
        break;
  }
    }, [traits.bmi])

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
    setTraits({...traits, 'bmr':BMR});
  }, [BMR])

  return (
    <div>
      <div className='page-container'>
        <div className='img-container'>
          <img className='bmi-img' src={treeImg} alt="My Happy SVG"/>
        </div>
        <div className='form-container'>
          <div className='bmi-info-container'>
            <p className='bmi-info'>
              <span>First, let's calculate your BMI.</span>
            </p>
          </div>
          <div className={`bmi-form-${isMetricSystem ? 'metric' : 'imperial'}`}>
            <TraitsForm 
                traits={traits}
                setTraits={setTraits}
                isMetricSystem={isMetricSystem}
                setMetricSystem={setMetricSystem}
                setFormComplete={setFormComplete}/>
          </div>
            {isFormComplete && isValidBMI &&
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
                  >{traits.bmi}</div>
                </div>
                <div className='bmi-output-column'>
                <div style={{margin: '0.5rem 0rem'}}>Category</div>
                  <div 
                    className='inline-bold' 
                    style={{
                      color: healthColor,
                      borderBottom: `3px solid ${healthColor}`,
                      marginLeft: '0.2rem',
                    }}>
                      {healthStatus} </div>
                </div>
              </div>
            }
            {isFormComplete && !isValidBMI &&
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
            {!isFormComplete &&
              <div className='bmi-output-incomplete'>
                <div className='bmi-output-column' style={{height: '100%'}}>
                  <div style={{margin: '0.5rem 0rem'}}>BMI</div>
                  <div 
                    className='inline-bold' 
                    style={{
                      borderBottom: `3px solid gray`,
                      marginLeft: '0.2rem',
                    }}>
                      <BouncingDotsLoader />
                  </div>
                </div>
                <div className='bmi-output-column' style={{height: '100%'}}>
                  <div style={{margin: '0.5rem 0rem'}}>Category</div>
                  <div 
                    className='inline-bold' 
                    style={{
                      borderBottom: `3px solid gray`,
                      marginLeft: '0.2rem',
                    }}>
                      <BouncingDotsLoader />
                  </div>
                </div>
              </div>
            }


          </div>
      </div>
      <div className='page-spacer'>
        <NextButton direction="down" enabled={mayProceed}/>
      </div>
    </div>
  )
}

export default BMICalculator