import React from 'react'
import { useState, useEffect } from 'react';
import BoolToggle from '../../Common/BoolToggle/BoolToggle';
import FeetInchesInput from '../FeetInchesInput/FeetInchesInput';
import NumInput from '../../Common/NumInput/NumInput';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';


const TraitsForm = ({ traits, setTraits, callback, isMetricSystem, setMetricSystem }) => {

    const [_isMale, setMale] = useState(true);
    const [_age, setAge] = useState('');
    const [_height, setHeight] = useState('');
    const [_weightMetric, setWeightMetric] = useState('');
    const [_weightImperial, setWeightImperial] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        callback();
    }

    useEffect(() => {
        let _weight;
        if (isMetricSystem) {
            _weight = _weightMetric;
        } else {
            if (_weightImperial !== '' && _weightImperial !== undefined) {
                _weight = _weightImperial * 0.4536;
            } else {
                _weight = '';
            }
        }
        
        let updatedTraits = {
            ...traits,
            isMale: _isMale,
            age: _age,
            height: (_height === '' ? '' : _height / 100.0),
            initialWeight: _weight
        };

        setTraits(updatedTraits);
    }, [_isMale, _age, _height, _weightMetric, _weightImperial, isMetricSystem])

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
        <BoolToggle 
            className="unitSystemToggle"
            boolValue={isMetricSystem} 
            setBoolValue={setMetricSystem} 
            defaultText="Metric" 
            alternateText="Imperial"
            activeColor="#ffffff"
            activeTextColor="#000000"/>
        <BoolToggle 
            className='genderToggle'
            boolValue={_isMale} 
            setBoolValue={setMale} 
            defaultText='Male' 
            alternateText='Female'
            activeColor='#ffffff'
            activeTextColor='#000000'/>
        <NumInput number={_age} setNumber={setAge} units='yr' description='Age'/>

        {/* This is how you have to do conditional rendering within the return() function */}
        {isMetricSystem && 
            <div>
                <NumInput number={_height} setNumber={setHeight} units='cm' description='Height'/>
                <NumInput number={_weightMetric} setNumber={setWeightMetric} units='kg' description='Weight'/>
            </div>
        }
        {!isMetricSystem && 
            <div>
                <FeetInchesInput number={_height} setOutput={setHeight} description='Height'/>
                <NumInput number={_weightImperial} setNumber={setWeightImperial} units='lb' description='Weight'/>
            </div>
        }
        <SubmitButton />

    </form>
  )
}

export default TraitsForm