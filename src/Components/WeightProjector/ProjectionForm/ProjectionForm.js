import React from 'react'
import { useState, useEffect } from 'react';
import NumInput from '../../Common/NumInput/NumInput';
import DateInput from '../../Common/DateInput/DateInput';
import './ProjectionForm.css';

const ProjectionForm = ({ goalData, setGoalData, isDailyCalsMode, setDailyCalsMode, setProjectionData, useMetricSystem, activePageIndex}) => {

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
            <NumInput 
              number={goalWeight} 
              setNumber={setGoalWeight} 
              description='Goal Weight' 
              units={useMetricSystem ? 'kg' : 'lbs'} 
              index={31}
              pageIndex={3}
              activePageIndex={activePageIndex}
            />
            <DateInput 
              number={startDate} 
              setNumber={setStartDate} 
              description='Start Date' 
              index={32}
              pageIndex={3}
              activePageIndex={activePageIndex}
            />
              <div className="proj-container">
                <div className={`option-1-background ${isDailyCalsMode? '' : 'active'}`}>
                  <div className='option-1'>
                    <div 
                      className='option-1-text' 
                      onClick={setDeadlineMode}
                      tabIndex={activePageIndex === 3 ? 0 : -1}
                      onKeyDown={(event) => {if (event.key === 'Enter') setDeadlineMode()}}
                    >
                        Option 1
                    </div>
                  </div>
                </div>
                <div className={`option-2-background ${isDailyCalsMode? 'active' : ''}`}>
                  <div className='option-2'>
                    <div 
                      className='option-2-text' 
                      onClick={setDailyMode}
                      tabIndex={activePageIndex === 3 ? 0 : -1}
                      onKeyDown={(event) => {if (event.key === 'Enter') setDailyMode()}}
                      >
                      Option 2
                    </div>
                  </div>
                </div>
                <div className='option-container-background'>
                  {!isDailyCalsMode &&
                    <div className='option-container'>
                      <div className="proj-desc-A">Provide a <em>finish date</em> and we'll <br/> recommend a daily calorie goal</div>
                      <DateInput 
                        number={finishDate} 
                        setNumber={setFinishDate} 
                        description='Finish Date' 
                        min={getEarliestValidFinishDate(startDate)} 
                        index={33}
                        pageIndex={3}
                        activePageIndex={activePageIndex}
                      />
                    </div>
                  }
                  {isDailyCalsMode &&
                    <div className='option-container'>
                      Provide a <em>daily calorie goal </em>  and <br/>we'll estimate your finish date
                      <NumInput
                        number={dailyCals} 
                        setNumber={setDailyCals} 
                        description='Daily Cals' 
                        units='Cal' 
                        index={33}
                        pageIndex={3}
                        activePageIndex={activePageIndex}    
                      />
                    </div>
                  }
                </div>
            </div>
        </form>
    );
}

export default ProjectionForm