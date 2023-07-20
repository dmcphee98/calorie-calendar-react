import React from 'react';
import './NumInput.css';


const NumInput = ({ number, setNumber, description, units, index, isEnabled, callback }) => {

    const handleChange = (e) => {
      const number = (e.target.value === '') ? '' : Math.abs(Number(e.target.value));
      setNumber(number);
    }

  return (
    <div 
      className={`ni-container ${isEnabled === false ? 'ni-inactive' : `element-${index}`}`}
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='ni-desc'>{description}</div>
        <div className='ni-input-div'>
          <input className="ni-input" type='number' min='0' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
        <div className='ni-units'>{`( ${units} )`}</div>
    </div>
  )
}

export default NumInput