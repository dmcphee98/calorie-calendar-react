import React from 'react'
import { useState, useEffect } from 'react';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';
import NumInput from '../../Common/NumInput/NumInput';
import DateInput from '../../Common/DateInput/DateInput';
import './ProjectionForm.css';

const ProjectionForm = ({ traits, setTraits, callback }) => {

    const [goalWeight, setGoalWeight] = useState('');
    const [dailyCals, setDailyCals] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update traits
        setTraits({
            ...traits, 
            'goalWeight':goalWeight, 
            'startDate':startDate,
            'endDate':endDate,
            'dailyCals':dailyCals
        });   
      }

    return (
        <form className='TDEE-form' onSubmit={handleSubmit}>
            <NumInput number={goalWeight} setNumber={setGoalWeight} units='kg' description='Goal Weight'/>
            <DateInput number={startDate} setNumber={setStartDate} description='Start Date'/>
            <DateInput number={endDate} setNumber={setEndDate} description='End Date'/>
            <NumInput number={dailyCals} setNumber={setDailyCals} units='Cal' description='Daily Cals'/>
            <SubmitButton />
        </form>
    );
}

export default ProjectionForm