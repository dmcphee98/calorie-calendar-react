import React from 'react';
import { useState, useEffect } from 'react';
import './DateInput.css';

const DateInput = ({ number, setNumber, min, max, isEnabled, description, callback, index, pageIndex, activePageIndex }) => {

    const handleChange = (e) => {
        setNumber(new Date(e.target.value));
    }

    const isValidDate = (date) => {
      return date instanceof Date && !isNaN(date);
    }

    const formatToString = (date) => {
      if (!!!date) return date;
      const options = { day: '2-digit', month: '2-digit', year: 'numeric'};
      const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
      const parts = dateTimeFormat.formatToParts(date);
      return (`${parts[4].value}-${parts[0].value}-${parts[2].value}`);
    }

  return (
    <div 
      className={`di-container ${isEnabled === undefined ? `element-${index}` : (isEnabled ? 'di-active' : `element-${index}`)}`} 
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='di-desc'>{description}</div>
      <div className='di-input-div'>
        <input 
          className="di-input" 
          type='date' 
          min={min} 
          max={max} 
          onChange={(e) => handleChange(e)}
          tabIndex={pageIndex === activePageIndex ? 1 : -1}
        />
      </div>
    </div>
  )
}

export default DateInput