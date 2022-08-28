import React from 'react'
import './NextButton.css'
import nextArrow from './next-arrow.svg'
import { useState } from 'react';

const NextButton = ({ callback }) => {

    const [fade, setFade] = useState(false);

    const handleClick = () => {
        setFade(true);
        callback();
    }

  return (
    <button 
    className={`next-btn-container ${fade ? 'fade' : 'no-fade'}`}
    onClick={handleClick}>
        <div className='next-btn-text'>NEXT</div>
        <img className='next-btn-arrow' src={nextArrow} alt="My Happy SVG"/>
    </button>
  )
}

export default NextButton