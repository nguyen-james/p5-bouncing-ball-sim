import p5 from "p5";
import { ball } from "./ball";

const canvasHeight = Math.min(window.innerHeight, 450);
const canvasWidth = Math.min(400, window.innerWidth);

let gravityConstant = 0.1;
let circleDiameter = 10;
let splitOnBounce = false;
let trail = true;
let paused = false;
let circles = [new ball(canvasWidth/2, canvasHeight/2, circleDiameter)];


export const sketch = new p5((p) => {
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.background(0);
  };

  p.draw = () => {

    //Stop drawing if paused
    if(paused) {
      p.noLoop();
    } else {
      p.loop();
    }

    //reset the drawing
    if(trail) {
      p.background(0, 20);
    } else {
      p.background(0);
    }
     
  
    //Draw the outer ring
    p.noFill();
    p.stroke(255, 0, 0);
    p.strokeWeight(2);
    p.circle(canvasWidth/2, canvasHeight/2, canvasWidth * .9)
    
    //set up parameters for new circles
    p.fill("blue");
    p.noStroke();

     circles.forEach( c => {
        p.circle(
          //Ensure Ball Stays within canvas bounds
          c.x > canvasWidth ? canvasWidth-c.diameter/2: c.x,
          c.y > canvasHeight ? canvasHeight-c.diameter/2: c.y,
          c.diameter
        );
        c.applyGravity(gravityConstant);
        c.updatePosition();
    });
    
  };
});

