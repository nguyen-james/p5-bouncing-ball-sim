export function resolveOuterRingCollision(ball, outerRingRadius, ringCenterX, ringCenterY) {
  const radius = ball.diameter / 2;
  const dx = ball.x - ringCenterX;
  const dy = ball.y - ringCenterY;
  const dist = Math.hypot(dx, dy);

  const didCollide = dist + radius > outerRingRadius;
  if (!didCollide) return { didCollide: false, didBounce: false, nx: 0, ny: 0 };

  const nx = dist === 0 ? 1 : dx / dist;
  const ny = dist === 0 ? 0 : dy / dist;

  // Pull center back exactly to boundary (minus tiny epsilon to avoid re-hit jitter).
  const epsilon = 0.01;
  const targetDist = outerRingRadius - radius - epsilon;
  ball.x = ringCenterX + nx * targetDist;
  ball.y = ringCenterY + ny * targetDist;

  // Reflect only if moving outward.
  const vDotN = ball.velocityX * nx + ball.velocityY * ny;
  let didBounce = false;
  if (vDotN > 0) {
    ball.velocityX -= 2 * vDotN * nx;
    ball.velocityY -= 2 * vDotN * ny;
    didBounce = true;
  }

  return { didCollide, didBounce, nx, ny };
}

// Resolve circle-circle collision (equal mass, elastic on normal component).
export function resolveBallBallCollision(ballA, ballB) {
  const radiusA = ballA.diameter / 2;
  const radiusB = ballB.diameter / 2;
  const minDist = radiusA + radiusB;

  let dx = ballB.x - ballA.x;
  let dy = ballB.y - ballA.y;
  let dist = Math.hypot(dx, dy);

  if (dist >= minDist) return { didCollide: false, didBounce: false, nx: 0, ny: 0 };

  if (dist === 0) {
    dx = 1;
    dy = 0;
    dist = 1;
  }

  const nx = dx / dist;
  const ny = dy / dist;

  // Strong positional correction so circles never remain overlapped.
  const overlap = minDist - dist;
  const epsilon = 0.03;
  const separation = overlap + epsilon;
  ballA.x -= nx * (separation / 2);
  ballA.y -= ny * (separation / 2);
  ballB.x += nx * (separation / 2);
  ballB.y += ny * (separation / 2);

  // Relative velocity (B - A) along the normal.
  const rvx = ballB.velocityX - ballA.velocityX;
  const rvy = ballB.velocityY - ballA.velocityY;
  const velAlongNormal = rvx * nx + rvy * ny;

  let didBounce = false;
  // Bounce only when approaching each other.
  if (velAlongNormal < 0) {
    // Equal masses, restitution = 1.
    const impulse = -velAlongNormal;
    ballA.velocityX -= impulse * nx;
    ballA.velocityY -= impulse * ny;
    ballB.velocityX += impulse * nx;
    ballB.velocityY += impulse * ny;
    didBounce = true;
  }

  return { didCollide: true, didBounce, nx, ny };
}