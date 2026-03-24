export class ball {
    
    // Coordinate Position (x, y), diameter of the ball
    constructor(x, y, diameter) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;

        this.velocityX = 0;
        this.velocityY = 1;
    }

    applyGravity(gravity) {
        this.velocityY += gravity;
    }

    updatePosition() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    updateVelocity(vx, vy) {
        this.velocityX = vx;
        this.velocityY = vy;
    }
}