import React from 'react'
import './DailyCalsResults.css'

const DailyCalsResults = ( displayDailyCals ) => {
  return (
    <div>
        Your daily allowance is <b>{Number(displayDailyCals).toFixed(0)}</b> cal.<br></br>
    </div>
    )
}

export default DailyCalsResults

/*
    {projectionComplete && isDeadlineMode && 
        <div>
        Your daily allowance is <b>{displayDailyCals.toFixed(0)}</b> cal.<br></br>
        </div>
    }
    {projectionComplete && isDeadlineMode && (deficitSeverity !== 'healthy') &&
        <div>
        This is a {deficitSeverity === 'unhealthy' ? 'potentially ' : ''}<b>{deficitSeverity}</b> deficit of {(traits.tdee - displayDailyCals).toFixed(0)} cal. <br></br>
        Please note that the recommended deficit for sustainable weight loss is 500 calories.<br></br>
        {deficitSeverity === 'severe' ? 'For deficits greater than 1000cal, please consult a medical professional.' : ''}
        </div>
    }
    {projectionComplete && isDeadlineMode && (deficitSeverity === 'healthy') &&
        <div>
        This is considered a <b>healthy</b> deficit of {(traits.tdee - displayDailyCals).toFixed(0)} cal. <br></br>
        </div>
    }
*/