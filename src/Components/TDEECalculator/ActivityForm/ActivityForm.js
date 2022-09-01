import React from 'react'
import { useState, useEffect } from 'react';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';
import './ActivityForm.css';

const ActivityForm = () => {

    const [selectedOption, setSelectedOption] = useState(1);

    const onValueChange = (e) => {
        setSelectedOption(e.target.value);
    }
    
    const formSubmit = (e) => {
        e.preventDefault();
        console.log(selectedOption);
      }
    



    return (
        <form onSubmit={formSubmit}>
            <div className='radio-row'>
                <div className="radio radio-left">
                    <label className="radio-lbl">
                        1
                        <input                        
                            className="radio-btn"
                            type="radio"
                            value="1"
                            checked={selectedOption === "Male"}
                            onChange={onValueChange}
                        />
                    </label>
                </div>
                <div className="radio radio-center">
                    <label className="radio-lbl">
                        <input
                            className="radio-btn"
                            type="radio"
                            value="2"
                            checked={selectedOption === "Female"}
                            onChange={onValueChange}
                        />
                        2
                    </label>
                </div>
                <div className="radio radio-center">
                    <label className="radio-lbl">
                        <input
                            className="radio-btn"
                            type="radio"
                            value="3"
                            checked={selectedOption === "Other"}
                            onChange={onValueChange}
                        />
                        3
                    </label>
                </div>
                <div className="radio radio-center">
                    <label className="radio-lbl">
                        <input
                            className="radio-btn"
                            type="radio"
                            value="4"
                            checked={selectedOption === "Other"}
                            onChange={onValueChange}
                        />
                        4
                    </label>
                </div>
                <div className="radio radio-right">
                    <label className="radio-lbl">
                        <input
                            className="radio-btn"
                            type="radio"
                            value="5"
                            checked={selectedOption === "Other"}
                            onChange={onValueChange}
                        />
                        5
                    </label>
                </div>
            </div>
            <div>Selected option is : {selectedOption}</div>
            <button className="btn btn-default" type="submit">
                Submit
            </button>
        </form>
    );
}

export default ActivityForm