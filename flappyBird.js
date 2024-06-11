const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas size
canvas.width = 480;
canvas.height = 640;

// Load images
const birdImg = new Image();
const bgImg = new Image();
const fgImg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

birdImg.src = 'bird.png';
bgImg.src = 'bg.png';
fgImg.src = 'fg.png';
pipeNorth.src = 'pipeNorth.png';
pipeSouth.src = 'pipeSouth.png';

let gap = 100;
let constant;

let bX = 50;
let bY = 150;
let birdSize = 20;

let gravity = 10.005;
let lift = -2.6;
let down = 2.6;
let velocity = 0;
let score = 0;
let pipeWidth = 50;
let pipeHeight = 300;

// Audio files
const fly = new Audio();
const scor = new Audio();

fly.src = 'fly.mp3';
scor.src = 'score.mp3';

// On mouse click or key down
document.addEventListener('keydown', moveUp);
document.addEventListener('keyup', moveDown);
document.addEventListener('click', moveUp);
document.addEventListener('mouseup', moveDown);

function moveUp() {
    velocity = lift;
    fly.play();
}

function moveDown() {
    velocity = down;
}

// Pipe coordinates
let pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};

// Draw images
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeHeight + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant, pipeWidth, pipeHeight);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight
            });
        }

        // Detect collision
        if (
            (bX + birdSize >= pipe[i].x && bX <= pipe[i].x + pipeWidth
            && (bY <= pipe[i].y + pipeHeight || bY + birdSize >= pipe[i].y + constant))
            || bY + birdSize >= canvas.height - fgImg.height
        ) {
            location.reload(); // Reload the page
        }

        // Score when the bird successfully passes between pipes
        if (pipe[i].x + pipeWidth === bX) {
            score++;
            scor.play();
        }
    }

    // Draw foreground
    ctx.drawImage(fgImg, 0, canvas.height - fgImg.height, canvas.width, fgImg.height);
    // Draw bird
    ctx.drawImage(birdImg, bX, bY, birdSize, birdSize);

    bY += velocity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();
