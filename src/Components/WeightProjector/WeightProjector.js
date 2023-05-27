import React from 'react'
import { useState, useEffect } from 'react';

import PrevButton from '../Common/PrevButton/PrevButton';
import ProjectionForm from './ProjectionForm/ProjectionForm';
import { VictoryChart, VictoryAxis, VictoryArea, VictoryScatter, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';
import ProjectionStats from '../ProjectionStats/ProjectionStats';

import './WeightProjector.css';

import dataImg from './data.svg'

const WeightProjector = ({ traits, setTraits, setStats }) => {

  const [chartData, setChartData] = useState([]);
  const [isDeadlineMode, setIsDeadlineMode] = useState(true);
  const [displayDailyCals, setDisplayDailyCals] = useState(0);
  const [deficitSeverity, setDeficitSeverity] = useState('');
  const [projectionComplete, setProjectionComplete] = useState(false);

  const onFormSubmission = () => {
  }

  useEffect(() => {
    let {initialWeight, goalWeight, startDate, endDate, tdee, dailyCals} = traits;
    let totalDays;
    if (goalWeight !== '' && startDate !== undefined) {
      if ((isDeadlineMode && endDate !== undefined) || (!isDeadlineMode && dailyCals !== '')) {
        // Update chart data and re-render
        if (isDeadlineMode) {
          // Must first determine daily calorie allowance
          console.log('Determining daily calorie allowance...');
          totalDays = getDaysBetweenDates(startDate, endDate);
          dailyCals = getDailyCalsFromDeadline(tdee, initialWeight, goalWeight, totalDays);
          // Auxiliary variable needed so setTraits() not called in useEffect
          setDisplayDailyCals(dailyCals);
          // Project weight and update chart
          console.log('Projecting weight in Deadline Mode...');
          projectWeight(initialWeight, goalWeight, dailyCals, true);
        } else {
          // Project weight and update chart
          console.log('Projecting weight in DailyCals Mode...');
          totalDays = projectWeight(initialWeight, goalWeight, dailyCals, true);

          // Determine finish date
          console.log('Determining end date...');
          endDate = addDaysToDate(startDate, totalDays);
        }
        setProjectionComplete(true);
        // Assign a health severity to the daily calorie allowance
        const caloricDeficit = tdee - dailyCals;
        if (caloricDeficit > 1000) {
          setDeficitSeverity('severe');
        } else if (caloricDeficit > 500) {
          setDeficitSeverity('unhealthy');
        } else {
          setDeficitSeverity('healthy');
        }
        // Update and show stats
        const goalWeightChange = goalWeight - initialWeight;
        calculateStats(dailyCals, caloricDeficit, goalWeightChange, endDate, totalDays);  
      }
    }   
  }, [traits])

  /**
   * Calculate daily calorie allowance required to meet a given deadline
   * @param {Number} tdee - Total Daily Energy Expenditure (TDEE) of user
   * @param {Number} startWeight - Weight of user, in kg, on start date
   * @param {Number} endWeight - Weight of user, in kg, on end date
   * @param {Number} totalDays - Days between (and including) start and end dates
   * @returns {Number} Daily calorie allowance
   */ 
  const getDailyCalsFromDeadline = (tdee, startWeight, endWeight, totalDays) => {
    const startTdee = tdee;
    const finishTdee = calculateTDEE(endWeight);
    // Get TDEE at 40% and 60%
    const upperTdee = startTdee - 0.4 * (startTdee - finishTdee);
    const lowerTdee = startTdee - 0.6 * (startTdee - finishTdee);

    // Get required average daily caloric deficit 
    const deficit = 7700 * (startWeight - endWeight) / totalDays;
    
    // Get upper and lower bound for daily calorie allowance
    let upper = upperTdee - deficit;
    let lower = lowerTdee - deficit;

    // Binary search to hone in on an accurate daily calorie allowance
    let days, dailyCalsEstimate, depth = 0;
    for (depth = 0; depth < 20; depth++) {
      dailyCalsEstimate = (upper + lower) / 2.0;
      // Get number of days to reach goal weight
      days = projectWeight(startWeight, endWeight, dailyCalsEstimate, false);

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
   * @param {Number} startWeight - Weight of user, in kg, on start date
   * @param {Number} endWeight - Weight of user, in kg, on end date
   * @param {Number} dailyCals - Daily calorie allowance
   * @param {Boolean} enableDataCapture - Enable capture of time series data
   * @returns {Number} Daily calorie allowance
   */ 
   const projectWeight = (startWeight, endWeight, dailyCals, enableDataCapture) => {
    let numDays = 1;
    let currentWeight = startWeight;

    // Initialise chart data
    let tempChartData = [];
    if (enableDataCapture) tempChartData.push({x: 0, y: Number(startWeight)});

    // Perform day-by-day weight projection
    while (currentWeight > endWeight) {
      currentWeight -= (calculateTDEE(currentWeight) - dailyCals) / 7700;
      if (enableDataCapture) tempChartData.push({x: numDays, y: currentWeight});
      numDays++;
    }
    // Optionally update chart with new data
    if (enableDataCapture) setChartData(tempChartData);
    return numDays;
  }

  /**
   * 
   * @param {String} startDate - Start date string in YYYY-MM-DD format
   * @param {Number} daysToAdd - Number of days to add to start date
   * @returns Date object representing finish date
   */
  const addDaysToDate = (startDate, daysToAdd) => {
    const startDateObject = new Date(startDate);
    const finishDate = new Date(startDateObject.setTime( startDateObject.getTime() + daysToAdd * 86400000 ));
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

  const calculateTDEE = (currentWeight) => {
    const { isMale, height, age, activityLvl } = traits;
    let BMR;
    if (isMale) {
      BMR = (88.362 + (13.397 * currentWeight) + (479.9 * height) - (5.677 * age));
    } else {
      BMR = (447.593 + (9.247 * currentWeight) + (309.8 * height) - (4.330 * age));
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    return BMR * multipliers[activityLvl-1];
  }

  const calculateStats = (dailyCals, caloricDeficit, goalWeightChange, finishDate, totalDays) => {

    const isGain = caloricDeficit < 0;
    const weeklyWeightChange = (goalWeightChange/(totalDays/7)).toFixed(1);

    // Format finishDate to string
    const options = { day: 'numeric', month: 'numeric', year: '2-digit'};
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    const parts = dateTimeFormat.formatToParts(finishDate);
    const finishDateString = `${parts[2].value}\/${parts[0].value}\/${parts[4].value}`;

    setStats([
      { 
        name: 'Daily calories', 
        icon: 'fa-solid fa-utensils', 
        value: dailyCals.toFixed(0), 
        units: 'cal' 
      },
      { 
        name: `Weekly ${isGain ? 'gain' : 'loss'}`, 
        icon: 'fa-solid fa-weight-scale', 
        value: Math.abs(weeklyWeightChange), 
        units: 'kg' 
      },
      { 
        name: `Daily ${isGain ? 'surplus' : 'deficit'}`, 
        icon: `fa-solid fa-angles-${isGain ? 'up' : 'down'}`, 
        value: Math.abs(caloricDeficit).toFixed(0), 
        units: 'cal' 
      },
      { 
        name: `Total ${isGain ? 'surplus' : 'deficit'}`, 
        icon: `fa-solid fa-arrow-trend-${isGain ? 'up' : 'down'}`, 
        value: Math.abs(caloricDeficit*totalDays).toFixed(0), 
        units: 'cal' 
      },
      { 
        name: 'Finish date', 
        icon: 'fa-solid fa-flag-checkered', 
        value: finishDateString, 
        units: '' 
      },
      { 
        name: 'Total days', 
        icon: 'fa-regular fa-calendar', 
        value: totalDays, 
        units: '' 
      },
    ]);
  }

  const goPrevPage = () => {
    window.scrollBy({
      top: -window.innerHeight,
      behavior: 'smooth'
    });
  }
  
  return (
    <div>
      <div className='page-container proj-page-container'>
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
              traits={traits}
              setTraits={setTraits}
              callback={onFormSubmission}
              isDeadlineMode={isDeadlineMode}
              setIsDeadlineMode={setIsDeadlineMode}
            />
          </div>
        </div>
        

        {/*
        <VictoryChart 
          theme={VictoryTheme.material}
          containerComponent={ 
            <VictoryVoronoiContainer 
              labels={({datum}) => `Day ${datum.x}, ${datum.y.toFixed(1)}kg`}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{stroke:''}}
                  cornerRadius={12}
                />
              }
            /> 
          }
          domain={{
            x: [0, chartData.length > 0 ? chartData.length : 200], 
            y: [traits.goalWeight === '' ? 0 : traits.goalWeight, traits.goalWeight === '' ? 100 : traits.initialWeight]
          }}
          >
          <VictoryArea
            style={{
              data: { stroke: '#88cb66', strokeWidth: 3, fill:'#bdea7a', fillOpacity: 0.7 },
              parent: { border: '1px solid #000000'}
            }}
            data={chartData}
          />
          <VictoryAxis crossAxis
            width={400}
            height={400}
            theme={VictoryTheme.material}
            standalone={false}
          />
          <VictoryAxis dependentAxis crossAxis
            width={400}
            height={400}
            theme={VictoryTheme.material}
            standalone={false}
          />
        </VictoryChart>
          */}

      </div>

    </div>
  )
}

export default WeightProjector

/* ADD FOR START AND END POINTS. CURRENTLY THERE IS AN ERROR - WHEN CHARTDATA ISN'T YET POPULATED
  <VictoryScatter data={[chartData[0], chartData[chartData.length-1]]}
    size={5}
    style={{ data: { fill: "#88cb66" } }}
  />
*/