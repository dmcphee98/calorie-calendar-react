import React from 'react'
import './GraphPage.css';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import TextButton from '../Common/TextButton/TextButton';
import { ExportToCsv } from 'export-to-csv';
import { Buffer } from 'buffer';
import { VictoryChart, VictoryAxis, VictoryArea, VictoryScatter, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

const GraphPage = ({ projectionData, useMetricSystem, activePageIndex, isMobile }) => {

    const [xTicks, setXTicks] = useState('');
    const [horizLineData, setHorizLineData] = useState([{x:0,y:0},{x:0,y:0}]);
    const [vertLineData, setVertLineData] = useState([{x:0,y:0},{x:0,y:0}]);
    const [currentPointData, setCurrentPointData] = useState([{x:0,y:0}]);

    const svgRef = useRef();
    const canvasRef = useRef();
    const linkRef = useRef();
  
    const csvOptions = { 
        filename: 'WeightForecast',
        title: 'Weight forecast',
        showLabels: true, 
        showTitle: true,
        headers: ['Day', 'Date', `Weight (${useMetricSystem ? 'kg' : 'lbs'})`]
      };
    const csvExporter = new ExportToCsv(csvOptions);

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

    const updateTooltipAxes = (toolTipCoords) => {
        const x = toolTipCoords._voronoiX;
        const y = toolTipCoords._voronoiY;

        setHorizLineData([{x:0, y}, {x, y}]);
        setVertLineData([{x, y:0}, {x, y}]);
        setCurrentPointData([{x, y}])
    }

    const exportToCsv = () => {
        let csvData = [];
        for (let i = 0; i < projectionData.xMax; i++) {
            const date = new Date(projectionData.startDate.getTime() + i * 86400000);
            const options = { day: '2-digit', month: '2-digit', year: 'numeric'};
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
            const parts = dateTimeFormat.formatToParts(date);
            const dateString = `${parts[4].value}-${parts[0].value}-${parts[2].value}`;
    
            csvData.push({
                day: i+1,
                date: dateString,
                weight: (projectionData.xy[i].y).toFixed(1)
            })
        }
        csvExporter.generateCsv(csvData)
    }

    const isWeightGain = () => {
        return !!projectionData && projectionData.xy[projectionData.xMax-1].y > projectionData.xy[0].y;
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

    useLayoutEffect(() => {
        if (!!!svgRef.current || !!!projectionData) return;
        const ctx = canvasRef.current.getContext("2d");
        const xml = new XMLSerializer().serializeToString(
          svgRef.current.firstChild
        );

        const imageWidth = 3 * (isMobile ? 440: 580);    
        const imageHeight = 3 * 360;

        canvasRef.current.width = imageWidth;
        canvasRef.current.height = imageHeight;
    
        var svg64 = Buffer.from(xml).toString('base64');
        var b64Start = "data:image/svg+xml;base64,";
    
        var image64 = b64Start + svg64;
        const image = new Image();
    
        image.src = image64;
        image.onload = () => {
          ctx.rect(0, 0, imageWidth, imageHeight);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
          linkRef.current.href = canvasRef.current.toDataURL();
          linkRef.current.download = "chart.png";
        };
      }, [svgRef, projectionData, xTicks]);

      // Clear the tooltip marker and lines when the user navigates back a page
      useEffect(() => {
        if (activePageIndex === 4) {
            setHorizLineData([{x:0, y:0}, {x:0, y:0}]);
            setVertLineData([{x:0, y:0}, {x:0, y:0}]);
            setCurrentPointData([{x:0, y:0}])    
        }
    }, [activePageIndex]);

  return (
    <div>
        <div className='graph-page-container'>
            <div className='graph-page'>
                <div className='graph-header'>Finally, let's forecast your health journey.</div>
                { !!projectionData && !!xTicks &&
                    <div className='victory-container'>
                        <VictoryChart 
                            theme={VictoryTheme.material}
                            padding={isMobile? { top: 15, bottom: 60, left: 60, right: 20 } : { top: 15, bottom: 65, left: 55, right: 20 }}
                            containerComponent={ 
                                <VictoryVoronoiContainer 
                                    onActivated={points => updateTooltipAxes(points[0])}
                                    labels={({datum}) => `${getDateFromTickValue(datum.x)} (Day ${datum.x+1})\n- ${datum.y.toFixed(1)}${useMetricSystem ? 'kg' : 'lbs'} -`}
                                    labelComponent={
                                        <VictoryTooltip
                                            flyoutStyle={{stroke:'', fill:'rgba(0, 0, 0, 0.7)'}}
                                            flyoutPadding={{top:5, bottom:5, left:10, right:10}}
                                            cornerRadius={12}
                                            style={{fill: 'rgb(220, 220, 220)'}}
                                            constrainToVisibleArea={true}
                                        />
                                    }    
                                    voronoiBlacklist={["vertLine", "horizLine", "mouseMarker", "endMarkers"]}
                                    containerRef={(ref) => {svgRef.current = ref}}
                                /> 
                            }
                            domain={{
                                x: [0, projectionData.xMax], 
                                y: [projectionData.yMin, projectionData.yMax]
                            }}
                            domainPadding={{x: 8, y:5}}
                            width={isMobile ? 440 : 580}
                            height={360}
                        >
                            <svg style={{ height: 0, width: 0}}>
                                <defs>
                                    <linearGradient 
                                        id="myGradient" 
                                        x1={isWeightGain() ? '1%' : '100%'} 
                                        y1="1%" 
                                        x2={isWeightGain() ? '100%' : '1%'} 
                                        y2="100%">
                                        <stop offset="0%" stopColor="#88cb66"/>
                                        <stop offset="50%" stopColor="#88cb66"/>
                                        <stop offset="60%" stopColor="#bdea7a"/>
                                        <stop offset="100%" stopColor="white"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <VictoryArea
                                style={{
                                    data: { stroke: '#88cb66', strokeWidth: 2, fill:'url(#myGradient)', fillOpacity: 0.75 },
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
                                label="Date"
                                style={{
                                    axis: {stroke: 'black'},
                                    axisLabel: {fontSize: 12, padding: 40},
                                    grid: {stroke: "#6e6e6e", strokeWidth: 0.3},
                                    ticks: {stroke: "black", size: 5},
                                    tickLabels: {fontSize: 10, angle: 45, transform: 'translate(15, 4)'}
                                }}
                                standalone={false}
                            />
                            <VictoryAxis dependentAxis crossAxis
                                width={580}
                                height={360}
                                tickCount={7}
                                theme={VictoryTheme.material}
                                standalone={false}
                                label={`Weight (${useMetricSystem ? 'kg' : 'lbs'})`}
                                style={{
                                    axis: {stroke: 'black'},
                                    axisLabel: {fontSize: 12, padding: 30},
                                    grid: {stroke: ({ tick }) => tick > projectionData.yMin ? "#6e6e6e" : "black", strokeWidth: 0.3},
                                    ticks: {stroke: "black", size: 5},
                                    tickLabels: {fontSize: 10, padding: 5}
                                }}
                            />
                            <VictoryLine
                                name="horizLine"
                                data={horizLineData}  
                                style={{
                                    data: { stroke: "rgba(0, 0, 0, 0.7)", strokeWidth: 0.5}
                                }}
                            />
                            <VictoryLine
                                name="vertLine"
                                data={vertLineData}    
                                style={{
                                    data: { stroke: "rgba(0, 0, 0, 0.7)", strokeWidth: 0.5}
                                }}
                            />
                            <VictoryScatter 
                                name="mouseMarker"
                                data={currentPointData}
                                size={5}
                                style={{ data: { fill: "#88cb66" } }}
                            />
                            <VictoryScatter 
                                name="endMarkers"
                                data={[{x:0, y:projectionData.xy[0].y}, {x:projectionData.xMax-1, y:projectionData.xy[projectionData.xMax-1].y}]}
                                size={5}
                                style={{ data: { fill: "#88cb66" } }}
                            />
                        </VictoryChart> 
                    </div>
                }
                <div className='export-container'>
                    <canvas ref={canvasRef} style={{display: 'none'}}/>
                    <TextButton 
                        text='Export to JPEG' 
                        innerRef={linkRef} 
                        href='chart.png' 
                        icon='fa-solid fa-file-image' 
                        color='#bdea7a'
                        pageIndex={5}
                        activePageIndex={activePageIndex}
                    />
                    <TextButton 
                        text='Export to CSV' 
                        icon='fa-solid fa-file-csv' 
                        color='#bdea7a' 
                        callback={exportToCsv}
                        pageIndex={5}
                        activePageIndex={activePageIndex}
                    />
                </div>
            </div>
        </div>
        <div className='graph-page-spacer'/>
    </div>
  )
}

export default GraphPage