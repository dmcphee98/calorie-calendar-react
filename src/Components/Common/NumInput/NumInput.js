import React from 'react';
import './NumInput.css';


const NumInput = ({ number, setNumber, description, units, isEnabled, callback }) => {

    const handleChange = (e) => {
        setNumber(Number(e.target.value));
    }

  return (
    <div 
      className={`di-container ${isEnabled === undefined ? 'ni-active' : (isEnabled ? 'ni-active' : 'ni-inactive')}`}
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='ni-desc'>{description}</div>
        <div className='ni-input-div'>
          <input className="ni-input" type='number' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
        <div className='ni-units'>{`( ${units} )`}</div>
    </div>
  )
}

export default NumInput