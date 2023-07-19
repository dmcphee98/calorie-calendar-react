import React from 'react'
import './TextButton.css'
import { useState, useEffect } from 'react';

const TextButton = ({ text, innerRef, href, icon, color, callback }) => {
  
  return (
    <a ref={innerRef} href={href}
        className='text-btn-container'
        onClick={() => { if (!!callback) callback()}}
        style={{backgroundColor: 'white'}}
    >
        <i className={`text-btn-icon ${icon}`} style={{paddingRight: '0.5rem'}}/>
        {text}
    </a>
  )
}

export default TextButton