import p5 from "p5";
import { ball } from "./ball";
import { resolveBallBallCollision, resolveOuterRingCollision } from "./collisionHandler";
import { initBounceAudio, playBounceSound } from "./bounceAudio";



export function createSketch(parentEl, paramsRef) {
  
  const MAX_BALLS = 80;
  const gravityScale = 0.1;

  const sketch = (p) => {
    let balls = [];
    let lastBallSize = Number(paramsRef?.current?.ballSize ?? 10);
    let currentRadius = lastBallSize / 2;
    let lastResetToken = Number(paramsRef?.current?.resetToken ?? 0);
    let canvasPointerHandler = null;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let outerRingDiameter = 0;
    let outerRingRadius = 0;
    let ringCenterX = 0;
    let ringCenterY = 0;

    function updateDimensions() {
      canvasHeight = Math.min(window.innerHeight, 450);
      canvasWidth = Math.min(400, window.innerWidth);
      outerRingDiameter = canvasWidth * 0.9;
      outerRingRadius = outerRingDiameter / 2;
      ringCenterX = canvasWidth / 2;
      ringCenterY = canvasHeight / 2;
    }

    function addBallAt(clientX, clientY, canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      const x = (clientX - rect.left) * (canvasWidth / rect.width);
      const y = (clientY - rect.top) * (canvasHeight / rect.height);

      if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) return;
      if (balls.length >= MAX_BALLS) return;

      balls.push(new ball(x, y, currentRadius * 2));
    }

    p.setup = () => {
      updateDimensions();
      const canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent(parentEl);
      p.background(0);
      balls = [new ball(ringCenterX, ringCenterY, lastBallSize)];

      canvasPointerHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        void initBounceAudio();
        addBallAt(event.clientX, event.clientY, canvas.elt);
      };

      canvas.elt.addEventListener("pointerdown", canvasPointerHandler);
    };

    p.windowResized = () => {
      updateDimensions();
      p.resizeCanvas(canvasWidth, canvasHeight);
    };

    p.draw = () => {
      const params = paramsRef?.current ?? {};
      const gravity = Number(params.gravity ?? 1);
      const ballSize = Number(params.ballSize ?? lastBallSize);
      const paused = Boolean(params.paused);
      const trail = Boolean(params.hasTrail);
      const duplicate = Boolean(params.duplicate);
      const resetToken = Number(params.resetToken ?? 0);

      if (resetToken !== lastResetToken) {
        balls = [new ball(ringCenterX, ringCenterY, ballSize)];
        lastBallSize = ballSize;
        lastResetToken = resetToken;
      }

      if (ballSize !== lastBallSize && balls.length) {
        balls.forEach((b) => {
          b.diameter = ballSize;
        });
        lastBallSize = ballSize;
        currentRadius = ballSize / 2;
      }

      if (trail) p.background(0, 20);
      else p.background(0);

      p.noFill();
      p.stroke(255, 0, 0);
      p.strokeWeight(2);
      p.circle(ringCenterX, ringCenterY, outerRingDiameter);

      p.fill("blue");
      p.noStroke();

      const pendingBalls = [];

      if (!paused) {
        balls.forEach((c) => {
          c.applyGravity(gravity * gravityScale);
          c.updatePosition();
        });

        balls.forEach((c) => {
          const ring = resolveOuterRingCollision(
            c,
            outerRingRadius,
            ringCenterX,
            ringCenterY
          );

          if (ring.didBounce) {
            playBounceSound();
          }

          if (
            duplicate &&
            ring.didCollide &&
            balls.length + pendingBalls.length < MAX_BALLS
          ) {
            const b = new ball(c.x, c.y, c.diameter);
            b.updateVelocity(
              c.velocityX + ring.nx * 0.5,
              c.velocityY + ring.ny * 0.5
            );
            pendingBalls.push(b);
          }
        });

        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i];
            const b = balls[j];
            const res = resolveBallBallCollision(a, b);

            if (res.didBounce) {
              playBounceSound();
            }

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

      balls.forEach((c) => {
        p.circle(c.x, c.y, c.diameter);
      });
    };

    p.remove = ((originalRemove) => () => {
      if (canvasPointerHandler && p.canvas) {
        p.canvas.removeEventListener("pointerdown", canvasPointerHandler);
      }
      originalRemove.call(p);
    })(p.remove);
  };

  const next = new p5(sketch, parentEl);
  return next;
}