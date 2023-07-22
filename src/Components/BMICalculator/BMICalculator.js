import React from 'react'
import { useState, useEffect } from 'react';

import NavButton from '../Common/NavButton/NavButton';
import BMRForm from './BMRForm/BMRForm'
import treeImg from './tree.svg'
import './BMICalculator.css';

const BMICalculator = ({ healthData, setHealthData, useMetricSystem, setMetricSystem, activePageIndex, setActivePageIndex}) => {

  const [BMR, setBMR] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [healthColor, setHealthColor] = useState('#ffffff');
  const [isValidBMI, setValidBMI] = useState(false);
  const [isFormComplete, setFormComplete] = useState(false);

  const [BMRData, setBMRData] = useState({
    'isMale': true,
    'age': '',
    'height': '',
    'initialWeight': '',
    'bmi': '',
    'bmr': '',
  });

  const canNavigateWithEnter = React.useRef(false);

  // Recalculate BMI as information is entered into form
  useEffect(() => {
    let weight = BMRData.initialWeight;
    let height = BMRData.height;
    let bmi;
    if (!!height && height > 0 && !!weight && weight > 0) {
      bmi = Number((weight / Math.pow(height, 2)).toFixed(1));
    } else {
      bmi = 0;
    }

    if (typeof(bmi) === 'number' && bmi > 0 && bmi < 100) {
      setValidBMI(true);
      setBMRData({...BMRData, 'bmi':bmi});
    } else {
      setValidBMI(false);
    }

  }, [BMRData.initialWeight, BMRData.height])
  
  // Add new locked BMI to traits, assign health status and colour to locked-in BMI value
  useEffect(() => {
    const bmi = BMRData.bmi;
    if (!!!bmi) return;

    calculateBMR();

    // Assign health status and colour to locked-in BMI value
    switch (true) {
      case (bmi < 18.5):
        setHealthStatus('underweight');          
        setHealthColor('#87b1d9');
        break;
      case (bmi >= 18.5 && bmi < 25):
        setHealthStatus('healthy');         
        setHealthColor('#3dd365'); 
        break;
      case (bmi >= 25 && bmi < 30):
        setHealthStatus('overweight');       
        setHealthColor('#eee133');    
        break;
      case (bmi >= 30):
        setHealthStatus('obese');      
        setHealthColor('#fd802e');     
        break;
  }
    }, [BMRData.bmi])

    // Changing gender requires recalculation of BMR but not BMI
    useEffect(() => {
      const {initialWeight, height, age } = BMRData;
      if (initialWeight !== '' && height !== '' && age !== '') calculateBMR();
    }, [BMRData.isMale, BMRData.age])

  const calculateBMR = () => {
    const { isMale, initialWeight, height, age } = BMRData;
    if (isMale) {
      setBMR((88.362 + (13.397 * initialWeight) + (479.9 * height) - (5.677 * age)).toFixed(0));
    } else {
      setBMR((447.593 + (9.247 * initialWeight) + (309.8 * height) - (4.330 * age)).toFixed(0));
    }
  }

  // Add updated BMI and BMR to traits
  useEffect(() => {
    setBMRData({...BMRData, 'bmr':BMR});
  }, [BMR])

  const submitBMRData = () => {
    console.log("SUCCESS: Submitted BMR data.")
    setHealthData({...healthData, ...BMRData});
  }

  return (
    <div style={{height: '18.8%', minHeight: '400px'}}>
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
          <div className={`bmi-form-${useMetricSystem ? 'metric' : 'imperial'}`}>
            <BMRForm 
                BMRData={BMRData}
                setBMRData={setBMRData}
                useMetricSystem={useMetricSystem}
                setMetricSystem={setMetricSystem}
                setFormComplete={setFormComplete}
                activePageIndex={activePageIndex}/>
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
                  >{BMRData.bmi}</div>
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
                      ?
                  </div>
                </div>
                <div className='bmi-output-column' style={{height: '100%'}}>
                  <div style={{margin: '0.5rem 0rem'}}>Category</div>
                  <div 
                    className='inline-bold ' 
                    style={{
                      borderBottom: `3px solid gray`,
                      marginLeft: '0.2rem',
                    }}>
                      ?
                  </div>
                </div>
              </div>
            }
          </div>
      </div>
      <div className='page-spacer'>
        <NavButton 
          pageIndex={1} 
          enabled={isFormComplete && isValidBMI}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          callbackNext={submitBMRData}/>
      </div>
    </div>
  )
}

export default BMICalculator