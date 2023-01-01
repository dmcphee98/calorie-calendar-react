import React from 'react';
import './ProjectionStats.css';

const ProjectionStats = ( { name, value, icon }) => {
  return (
    <div className='stat-container'>
        <div className='stat-icon-container'>
            <i className={`stat-icon ${icon}`}/>
        </div>
        <div className='stat-title'>
            {name}
        </div>
        <div className='stat-content'>
            {value}
        </div>
  </div>
)
}

export default ProjectionStats