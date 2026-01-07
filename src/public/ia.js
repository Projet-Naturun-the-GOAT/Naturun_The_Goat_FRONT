import { Grid } from "./grid.js";

const canvas = document.getElementById("maze");
const grid = new Grid(canvas);

const BASE_URL = "http://127.0.0.1:8000"; 
let mazeData = [];
let agentPos = [];
let isRunning = false;

const actionSpan = document.getElementById("ia-action");
const statusSpan = document.getElementById("ia-status");
const stepsSpan = document.getElementById("ia-steps");

async function fetchMaze() {
  const res = await fetch(`${BASE_URL}/maze`);
  const data = await res.json();
  mazeData = data.maze;
  agentPos = data.agent;
  drawMaze();
}

// Fonction déclenchée au clic sur "Lancer l'IA"
async function startAI() {
  if (isRunning) {
    isRunning = false;
    statusSpan.innerText = "En pause";
    return;
  }

  statusSpan.innerText = "Calcul du chemin...";

  await fetch(`${BASE_URL}/train-fast`, { method: "POST" });
  
  isRunning = true;
  statusSpan.innerText = "IA en mouvement...";
  playAIStep();
}

async function playAIStep() {
  if (!isRunning) return;

  try {
    const res = await fetch(`${BASE_URL}/ai-step`, { method: "POST" });
    const data = await res.json();

    agentPos = data.agent;
    if (actionSpan) actionSpan.innerText = data.action;
    if (stepsSpan) stepsSpan.innerText = data.steps; 
    
    drawMaze();

    if (data.done) {
      isRunning = false;
      statusSpan.innerHTML = `🏆 Arrivé en <span class="neon-text">${data.steps}</span> pas !`;
      document.getElementById("btn-ia").innerText = "Lancer l'IA";
      return;
    }

    setTimeout(playAIStep, 200);
  } catch (error) {
    console.error("Erreur:", error);
    isRunning = false;
  }
}

async function resetAgent() {
  const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
  const data = await res.json();
  agentPos = data.agent;
  isRunning = false;
  if (statusSpan) statusSpan.innerText = "Prêt";
  if (actionSpan) actionSpan.innerText = "-";
  if (stepsSpan) stepsSpan.innerText = "0";
  drawMaze();
}

function drawMaze() {
  grid.drawGrid();
  grid.fromMatrix(mazeData);
  grid.drawAgent(agentPos);
  grid.drawGoal([mazeData.length - 2, mazeData[0].length - 2]);
}

document.addEventListener("DOMContentLoaded", () => {
    const btnIA = document.getElementById("btn-ia");
    const btnReset = document.getElementById("btn-reset");

    if(btnIA) {
        btnIA.addEventListener("click", () => {
            startAI();
            btnIA.innerText = isRunning ? "Pause IA" : "Lancer l'IA";
        });
    }

    if(btnReset) {
        btnReset.addEventListener("click", () => {
            resetAgent();
            if(btnIA) btnIA.innerText = "Lancer l'IA";
        });
    }
});

async function initPage() {
    await fetchMaze();   
    await resetAgent();  
}

initPage();