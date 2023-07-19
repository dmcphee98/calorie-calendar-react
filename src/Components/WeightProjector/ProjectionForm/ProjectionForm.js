import React from 'react'
import { useState, useEffect } from 'react';
import NumInput from '../../Common/NumInput/NumInput';
import DateInput from '../../Common/DateInput/DateInput';
import './ProjectionForm.css';

const ProjectionForm = ({ goalData, setGoalData, isDailyCalsMode, setDailyCalsMode, setProjectionData, useMetricSystem}) => {

    const [goalWeight, setGoalWeight] = useState('');
    const [dailyCals, setDailyCals] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {
      setProjectionData('');
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        setGoalData({
          ...goalData, 
          'goalWeight': useMetricSystem? goalWeight : 0.4536 * goalWeight, 
          'startDate': startDate,
          'finishDate': finishDate,
          'dailyCals': dailyCals
        });  
      }, 750));

    }, [goalWeight, startDate, finishDate, dailyCals, isDailyCalsMode])
  
    const setDeadlineMode = () => {
      console.log("Mode set to 'Deadline'.");
      setDailyCalsMode(false);
    };

    const setDailyMode = () => {
      console.log("Mode set to 'Daily'.");
      setDailyCalsMode(true);
    };

    const getEarliestValidFinishDate = (startDate) => {
      if (startDate instanceof Date && !isNaN(startDate)) {
        let nextDay = new Date();
        nextDay.setDate(startDate.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
      } else {
        return undefined;
      }
    }

    return (
        <form className='proj-form'>
            <NumInput number={goalWeight} setNumber={setGoalWeight} units={useMetricSystem ? 'kg' : 'lbs'} description='Goal Weight' color='purple'/>
            <DateInput number={startDate} setNumber={setStartDate} description='Start Date'/>
            <div className="proj-container">
                <div className={`option-1-background ${isDailyCalsMode? '' : 'active'}`}>
                  <div className='option-1'>
                    <div className='option-1-text' onClick={setDeadlineMode}>Option 1</div>
                  </div>
                </div>
                <div className={`option-2-background ${isDailyCalsMode? 'active' : ''}`}>
                  <div className='option-2'>
                    <div className='option-2-text' onClick={setDailyMode}>Option 2</div>
                  </div>
                </div>
                <div className='option-container-background'>
                  {!isDailyCalsMode &&
                    <div className='option-container'>
                      <div className="proj-desc-A">Provide a <em>finish date</em> and we'll <br/> recommend a daily calorie goal</div>
                      <DateInput number={finishDate} setNumber={setFinishDate} description='Finish Date' min={getEarliestValidFinishDate(startDate)}/>
                    </div>
                  }
                  {isDailyCalsMode &&
                    <div className='option-container'>
                      Provide a <em>daily calorie goal </em>  and <br/>we'll estimate your finish date
                      <NumInput number={dailyCals} setNumber={setDailyCals} description='Daily Cals' units='Cal' isEnabled={isDailyCalsMode} callback={setDailyMode} color='purple'/>
                    </div>
                  }
                </div>
            </div>
        </form>
    );
}

export default ProjectionForm