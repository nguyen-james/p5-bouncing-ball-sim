import p5 from "p5";
import { ball } from "./ball";
import { resolveBallBallCollision, resolveOuterRingCollision } from "./collisionHandler";


export function createSketch(parentEl, paramsRef) {

  const canvasHeight = Math.min(window.innerHeight, 450);
  const canvasWidth = Math.min(400, window.innerWidth);

  const outerRingDiameter = canvasWidth * 0.9;
  const outerRingRadius = outerRingDiameter / 2;

  const ringCenterX = canvasWidth / 2;
  const ringCenterY = canvasHeight / 2;

  const MAX_BALLS = 80;

  // Keep your existing simulation scaling similar to the old fixed `gravityConstant`.
  const gravityScale = 0.1;

  

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
      const duplicate = Boolean(params.duplicate);
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

      const pendingBalls = [];

      if (!paused) {
        // Integrate motion.
        balls.forEach((c) => {
          c.applyGravity(gravity * gravityScale);
          c.updatePosition();
        });

        // Outer ring collisions + optional duplication.
        balls.forEach((c) => {
          const ring = resolveOuterRingCollision(
            c,
            outerRingRadius,
            ringCenterX,
            ringCenterY
          );
          if (
            duplicate &&
            ring.didCollide &&
            balls.length + pendingBalls.length < MAX_BALLS
          ) {
            const b = new ball(c.x, c.y, c.diameter);
            // Spawn with a velocity slightly nudged along the collision normal.
            b.updateVelocity(
              (c.velocityX + ring.nx * 0.5),
              (c.velocityY + ring.ny * 0.5)
            );
            pendingBalls.push(b);
          }
        });

        // Ball-ball collisions + optional duplication.
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i];
            const b = balls[j];
            const res = resolveBallBallCollision(a, b);

            if (
              duplicate &&
              res.didBounce &&
              balls.length + pendingBalls.length < MAX_BALLS
            ) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const spawnX = mx + res.nx * (a.diameter / 4);
              const spawnY = my + res.ny * (a.diameter / 4);

              const child = new ball(spawnX, spawnY, a.diameter);
              child.updateVelocity(
                (a.velocityX + b.velocityX) / 2 + res.nx * 0.5,
                (a.velocityY + b.velocityY) / 2 + res.ny * 0.5
              );
              pendingBalls.push(child);
            }
          }
        }
      }

      if (pendingBalls.length) {
        balls = balls.concat(pendingBalls);
      }

      // Draw after physics/collisions.
      balls.forEach((c) => {
        p.circle(c.x, c.y, c.diameter);
      });
    };
  };

  return new p5(sketch, parentEl);
}

