import React from 'react'
import TraitsForm from './TraitsForm/TraitsForm'
import './LandingPage.css';
import treeImg from './tree.svg'
import { getByRole } from '@testing-library/react';

const LandingPage = ({ setTraits, isMetricSystem, setMetricSystem}) => {
  return (
    <div>
      <div className='landing-header'>
        <h1 className='landing-title'>Calorie Calendar</h1>
      </div>
      <div className='landing-body'>
        <div className='landing-left'/>
        <div className='landing-img-container'>
          <img className='landing-img' src={treeImg} alt="My Happy SVG"/>
        </div>
        <div className='landing-form-container'>
          <div className='landing-info'>First, let's calculate your <span className='landing-text-green'>BMI</span></div>
          <div className='landing-form'>
            <TraitsForm 
                setTraits={setTraits}
                isMetricSystem={isMetricSystem}
                setMetricSystem={setMetricSystem}/>
          </div>
          <div className='landing-output'>Your BMI is XXX which falls within XXX range</div>
        </div>
        <div className='landing-right'/>
      </div>
    </div>
  )
}

export default LandingPage