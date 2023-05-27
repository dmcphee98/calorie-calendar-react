import React from 'react'
import { useState, useEffect } from 'react';
import { VictoryChart, VictoryAxis, VictoryArea, VictoryLabel, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

const GraphPage = ({ projectionData }) => {

    const [xTicks, setXTicks] = useState('');

    const getDateFromTickValue = (tickValue) => {
        let startDate = projectionData.startDate;
        let tickDate = new Date(startDate.getTime() + tickValue * 86400000);

        // Format finishDate to string
        const options = { day: 'numeric', month: 'short', year: '2-digit'};
        const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
        const parts = dateTimeFormat.formatToParts(tickDate);
        const tickDateString = `${parts[2].value} ${parts[0].value}`;
        
        return tickDateString;
    }

    useEffect(() => {
        if (!!projectionData) {
            const tickInterval = Math.floor(projectionData.xMax / 10);
            let tickValues = [];
            for (let i = 1; i <= 10; i++) {
                tickValues.push(i * tickInterval);
            }
            setXTicks(tickValues);

        }
    }, [projectionData]);

  return (
    <div>
        <div className='page-container'>
            { !!projectionData && !!xTicks &&
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
                        x: [0, projectionData.xMax], 
                        y: [projectionData.yMin, projectionData.yMax]
                    }}
                    width={580}
                    height={360}
                >
                    <VictoryArea
                        style={{
                        data: { stroke: '#88cb66', strokeWidth: 2, fill:'#bdea7a', fillOpacity: 0.5 },
                        parent: { border: '1px solid #000000'}
                        }}
                        data={projectionData.xy}
                    />
                    <VictoryAxis crossAxis
                        width={580}
                        height={360}
                        tickValues={xTicks}
                        tickFormat={(t) => getDateFromTickValue(t)}
                        theme={VictoryTheme.material}
                        label="Days"
                        style={{
                            axis: {stroke: 'black'},
                            axisLabel: {fontSize: 15, padding: 40},
                            grid: {stroke: "#b8b8b8"},
                            ticks: {stroke: "black", size: 5},
                            tickLabels: {fontSize: 10, angle: 45, transform: 'translate(15, 4)'}
                        }}
                        standalone={false}
                    />
                    <VictoryAxis dependentAxis crossAxis
                        width={580}
                        height={360}
                        tickCount={5}
                        theme={VictoryTheme.material}
                        standalone={false}
                        label="Weight ()"
                        style={{
                            axis: {stroke: 'black'},
                            axisLabel: {fontSize: 15, padding: 30},
                            grid: {stroke: "#b8b8b8", width: 1},
                            ticks: {stroke: "black", size: 5},
                            tickLabels: {fontSize: 10, padding: 5}
                        }}
                    />
                </VictoryChart>
            }
        </div>
        <div className='page-spacer'/>
    </div>
  )
}

export default GraphPage