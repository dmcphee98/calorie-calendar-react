import React from 'react'
import './TextButton.css'
import { useState, useEffect } from 'react';

const TextButton = ({ text, icon, color, innerRef, href, callback, pageIndex, activePageIndex }) => {
  
  return (
    <a ref={innerRef} href={href}
        className='text-btn-container'
        onClick={() => { if (!!callback) callback() }}
        onKeyDown={(event) => {if (event.key === 'Enter') callback()}}
        style={{backgroundColor: 'white'}}
        tabIndex={pageIndex === activePageIndex ? 1 : -1}
    >
        <i className={`text-btn-icon ${icon}`} style={{paddingRight: '0.5rem'}}/>
        {text}
    </a>
  )
}

export default TextButton