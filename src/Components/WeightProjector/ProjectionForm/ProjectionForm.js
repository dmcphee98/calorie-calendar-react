import React from 'react'
import { useState, useEffect } from 'react';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';
import NumInput from '../../Common/NumInput/NumInput';
import DateInput from '../../Common/DateInput/DateInput';
import './ProjectionForm.css';

const ProjectionForm = ({ traits, setTraits, isDeadlineMode, setIsDeadlineMode, setProjectionIsvalid}) => {

    const [goalWeight, setGoalWeight] = useState('');
    const [dailyCals, setDailyCals] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {

      setProjectionIsvalid(false);
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        setTraits({
          ...traits, 
          'goalWeight': goalWeight, 
          'startDate': startDate,
          'endDate': endDate,
          'dailyCals': dailyCals
        });
      }, 750));

    }, [goalWeight, startDate, endDate, dailyCals])
  
    const setDeadlineMode = () => {
      console.log("Mode set to 'Deadline'.");
      setIsDeadlineMode(true);
    };

    const setDailyMode = () => {
      console.log("Mode set to 'Daily'.");
      setIsDeadlineMode(false);
    };

    return (
        <form className='proj-form'>
            <NumInput number={goalWeight} setNumber={setGoalWeight} units='kg' description='Goal Weight'/>
            <DateInput number={startDate} setNumber={setStartDate} description='Start Date'/>
            <div className="proj-container">
                <div className="proj-desc-A">Enter a <em>finish date</em> to find<br></br>your daily calorie allowance</div>
                <DateInput number={endDate} setNumber={setEndDate} description='Finish Date' isEnabled={isDeadlineMode} callback={setDeadlineMode} />
                <div className="proj-or">OR</div>
                Enter a daily <em>calorie allowance</em> <br></br>to estimate your finish date
                <NumInput number={dailyCals} setNumber={setDailyCals} description='Daily Cals' units='Cal' isEnabled={!isDeadlineMode} callback={setDailyMode} />
            </div>
        </form>
    );
}

export default ProjectionForm