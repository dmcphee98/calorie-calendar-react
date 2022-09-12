import React from 'react';
import './DateInput.css';


const DateInput = ({ number, setNumber, description }) => {

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

  return (
    <div className='di-container'>
        <div className='di-desc'>{description}</div>
        <div className='di-input-div'>
          <input className="di-input" type='date' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
    </div>
  )
}

export default DateInput