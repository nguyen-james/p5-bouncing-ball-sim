import p5 from "p5";

const canvasHeight = Math.min(window.innerHeight-200, 600);
const canvasWidth = Math.min(400, window.innerWidth);
let circles = [{x:canvasWidth/2, y:canvasHeight/2, d:10}];

export const sketch = new p5((p) => {
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasWidth );
  };

  p.draw = () => {
    p.background("#000000");
    circles.forEach( c => {
        p.circle(c.x, c.y, c.d);
    }); 
  };
});

