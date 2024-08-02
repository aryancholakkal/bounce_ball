// Let's make a fun game where we can control a circle and chase bouncing balls!

const para = document.querySelector('p'); // This shows how many balls are left
let ballCount = 0; // Keep track of the number of balls

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Make the canvas fill the whole window
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Function to get a random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Function to get a random color
function randomColor() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// A class for shapes, to give them a starting position and speed
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX; // Horizontal speed
    this.velY = velY; // Vertical speed
  }
}

// A class for the bouncing balls
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size; // The size of the ball
    this.exists = true; // Does this ball exist?
  }

  // Draw the ball on the canvas
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Update the ball's position and check if it hits the edges
  update() {
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
      this.velX = -this.velX; // Reverse horizontal direction
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.velY = -this.velY; // Reverse vertical direction
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Check for collisions with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomColor(); // Change colors if they hit
        }
      }
    }
  }
}

// A special character that the player controls: The EvilCircle!
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // The EvilCircle moves faster!
    this.color = 'white';
    this.size = 10;

    // Listen for key presses to move the EvilCircle
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'a':
          this.x -= this.velX; // Move left
          break;
        case 'd':
          this.x += this.velX; // Move right
          break;
        case 'w':
          this.y -= this.velY; // Move up
          break;
        case 's':
          this.y += this.velY; // Move down
          break;
      }
    });
  }

  // Draw the EvilCircle on the canvas
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Keep the EvilCircle within the canvas boundaries
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  // Check for collisions with balls and make them disappear
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // The EvilCircle catches the ball!
          ballCount--; // Decrease the ball count
          para.textContent = 'Ball count: ' + ballCount;
        }
      }
    }
  }
}

// Create an array to store all the balls
const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
  ballCount++;
  para.textContent = 'Ball count: ' + ballCount;
}

// Create the EvilCircle character
const evilCircle = new EvilCircle(random(0, width), random(0, height));

// The main loop that keeps the game running
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height); // Make the background slightly dark

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop); // Keep looping!
}

loop(); // Start the game loop
