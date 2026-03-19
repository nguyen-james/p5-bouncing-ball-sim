import p5 from "p5";
import { ball } from "./ball";

export function createSketch(parentEl, paramsRef) {
  const canvasHeight = Math.min(window.innerHeight, 450);
  const canvasWidth = Math.min(400, window.innerWidth);

  const outerRingDiameter = canvasWidth * 0.9;
  const outerRingRadius = outerRingDiameter / 2;

  const ringCenterX = canvasWidth / 2;
  const ringCenterY = canvasHeight / 2;

  // Keep your existing simulation scaling similar to the old fixed `gravityConstant`.
  const gravityScale = 0.1;

  function resolveOuterRingCollision(c) {
    const r = c.diameter / 2;
    const dx = c.x - ringCenterX;
    const dy = c.y - ringCenterY;
    const dist = Math.hypot(dx, dy);

    // If the ball is completely inside the ring, no collision to resolve.
    if (dist + r <= outerRingRadius) return;

    // Collision normal (ring center -> ball center).
    const nx = dist === 0 ? 1 : dx / dist;
    const ny = dist === 0 ? 0 : dy / dist;

    // Push the ball back inside the ring.
    c.x = ringCenterX + nx * (outerRingRadius - r);
    c.y = ringCenterY + ny * (outerRingRadius - r);

    // Reflect velocity if moving outward along the normal.
    const vDotN = c.velocityX * nx + c.velocityY * ny;
    if (vDotN > 0) {
      c.velocityX -= 2 * vDotN * nx;
      c.velocityY -= 2 * vDotN * ny;
    }
  }

  const sketch = (p) => {
    let balls = [];
    let lastBallSize = Number(paramsRef?.current?.ballSize ?? 10);
    let lastResetToken = Number(paramsRef?.current?.resetToken ?? 0);

    p.setup = () => {
      p.createCanvas(canvasWidth, canvasHeight).parent(parentEl);
      p.background(0);

      balls = [new ball(ringCenterX, ringCenterY, lastBallSize)];
    };

    p.draw = () => {
      const params = paramsRef?.current ?? {};
      const gravity = Number(params.gravity ?? 1);
      const ballSize = Number(params.ballSize ?? lastBallSize);
      const paused = Boolean(params.paused);
      const trail = Boolean(params.hasTrail);
      const resetToken = Number(params.resetToken ?? 0);

      // React-triggered reset: rebuild the ball list from scratch.
      if (resetToken !== lastResetToken) {
        balls = [new ball(ringCenterX, ringCenterY, ballSize)];
        lastBallSize = ballSize;
        lastResetToken = resetToken;
      }

      // Resize existing balls when `ballSize` changes.
      if (ballSize !== lastBallSize && balls.length) {
        balls.forEach((b) => {
          b.diameter = ballSize;
        });
        lastBallSize = ballSize;
      }

      // Reset the drawing.
      if (trail) p.background(0, 20);
      else p.background(0);

      // Draw the outer ring.
      p.noFill();
      p.stroke(255, 0, 0);
      p.strokeWeight(2);
      p.circle(ringCenterX, ringCenterY, outerRingDiameter);

      // Draw balls.
      p.fill("blue");
      p.noStroke();

      balls.forEach((c) => {
        if (!paused) {
          c.applyGravity(gravity * gravityScale);
          c.updatePosition();
          resolveOuterRingCollision(c);
        }

        p.circle(c.x, c.y, c.diameter);
      });
    };
  };

  return new p5(sketch, parentEl);
}

