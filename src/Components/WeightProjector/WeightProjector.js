import React from 'react'
import { useState, useEffect } from 'react';

import PrevButton from '../Common/PrevButton/PrevButton';
import NextButton from '../Common/NextButton/NextButton';
import ProjectionForm from './ProjectionForm/ProjectionForm';
import { VictoryChart, VictoryAxis, VictoryArea, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';
import './WeightProjector.css';

import soccerImg from '../TDEECalculator/soccer.svg'


const WeightProjector = ({ traits, setTraits }) => {

  const [chartData, setChartData] = useState([]);

  const onFormSubmission = () => {
  }

  useEffect(() => {
    const {initialWeight, goalWeight, startDate, endDate, dailyCals} = traits;
    if (goalWeight !== '' && startDate !== '' && !(endDate === '' && dailyCals === '')) {
      // Update chart data and re-render
      console.log('Updating chart...');
      
      let day = 1;
      let tempChartData = [];
      let currentWeight = initialWeight;
  
      while (currentWeight > goalWeight) {
        currentWeight -= (calculateTDEE(currentWeight) - dailyCals) / 7700;
        tempChartData.push({x: day++, y: currentWeight});
      }
      setChartData(tempChartData);
    }
  }, [traits])
  
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


  const goPrevPage = () => {
    window.scrollBy({
      top: -window.innerHeight,
      behavior: 'smooth'
    });
  }

  const goNextPage = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
  
  return (
    <div>
      <div className='proj-header'>
        <PrevButton callback={goPrevPage} fade={true}/>
      </div>

      <div className='proj-body'>
        <div className='proj-left'/>
        <div className='proj-form-container'>
          <div className='proj-info-container'>
            <p className='proj-info'>
              <span>Now, we can forecast your weight.</span>
            </p>
          </div>
          <div className='proj-form'>
            <ProjectionForm 
              traits={traits}
              setTraits={setTraits}
              callback={onFormSubmission}/>
          </div>
        </div>

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
            style={{
              grid: { stroke: "#ffffff", strokeWidth: "2", strokeDasharray: "0 0" },
            }}
          />
          <VictoryAxis dependentAxis crossAxis
            width={400}
            height={400}
            theme={VictoryTheme.material}
            standalone={false}
            style={{
              grid: { stroke: "#ffffff", strokeWidth: "2", strokeDasharray: "0 0" },
              }}
          />
        </VictoryChart>

        <div className='proj-right'/>
      </div>

      <div className='proj-footer'>
      </div>
    </div>
  )
}

export default WeightProjector