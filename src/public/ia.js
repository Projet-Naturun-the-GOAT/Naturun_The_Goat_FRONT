import { Grid } from "./grid.js";

const canvas = document.getElementById("maze");
const grid = new Grid(canvas);

const BASE_URL = "http://127.0.0.1:8000"; // ton backend FastAPI
let mazeData = [];
let agentPos = [];

async function fetchMaze() {
  const res = await fetch(`${BASE_URL}/maze`);
  const data = await res.json();
  mazeData = data.maze;
  agentPos = data.agent;
  drawMaze();
}

async function moveAgent(direction) {
  const res = await fetch(`${BASE_URL}/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: direction }),
  });
  const data = await res.json();
  agentPos = data.agent;
  drawMaze();
}

async function resetAgent() {
  const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
  const data = await res.json();
  agentPos = data.agent;
  drawMaze();
}

function drawMaze() {
  grid.drawGrid();
  grid.fromMatrix(mazeData);
  grid.drawAgent(agentPos);
  grid.drawGoal([mazeData.length-2, mazeData[0].length-2]);
}

// Exemple de contrôle clavier
document.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault(); // bloque le scroll
  }

  if (e.key === "ArrowUp") moveAgent("up");
  if (e.key === "ArrowDown") moveAgent("down");
  if (e.key === "ArrowLeft") moveAgent("left");
  if (e.key === "ArrowRight") moveAgent("right");
  if (e.key === "r") resetAgent();
});

// Initialisation
fetchMaze();
