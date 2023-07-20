import React from 'react';
import './BoolToggle.css';

const BoolToggle = ({ boolValue, setBoolValue, defaultText, alternateText, activeColor, activeTextColor, index }) => {

  const toggleBoolValue = (e, isDefaultValue) => {
    if (e.target.classList.contains("button-spacer")) {
      setBoolValue(!boolValue);
    } else {
      setBoolValue(isDefaultValue);
    }
}

  let active = {       
    backgroundColor: activeColor,
    transition: 'background-color 0.2s ease',
    color: activeTextColor,
    borderRadius: '1rem'
  }

  return (
    <div className={`bool-toggle-container element-${index}`}>
        <div 
          className="default-button"
          style={boolValue ? active : {}}
          onClick={(e) => toggleBoolValue(e, true)}
        >
          {defaultText}</div>
        <div 
          className={`button-spacer a element-${index}`}
          onClick={(e) => toggleBoolValue(e, false)}
        />
        <div 
          className="alternate-button"
          style={boolValue ? {} : active}
          onClick={(e) => toggleBoolValue(e, false)}
        >{alternateText}</div>
    </div>
  )
}

export default BoolToggle