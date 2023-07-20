import React from 'react'
import { useState, useEffect, useRef } from 'react';
import './ActivityForm.css';

const ActivityForm = ({ TDEEData, setTDEEData, callback, pageIndex, activePageIndex }) => {

    const [activityLvlNum, _setActivityLvlNum] = useState('3');

    const activityLvlNumRef = useRef(activityLvlNum);

    const activityLvl = [
        'Sedentary',
        'Lightly active',
        'Moderately active',
        'Very active', 
        'Extremely active'
    ];

    const activityLvlDesc = [
        'Little to no exercise',
        'Light exercise / 1-3 days per week',
        'Moderate exercise / 3-5 days per week',
        'Heavy exercise / 6-7 days per week',
        'Very heavy exercise / Twice daily'
    ];

    const onValueChange = (e) => {
        setActivityLvlNum(e.target.value);
        
        // Add to health data
        setTDEEData({...TDEEData, 'activityLvl':e.target.value});
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        callback();
      }

    /*
    React useState hooks are often stale in event handlers.
    Created a useRef that is updated whenever useState hook changes value so the current value can be read from any stale context.
    https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
    */
    const setActivityLvlNum = (activityLvlNum) => {
        activityLvlNumRef.current = activityLvlNum;
        _setActivityLvlNum(activityLvlNum);
    }

    // Navigate between options with left and right arrow keys
    const handleKeyNavigation = (e) => {
        if (e.key === 'ArrowLeft' && activityLvlNum > 1) {
          const updatedActivityLvlNum = String(Number(activityLvlNum) - 1);
          setActivityLvlNum(updatedActivityLvlNum);
          setTDEEData({...TDEEData, 'activityLvl':updatedActivityLvlNum});
        }
        if (e.key === 'ArrowRight' && activityLvlNum < 5) {
            const updatedActivityLvlNum = String(Number(activityLvlNum) + 1);
            setActivityLvlNum(updatedActivityLvlNum);
            setTDEEData({...TDEEData, 'activityLvl':updatedActivityLvlNum});
        }
    }

    return (
        <form className='TDEE-form' onSubmit={handleSubmit}>
            <div 
                className='radio-row' 
                tabIndex={pageIndex === activePageIndex ? 0 : -1}
                onKeyDown={(event) => {handleKeyNavigation(event)}}
            >
                <div className={`radio radio-left ${activityLvlNumRef.current === '1' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNumRef.current === '1' ? 'radio-selected-inner' : ''}`}>
                        1
                        <input                        
                            className="radio-btn"
                            type="radio"
                            value="1"
                            checked={activityLvlNum === "Male"}
                            onChange={onValueChange}
                        />
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNumRef.current === '2' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNumRef.current === '2' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="2"
                            checked={activityLvlNum === "Female"}
                            onChange={onValueChange}
                        />
                        2
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNumRef.current === '3' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNumRef.current === '3' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="3"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        3
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNumRef.current === '4' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNumRef.current === '4' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="4"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        4
                    </label>
                </div>
                <div className={`radio radio-right ${activityLvlNumRef.current === '5' ? 'radio-selected-outer' : ''}`}>
                   <label className={`radio-lbl ${activityLvlNumRef.current === '5' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="5"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        5
                    </label>
                </div>
            </div>

                <div className='activity-lvl-container'>
                <div className='activity-lvl-title'>{activityLvl[activityLvlNum-1]}</div>
                <div className='activity-lvl-desc'>{activityLvlDesc[activityLvlNum-1]}</div>
                </div>
        </form>
    );
}

export default ActivityForm