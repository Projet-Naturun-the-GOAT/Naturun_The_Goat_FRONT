
const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");


const WIDTH = canvas.width;
const HEIGHT = canvas.height;


const COLS = 30;  
const ROWS = 18;  
const CELL_W = Math.floor(WIDTH / COLS);
const CELL_H = Math.floor(HEIGHT / ROWS);


const GRID_BG = "rgba(0,0,0,0.18)";
const LINE = "rgba(255,255,255,0.25)";
const AXIS = "rgba(255,255,255,0.45)";


function drawGrid() {
  
  ctx.fillStyle = GRID_BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.lineWidth = 1;

  
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.strokeStyle = (c % 5 === 0) ? AXIS : LINE;
    const x = c * CELL_W + 0.5; 
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }

  
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.strokeStyle = (r % 5 === 0) ? AXIS : LINE;
    const y = r * CELL_H + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);
}

drawGrid();
