import React from 'react';
import './ProjectionStats.css';

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

const ProjectionStats = ({ stats }) => {
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
        </div>
    )
}

export default ProjectionStats