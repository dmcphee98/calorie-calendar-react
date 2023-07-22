import React from 'react'
import './BMRForm.css';
import { useState, useEffect } from 'react';
import BoolToggle from '../../Common/BoolToggle/BoolToggle';
import FeetInchesInput from '../FeetInchesInput/FeetInchesInput';
import NumInput from '../../Common/NumInput/NumInput';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';


const BMRForm = ({ BMRData, setBMRData, useMetricSystem, setMetricSystem, setFormComplete, activePageIndex }) => {

    const [isMale, setMale] = useState(true);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weightMetric, setWeightMetric] = useState('');
    const [weightImperial, setWeightImperial] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);

    const updateFormInfo = () => {
        // Obtain weight in correct unit system.
        let weight;
        if (useMetricSystem) {
            weight = weightMetric;
        } else {
            if (!!weightImperial) {
                weight = weightImperial * 0.4536;
            } else {
                weight = '';
            }
        }
        
        // Update health data
        let updatedBMRData = {
            ...BMRData,
            isMale: isMale,
            age: age,
            height: (height === '' ? '' : height / 100.0),
            initialWeight: weight
        };
        setBMRData(updatedBMRData);

        // Update whether or not the form is completely filled out
        setFormComplete(age !== '' && height !== '' && weight !== '');
        console.log("Updated BMR data.");
    }

    useEffect(() => {
        setFormComplete(false);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(updateFormInfo, 750));

    }, [isMale, age, height, weightMetric, weightImperial, useMetricSystem])

  return (
    <form className='bmr-form'>
        <BoolToggle 
            className="element-1"
            id="start-tab-point"
            boolValue={useMetricSystem} 
            setBoolValue={setMetricSystem} 
            defaultText="Metric" 
            alternateText="Imperial"
            activeColor="#ffffff"
            activeTextColor="#000000"
            index={1}
            pageIndex={1}
            activePageIndex={activePageIndex}
        />
        <BoolToggle 
            className='genderToggle'
            boolValue={isMale} 
            setBoolValue={setMale} 
            defaultText='Male' 
            alternateText='Female'
            activeColor='#ffffff'
            activeTextColor='#000000'
            index={2}
            pageIndex={1}
            activePageIndex={activePageIndex}
        />
        <NumInput 
        number={age} 
        setNumber={setAge}
        description='Age'
        units='yr'
        index={3}
        pageIndex={1}
        activePageIndex={activePageIndex}/>

        {/* This is how you have to do conditional rendering within the return() function */}
        {useMetricSystem && 
            <div>
                <NumInput 
                    number={height} 
                    setNumber={setHeight} 
                    description='&nbsp;Height' 
                    units='cm'  
                    index={4}
                    pageIndex={1}
                    activePageIndex={activePageIndex}
                />
                <NumInput 
                    number={weightMetric} 
                    setNumber={setWeightMetric} 
                    description='&nbsp;Weight'
                    units='kg'  
                    index={5}
                    pageIndex={1}
                    activePageIndex={activePageIndex}
                />
            </div>
        }
        {!useMetricSystem && 
            <div>
                <FeetInchesInput number={height} setOutput={setHeight} description='&nbsp;&nbsp;&nbsp;Height' index={4}/>
                <NumInput 
                    number={weightImperial} 
                    setNumber={setWeightImperial} 
                    description='&nbsp;&nbsp;Weight'
                    units='lb'  
                    index={5}
                    pageIndex={1}
                    activePageIndex={activePageIndex}
                />
            </div>
        }
    </form>
  )
}

export default BMRForm