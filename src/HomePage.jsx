import React, { useState } from 'react'
import Slider from './components/slider';
import Checkbox from './components/Checkbox';

export default function HomePage() {
    
    
    const [gravity, setGravity] = useState(1);
    const [ballSize, setBallSize] = useState(10);
    const [paused, setPaused] = useState(true);
    const [hasTrail, setHasTrail] = useState(false);
    const [duplicate, setDuplicate] = useState(false);
   

  return (
    <div>
        <h2> Bouncing Ball Simulator</h2>

            <Slider description={"Gravity Strength:"} variable={gravity} setVariable={setGravity}/>
            <Slider description={"Initial Ball Size:"} variable={ballSize} setVariable={setBallSize}/>

            <div className='options-holder'>
                <Checkbox description={"Give the ball a trail?"} variable={hasTrail} setVariable={setHasTrail}/>
                <Checkbox description={"Split on bounce?"} variable={duplicate} setVariable={setDuplicate}/>
            </div>
            

        <button
            className='pause-button'
            onClick={() => setPaused(prev => !prev)}
        >
           { paused? <i className="fa-solid fa-play"></i>: <i className="fa-solid fa-pause"></i>  }
        </button>

    </div>
  )
}
