import React from 'react'
import { useState, useEffect } from 'react';

import NavButton from '../Common/NavButton/NavButton';
import ProjectionForm from './ProjectionForm/ProjectionForm';

import './WeightProjector.css';

import dataImg from './data.svg'

const WeightProjector = ({ healthData, goalData, setGoalData, setProjectionData, activePageIndex, setActivePageIndex, useMetricSystem }) => {

  const [isDailyCalsMode, setDailyCalsMode] = useState(false);
  const [deficitSeverity, setDeficitSeverity] = useState('');
  const [isWeightLoss, setIsWeightLoss] = useState(true);
  const [errorCode, setErrorCode] = useState('none');

  const [localProjectionData, setLocalProjectionData] = useState('');
  const [projectionFormDataIsValid, setProjectionFormDataIsValid] = useState(false);

  /*
   *  'Daily cals' mode calculation
   */
  const projectWeightFromDailyCals = () => {
    let {initialWeight, tdee} = healthData;
    let {goalWeight, startDate, dailyCals} = goalData;

    console.log('Projecting weight in DailyCals Mode...');
    const totalDays = projectWeight(initialWeight, goalWeight, startDate, dailyCals, true);

    console.log('Determining end date...');
    const finishDate = addDaysToDate(startDate, totalDays-1);

    setGoalData({...goalData, finishDate, totalDays});
    getDeficitSeverity(tdee, dailyCals);
  }

  /*
   *  'Finish date' mode calculation
   */
  const projectWeightFromFinishDate = () => {
    let {initialWeight, tdee} = healthData;
    let {goalWeight, startDate, finishDate} = goalData;

    console.log('Determining daily calorie allowance...');
    const totalDays = getDaysBetweenDates(startDate, finishDate)+1;
    const dailyCals = getDailyCalsFromDeadline(tdee, initialWeight, goalWeight, startDate, totalDays);

    console.log('Projecting weight in Deadline Mode...');
    projectWeight(initialWeight, goalWeight, startDate, dailyCals, true);

    setGoalData({...goalData, dailyCals, totalDays});
    getDeficitSeverity(tdee, dailyCals);
  }

  /**
   * Calculate daily calorie allowance required to meet a given deadline
   * @param {Number} tdee - Total Daily Energy Expenditure (TDEE) of user
   * @param {Number} initialWeight - Weight of user, in kg, on start date
   * @param {Number} goalWeight - Weight of user, in kg, on end date
   * @param {Number} startDate - Start date
   * @param {Number} totalDays - Days between (and including) start and end dates
   * @returns {Number} Daily calorie allowance
   */ 
  const getDailyCalsFromDeadline = (tdee, initialWeight, goalWeight, startDate, totalDays) => {
    const startTdee = tdee;
    const finishTdee = recalculateTDEE(goalWeight);
    // Get TDEE at 40% and 60%
    const upperTdee = startTdee - 0.4 * (startTdee - finishTdee);
    const lowerTdee = startTdee - 0.6 * (startTdee - finishTdee);

    // Get required average daily caloric deficit 
    const deficit = 7700 * (initialWeight - goalWeight) / totalDays;
    
    // Get upper and lower bound for daily calorie allowance
    let upper = upperTdee - deficit;
    let lower = lowerTdee - deficit;

    // Binary search to hone in on an accurate daily calorie allowance
    let days, dailyCalsEstimate, depth = 0;
    for (depth = 0; depth < 20; depth++) {
      dailyCalsEstimate = (upper + lower) / 2.0;
      // Get number of days to reach goal weight
      days = projectWeight(initialWeight, goalWeight, startDate, dailyCalsEstimate, false);

      // Tweak daily calorie allowance so resulting number of days exactly meets deadline
      if (days === totalDays) break;
      if (days < totalDays) {
        lower = dailyCalsEstimate;
      } else {
        upper = dailyCalsEstimate;
      }
    }
    // Return refined daily calorie allowance
    return dailyCalsEstimate;
  }

  /**
   * Project weight over time given start weight, end weight, and daily calories 
   * @param {Number} initialWeight - Weight of user, in kg, on start date
   * @param {Number} goalWeight - Weight of user, in kg, on end date
   * @param {Number} startDate - Start date
   * @param {Number} dailyCals - Daily calorie allowance
   * @param {Boolean} enableDataCapture - Enable capture of time series data
   * @returns {Number} Daily calorie allowance
   */ 
   const projectWeight = (initialWeight, goalWeight, startDate, dailyCals, enableDataCapture) => {
    let numDays = 1;
    let currentWeight = initialWeight;

    // Initialise chart data
    let xyData = [];
    if (enableDataCapture) xyData.push({x: 0, y: Number(useMetricSystem ? initialWeight : 2.2046 * initialWeight)});

    // Perform day-by-day weight projection
    const isLoss = goalWeight <= initialWeight;
    while ((isLoss && currentWeight > goalWeight) || (!isLoss && currentWeight < goalWeight)) {
      currentWeight -= (recalculateTDEE(currentWeight) - dailyCals) / 7700;
      if (enableDataCapture) xyData.push({x: numDays, y: useMetricSystem ? currentWeight : 2.2046 * currentWeight});
      numDays++;
    }
    // Optionally save projection data 
    if (enableDataCapture) {
      setLocalProjectionData({
        xy: xyData,
        xMax: xyData.length,
        yMin: useMetricSystem ? Math.min(initialWeight, goalWeight) : 2.2046 * Math.min(initialWeight, goalWeight),
        yMax: useMetricSystem ? Math.max(initialWeight, goalWeight) : 2.2046 * Math.max(initialWeight, goalWeight),
        startDate
      });
    }
    return numDays;
  }

  /**
   * 
   * @param {String} startDate - Start date string in YYYY-MM-DD format
   * @param {Number} daysToAdd - Number of days to add to start date
   * @returns Date object representing finish date
   */
  const addDaysToDate = (startDate, daysToAdd) => {
    const finishDate = new Date(startDate.getTime() + daysToAdd * 86400000);
    console.log('Finish date is ' + finishDate);
    return finishDate;
  }
  
  /**
   * 
   * @param {String} startDate - Start date string in YYYY-MM-DD format
   * @param {String} endDate - End date string in YYYY-MM-DD format
   * @returns Number of days between start and end date
   */
  const getDaysBetweenDates = (startDate, endDate) => {
    const dt = endDate.getTime() - startDate.getTime();
    return dt / (1000 * 3600 * 24);
  } 

  /**
   * Appends ordinal suffix to given day of month
   * @param {Number} dayOfMonth - The day of the month (0-31)
   * @returns Ordinal day of month as string
   */
  const getOrdinalNum = (dayOfMonth) => {
    if (dayOfMonth < 1 || dayOfMonth > 31) throw new RangeError("Day of month must be between 1 and 31, inclusive");
    let selector;
    if (dayOfMonth <= 0) {
      selector = 4;
    } else if ((dayOfMonth > 3 && dayOfMonth < 21) || dayOfMonth % 10 > 3) {
      selector = 0;
    } else {
      selector = dayOfMonth % 10;
    }
    return dayOfMonth + ['th', 'st', 'nd', 'rd', ''][selector];
  };  

  const recalculateTDEE = (currentWeight) => {
    const { isMale, height, age, activityLvl } = healthData;
    let bmr;
    if (isMale) {
      bmr = (88.362 + (13.397 * currentWeight) + (479.9 * height) - (5.677 * age));
    } else {
      bmr = (447.593 + (9.247 * currentWeight) + (309.8 * height) - (4.330 * age));
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    return bmr * multipliers[activityLvl-1];
  }

    /**
   * Calculates caloric deficit and determines how healthy it is
   * @param {Number} tdee
   * @param {Number} dailyCals
   * @returns String indicating how healthy the calorie deficit is
   */
  const getDeficitSeverity = (tdee, dailyCals) => {
    // Assign a health severity to the daily calorie allowance
    const caloricDeficit = tdee - dailyCals;
    if (caloricDeficit > 1000) {
      setDeficitSeverity('severe');
    } else if (caloricDeficit > 500) {
      setDeficitSeverity('unhealthy');
    } else {
      setDeficitSeverity('healthy');
    }
  }

  const getProjectionFormDataValidity = () => {
    let {initialWeight, tdee} = healthData;
    let {goalWeight, startDate, finishDate, dailyCals} = goalData;

    // Ensure prerequisite data is present
    if (!!!initialWeight || !!!tdee) {
      setErrorCode('none');
      return false;
    }
    // Ensure form is fully filled out
    if (!!!goalWeight || !!!startDate || isNaN(startDate) || (isDailyCalsMode && !!!dailyCals ) || (!isDailyCalsMode && (!!!finishDate || isNaN(finishDate)))) {
      setErrorCode('none');
      return false;
    }

    const isWtLoss = goalWeight <= initialWeight;
    setIsWeightLoss(isWtLoss);

    if (isDailyCalsMode) {
      // Ensure daily cals value does not result in projection divergence
      if (isWtLoss && dailyCals >= tdee) {
        setErrorCode('dailyCalsTooHighForWeightLoss')
        return false;
      }
      if (!isWtLoss && dailyCals <= tdee) {
        setErrorCode('dailyCalsTooLowForWeightGain')
        return false;
      }
    } else {
      // Ensure finish date is after start date
      if (startDate >= finishDate) {
        setErrorCode('finishDateBeforeStartDate')
        return false;
      }
      // Ensure finish date is not impossible (i.e resulting in negative daily calories)
      if (isWtLoss) {
        const totalWtLoss = Math.abs(initialWeight-goalWeight);
        const totalDays = getDaysBetweenDates(startDate, finishDate);
        const dailyWtLoss = totalWtLoss/totalDays;
        const dailyCalorieDeficit = 7700*dailyWtLoss;
        if (dailyCalorieDeficit > tdee) {
          setErrorCode('finishDateNotAchievable')
          return false;
        }
      }
    }
    setErrorCode('none');
    return true;
  }

  useEffect(() => {
    const isValid = getProjectionFormDataValidity();
    setProjectionFormDataIsValid(isValid);
    console.log("Updated projection form validity to: " + isValid);
  }, [healthData.tdee, goalData, isDailyCalsMode])

  const submitProjectionData = () => {
    if (isDailyCalsMode) {
      projectWeightFromDailyCals();
    } else {
      projectWeightFromFinishDate();
    }
  }

  useEffect(() => {
    if (!!localProjectionData) setProjectionData(localProjectionData);
  }, [localProjectionData])

  
  return (
    <div style={{height: '18%', minHeight: '400px'}}>
      <div className='page-container proj-page-container'>
        <div className='proj-content'>
          <div className='img-container proj-img-container'>
            <img className='proj-img' src={dataImg} alt="My Happy SVG"/>
          </div>
          <div className='form-container'>
            <div className='proj-info-container'>
              <p className='proj-info'>
                <span>Now, let's work out your goals.</span>
              </p>
            </div>
            <div className='proj-form'>
              <ProjectionForm 
                goalData={goalData}
                setGoalData={setGoalData}
                isDailyCalsMode={isDailyCalsMode}
                setDailyCalsMode={setDailyCalsMode}
                setProjectionData={setLocalProjectionData}
                useMetricSystem={useMetricSystem}
                activePageIndex={activePageIndex}
              />
            </div>
          </div>
        </div>
        { errorCode==='none' && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-info proj-warning-icon'/>
            <span className='proj-warning-bold'> Tip: </span>
            { isWeightLoss && 
              <span><i>A deficit of 500-750 calories is the general recommendation for healthy weight loss.</i></span>
            }
            { !isWeightLoss && 
              <span><i>A surplus of 250-500 calories is the general recommendation for healthy weight gain.</i></span>
            }
          </div>
        }
        { (errorCode==='dailyCalsTooLowForWeightGain' || errorCode==='dailyCalsTooHighForWeightLoss') && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-exclamation proj-warning-icon'/>
            <span className='proj-warning-bold'> Error: </span>
            <span><i>To reach your goal weight, your daily calories must be {isWeightLoss ? 'less' : 'greater'} than your TDEE.</i></span>
          </div>
        }
        { errorCode==='finishDateBeforeStartDate' && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-exclamation proj-warning-icon'/>
            <span className='proj-warning-bold'> Error: </span>
            <span><i>The specified finish date cannot fall on or before the start date.</i></span>
          </div>
        }
        { errorCode==='finishDateNotAchievable' && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-exclamation proj-warning-icon'/>
            <span className='proj-warning-bold'> Error: </span>
            <span><i>It is not possible to achieve the specified finish date. Consider pushing it back.</i></span>
          </div>
        }

      </div>
      <div className='page-spacer'>
        <NavButton 
          pageIndex={3} 
          enabled={projectionFormDataIsValid}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          callbackNext={submitProjectionData}/>
      </div>
    </div>
  )
}

export default WeightProjector