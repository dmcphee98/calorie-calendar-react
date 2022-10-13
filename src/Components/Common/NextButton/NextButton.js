import React from 'react'
import './NextButton.css'
import nextArrow from './next-arrow.svg'
import { useState, useEffect } from 'react';

const NextButton = ({ direction, enabled, callback }) => {

    const [doPulseBorder, setPulseBorder] = useState(false);
    const [isUpArrow, setUpArrow] = useState(false);
    const [isEnabled, setEnabled] = useState(enabled);

    useEffect(() => {
      switch (direction) {
        case 'up':
          setUpArrow(true);
          break;
        case 'down':
          setUpArrow(false);
          break;
        default:
          setUpArrow(true);
          break;
      }
    },[direction])

    useEffect(() => {
      setEnabled(enabled);
    },[enabled])

    useEffect(() => {
      if (isEnabled) {
        setPulseBorder(true);
      } else {
        setPulseBorder(false);
      }
    },[isEnabled])

    const handleClick = () => {
      if (isEnabled) {
        if (isUpArrow) {
          goPrevPage();
        } else {
          goNextPage();
        }
        setUpArrow(!isUpArrow);
        setPulseBorder(false);
        callback();
      }
    }
  
  const goNextPage = () => {
    // Scroll by window height -10vh (page spacer) -8vh (navbar) +4px (page-container borders) 
    window.scrollBy({
      top: (0.82 * window.innerHeight) + 4,
      behavior: 'smooth'
    });
  }

  const goPrevPage = () => {
    // Scroll by window height -10vh (page spacer) -8vh (navbar) +4px (page-container borders) 
    window.scrollBy({
      top: (-0.82 * window.innerHeight) - 4,
      behavior: 'smooth'
    });
  }

  return (
    <div className='next-btn-container '>
      <button 
        className={`next-btn ${doPulseBorder ? 'pulse-border' : ''} ${isUpArrow ? 'up' : 'down'}`}
        onClick={handleClick}
      >
        <i class={`fa-solid fa-circle-chevron-up fa-3x ${enabled ? 'enabled' : 'disabled'}`}></i>  
      </button>
    </div>
  )
}

export default NextButton