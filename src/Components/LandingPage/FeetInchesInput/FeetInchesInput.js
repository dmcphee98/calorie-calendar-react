import React from 'react';
import './FeetInchesInput.css';


const FeetInchesInput = ({ number, setNumber, description }) => {

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

  return (
    <div className='fii-container'>
        <div className='fii-desc'>{description}</div>
        <div className='fii-stacked-inputs'>
            <input type='number' className='fii-input fii-top' value={number} onChange={(e) => handleChange(e)}></input>
            <input type='number' className='fii-input fii-bot' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
        <div className='fii-stacked-units'>
            <div className='fii-unit fii-top'>{'( ft )'}</div>
            <div className='fii-unit fii-bot'>{'( in )'}</div>
        </div>
    </div>
  )
}

export default FeetInchesInput