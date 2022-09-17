import React from 'react';
import { useState, useEffect } from 'react';
import './DateInput.css';

const DateInput = ({ number, setNumber, description, isEnabled, callback }) => {

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

  return (
    <div 
      className={`di-container ${isEnabled === undefined ? 'di-active' : (isEnabled ? 'di-active' : 'di-inactive')}`} 
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='di-desc'>{description}</div>
      <div className='di-input-div'>
        <input className="di-input" type='date' value={number} onChange={(e) => handleChange(e)}></input>
      </div>
    </div>
  )
}

export default DateInput