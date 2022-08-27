import React from 'react';
import './NumInput.css';


const NumInput = ({ number, setNumber, description, units }) => {

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

  return (
    <div className='ni-container'>
        <div className='ni-desc'>{description}</div>
        <div className='ni-input-div'>
          <input className="ni-input" type='number' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
        <div className='ni-units'>{`( ${units} )`}</div>
    </div>
  )
}

export default NumInput