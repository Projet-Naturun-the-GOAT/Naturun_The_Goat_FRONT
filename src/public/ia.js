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
const widthInput = document.getElementById("maze-width");
const heightInput = document.getElementById("maze-height");
const seedInput = document.getElementById("maze-seed");

let btnIA = null;
let btnReset = null;
let btnConfigure = null;

async function fetchMaze() {
  const res = await fetch(`${BASE_URL}/maze`);
  const data = await res.json();
  mazeData = data.maze;
  agentPos = data.agent;
  if (mazeData.length && mazeData[0].length) {
    grid.setDimensions(mazeData[0].length, mazeData.length);
  }
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
      if (btnIA) btnIA.innerText = "Lancer l'IA";
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

async function configureMaze() {
  const width = parseInt(widthInput?.value, 10);
  const height = parseInt(heightInput?.value, 10);
  const seedRaw = seedInput?.value?.trim();

  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 5 || height < 5) {
    if (statusSpan) statusSpan.innerText = "Dimensions invalides";
    return;
  }

  const payload = { width, height };
  if (seedRaw) payload.seed = Number(seedRaw);

  isRunning = false;
  if (btnIA) btnIA.innerText = "Lancer l'IA";
  if (statusSpan) statusSpan.innerText = "Chargement...";

  try {
    const res = await fetch(`${BASE_URL}/configure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    mazeData = data.maze;
    agentPos = data.agent;
    if (data.width && data.height) {
      grid.setDimensions(data.width, data.height);
    } else if (mazeData.length && mazeData[0].length) {
      grid.setDimensions(mazeData[0].length, mazeData.length);
    }
    if (actionSpan) actionSpan.innerText = "-";
    if (stepsSpan) stepsSpan.innerText = "0";
    if (statusSpan) statusSpan.innerText = "Prêt";
    drawMaze();
  } catch (error) {
    console.error("Erreur configuration:", error);
    if (statusSpan) statusSpan.innerText = "Erreur configuration";
  }
}

function drawMaze() {
  grid.drawGrid();
  grid.fromMatrix(mazeData);
  grid.drawAgent(agentPos);
  grid.drawGoal([mazeData.length - 2, mazeData[0].length - 2]);
}

document.addEventListener("DOMContentLoaded", () => {
    btnIA = document.getElementById("btn-ia");
    btnReset = document.getElementById("btn-reset");
    btnConfigure = document.getElementById("btn-configure");

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

    if (btnConfigure) {
      btnConfigure.addEventListener("click", () => {
        configureMaze();
      });
    }
});

async function initPage() {
    await fetchMaze();   
    await resetAgent();  
}

initPage();
