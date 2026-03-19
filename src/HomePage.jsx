import React, { useState } from 'react'
import Slider from './components/slider';
import Checkbox from './components/Checkbox';
import SketchCanvas from './components/SketchCanvas';

export default function HomePage() {
    
    
    const [gravity, setGravity] = useState(1);
    const [ballSize, setBallSize] = useState(10);
    const [paused, setPaused] = useState(true);
    const [hasTrail, setHasTrail] = useState(false);
    const [duplicate, setDuplicate] = useState(false);
    const [resetToken, setResetToken] = useState(0);

    const resetBalls = () => {
        setResetToken((t) => t + 1);
    };
   

  return (
    <div>
        <h2> Bouncing Ball Simulator</h2>

        <SketchCanvas
          gravity={gravity}
          ballSize={ballSize}
          paused={paused}
          hasTrail={hasTrail}
          duplicate={duplicate}
          resetToken={resetToken}
        />

            <Slider description={"Gravity Strength:"} variable={gravity} setVariable={setGravity}/>
            <Slider description={"Initial Ball Size:"} variable={ballSize} setVariable={setBallSize}/>

            <div className='options-holder'>
                <Checkbox description={"Give the ball a trail?"} variable={hasTrail} setVariable={setHasTrail}/>
                <Checkbox description={"Split on bounce?"} variable={duplicate} setVariable={setDuplicate}/>
            </div>
            

        <span>
            <button
                className='button'
                onClick={() => setPaused(prev => !prev)}
            >
            { paused? <i className="fa-solid fa-play"></i>: <i className="fa-solid fa-pause"></i>  }
            </button>

            <button
                className='button'
                onClick={() => resetBalls()}
            >
            <i className="fa-solid fa-arrow-rotate-left"></i> 
            </button>
        </span>
        

    </div>
  )
}
