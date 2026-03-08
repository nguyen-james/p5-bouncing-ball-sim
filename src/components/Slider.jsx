import React from 'react'

export default function Slider({description, variable, setVariable}) {
  return (
    <>
        <label className='slider'>
            {description}
            <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
            />
            <input 
              className='sliderDisplay'
              type='number'
              min="1"
              max="100"
              step="1"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
            ></input>
        </label>
    
    </>
  )
}
