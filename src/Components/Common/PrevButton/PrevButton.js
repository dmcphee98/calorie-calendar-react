import React from 'react'
import './PrevButton.css'
import prevArrow from './prev-arrow.svg'

const PrevButton = ({ callback, fade }) => {
  return (
    <button 
    className={`prev-btn-container ${fade ? 'fade' : 'no-fade'}`}
    onClick={callback}>
        <img className='prev-btn-arrow' src={prevArrow} alt="My Happy SVG"/>
        <div className='prev-btn-text'>PREV</div>
    </button>
  )
}

export default PrevButton

