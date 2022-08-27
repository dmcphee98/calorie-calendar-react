import React from 'react'
import { useState, useEffect } from 'react';
import BoolToggle from '../../Common/BoolToggle/BoolToggle';
import FeetInchesInput from '../FeetInchesInput/FeetInchesInput';
import NumInput from '../../Common/NumInput/NumInput';


const TraitsForm = ({ setTraits, isMetricSystem, setMetricSystem }) => {

    const [_isMale, setMale] = useState('');
    const [_age, setAge] = useState('');
    const [_height, setHeight] = useState('');
    const [_initialWeight, setInitialWeight] = useState('');


    useEffect(() => {
        let updatedTraits = {
            isMale: _isMale,
            age: _age,
            height: _height,
            initialWeight: _initialWeight
        }
        setTraits(updatedTraits)
    }, [_isMale, _age, _height, _initialWeight])

  return (
    <form>
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
                <NumInput number={_initialWeight} setNumber={setInitialWeight} units='kg' description='Weight'/>
            </div>
        }
        {!isMetricSystem && 
            <div>
                <FeetInchesInput number={_height} setNumber={setHeight} description='Height'/>
                <NumInput number={_initialWeight} setNumber={setInitialWeight} units='lb' description='Weight'/>
            </div>
        }

    </form>
  )
}

export default TraitsForm