import React from 'react';
import './StatsCalculator.css';
import { useState, useEffect } from 'react';
import NavButton from '../Common/NavButton/NavButton';

const StatsCalculator = ({ healthData, goalData, projectionData, stats, setStats, activePageIndex, setActivePageIndex, useMetricSystem }) => {

    useEffect(() => {
        if (projectionData) calculateStats();
    }, [projectionData])
    

    //dailyCals, caloricDeficit, goalWeightChange, finishDate, totalDays
    const calculateStats = () => {
        const {initialWeight, tdee} = healthData;
        const {goalWeight, finishDate, dailyCals, totalDays} = goalData;

        const caloricDeficit = tdee - dailyCals;
        const isGain = caloricDeficit < 0;

        const totalWeightChange = goalWeight - initialWeight;
        const weeklyWeightChange = totalWeightChange/(totalDays/7);
    
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
            units: 'cal',
            color: '#FC7E7A'
          },
          { 
            name: `Weekly ${isGain ? 'gain' : 'loss'}`, 
            icon: 'fa-solid fa-weight-scale', 
            value: Math.abs(useMetricSystem ? weeklyWeightChange : 2.2046 * weeklyWeightChange).toFixed(1), 
            units: useMetricSystem ? 'kg' : 'lbs',
            color: '#FC8C6B'
          },
          { 
            name: `Daily ${isGain ? 'surplus' : 'deficit'}`, 
            icon: `fa-solid fa-angles-${isGain ? 'up' : 'down'}`, 
            value: Math.abs(caloricDeficit).toFixed(0), 
            units: 'cal',
            color: '#FC9A5C'
          },
          { 
            name: `Total ${isGain ? 'surplus' : 'deficit'}`, 
            icon: `fa-solid fa-arrow-trend-${isGain ? 'up' : 'down'}`, 
            value: Math.abs(caloricDeficit*totalDays).toFixed(0), 
            units: 'cal',
            color: '#FCA84D'
          },
          { 
            name: 'Finish date', 
            icon: 'fa-solid fa-flag-checkered', 
            value: finishDateString, 
            units: '',
            color: '#FCB63E'
          },
          { 
            name: 'Total days', 
            icon: 'fa-regular fa-calendar', 
            value: totalDays, 
            units: '' ,
            color: '#FEC22F'
          },
        ]);
      }
    
    return (
        <div>
          <div className='page-container stat-page-container'>
            <div className='stats-header'>Let's view some stats we prepared.</div>
            <div className='stats-container'>
                {stats.map((stat, index) => {
                    return (
                        <StatBox 
                            key={index} 
                            name={stat.name}
                            value={stat.value}
                            icon={stat.icon}
                            units={stat.units}
                            activePageIndex={activePageIndex}
                            color={stat.color}
                        />
                    )
                })}
            </div>
            <div className='stat-warning'>
              <i className='fa-solid fa-circle-info stat-warning-icon'/>
              <span className='stat-warning-bold'> Tip: </span>
              { useMetricSystem && <span><i>There are approximately 7700 calories in 1kg of body fat.</i></span> }
              { !useMetricSystem && <span><i>There are approximately 3500 calories in 1lb of body fat.</i></span> }
           </div>
          </div>
          <div className='page-spacer'>
              <NavButton 
                pageIndex={4} 
                enabled={true}
                activePageIndex={activePageIndex}
                setActivePageIndex={setActivePageIndex}/>
          </div>
        </div>
    )
}

export default StatsCalculator

export const StatBox = ( { name, icon, value, units, color }) => {
    return (
      <div className='stat-box-container'>
          <div className='stat-box' style={{backgroundColor: color}}>
            <div className='stat-box-background'>
              <div className='stat-icon-container'>
                  <i className={`stat-icon ${icon}`}/>
              </div>
              <div className='stat-title'>
                  {name}
              </div>
              <div className='stat-value-container'>
                  <div className='stat-value'>
                      {value}
                      <div className='stat-unit'>{units}</div>
                  </div>
              </div>
            </div>
        </div>
      </div>
    )
  }