import React from 'react';
import './StatsCalculator.css';
import { useState, useEffect } from 'react';
import NextButton from '../Common/NextButton/NextButton';

const StatsCalculator = ({ healthData, goalData, projectionData, stats, setStats }) => {

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
        const weeklyWeightChange = (totalWeightChange/(totalDays/7)).toFixed(1);
    
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
    
    return (
        <div>
            <div className='page-container'>
                <div className='stats-container'>
                    {stats.map((stat, index) => {
                        return (
                            <StatBox 
                                key={index} 
                                name={stat.name}
                                value={stat.value}
                                icon={stat.icon}
                                units={stat.units}
                            />
                        )
                    })}
                </div>
            </div>
            <div className='page-spacer'>
                <NextButton direction="down" enabled={true}/>
            </div>
        </div>
    )
}

export default StatsCalculator

export const StatBox = ( { name, icon, value, units }) => {
    return (
      <div className='stat-box-container'>
          <div className='stat-box'>
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
    )
  }