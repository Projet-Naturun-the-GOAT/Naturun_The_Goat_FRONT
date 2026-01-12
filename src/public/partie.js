import { Grid } from "./grid.js";

const BASE_URL = "http://localhost:8000"; // J'ai remis localhost pour être sûr avec Docker

// --- DOM ---
const canvas = document.getElementById("maze");
const statusSpan = document.getElementById("solo-status");
const stepsSpan = document.getElementById("solo-steps");
const lastMoveSpan = document.getElementById("solo-lastmove");
const btnReset = document.getElementById("btn-reset");

// --- DOM Configuration (Nouveau) ---
const widthInput = document.getElementById("maze-width");
const heightInput = document.getElementById("maze-height");
const seedInput = document.getElementById("maze-seed");
const btnConfigure = document.getElementById("btn-configure");

// --- Etat de jeu ---
let mazeData = [];
let playerPos = [1, 1];
let goalPos = [21, 21];
let steps = 0;
let isDone = false;

// --- Grid renderer (canvas) ---
const grid = new Grid(canvas);

async function fetchMazeFromBack() {
  // Récupère la grille initiale
  const res = await fetch(`${BASE_URL}/maze`);
  if (!res.ok) throw new Error("Impossible de récupérer /maze depuis le back");
  const data = await res.json();

  updateGameStateFromData(data);
}

// --- Nouvelle fonction de configuration ---
async function configureMaze() {
  const width = parseInt(widthInput?.value, 10);
  const height = parseInt(heightInput?.value, 10);
  const seedRaw = seedInput?.value?.trim();

  // Validation basique côté front
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 5 || height < 5) {
    if (statusSpan) statusSpan.innerText = "Dimensions invalides (min 5x5)";
    return;
  }

  const payload = { width, height };
  if (seedRaw) payload.seed = Number(seedRaw);

  if (statusSpan) statusSpan.innerText = "Génération de la grille...";

  try {
    const res = await fetch(`${BASE_URL}/configure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur configuration back");

    const data = await res.json();
    updateGameStateFromData(data); // On met à jour le jeu avec la nouvelle grille

    // Petit focus sur le canvas pour pouvoir jouer direct sans recliquer
    canvas.focus(); 

  } catch (error) {
    console.error("Erreur configuration:", error);
    if (statusSpan) statusSpan.innerText = "Erreur configuration";
  }
}

// Fonction utilitaire pour mettre à jour les variables du jeu quand on reçoit une grille (init ou config)
function updateGameStateFromData(data) {
  mazeData = data.maze;
  playerPos = data.agent; // départ
  
  // Calcul dynamique de l'objectif (toujours en bas à droite)
  goalPos = [mazeData.length - 2, mazeData[0].length - 2];

  // Important : On dit à la grille de recalculer la taille des cases
  if (data.width && data.height) {
      grid.setDimensions(data.width, data.height);
  } else if (mazeData.length && mazeData[0].length) {
      grid.setDimensions(mazeData[0].length, mazeData.length);
  }

  // Reset des stats
  steps = 0;
  isDone = false;

  // Reset feu d'artifice s'il est là
  const fireworks = document.querySelector('.fireworks-overlay');
  if (fireworks) fireworks.classList.remove('active');

  updateUI("-", "Prêt");
  render();
}

function render() {
  grid.drawGrid();
  grid.fromMatrix(mazeData);
  grid.drawGoal(goalPos);
  grid.drawAgent(playerPos);
}

function updateUI(lastMove, statusText) {
  if (statusSpan) statusSpan.innerText = statusText;
  if (stepsSpan) stepsSpan.innerText = String(steps);
  if (lastMoveSpan) lastMoveSpan.innerText = lastMove ?? "-";
}

function keyToAction(key) {
  const k = key.toLowerCase();
  if (k === "arrowup" || k === "z") return "up";
  if (k === "arrowdown" || k === "s") return "down";
  if (k === "arrowleft" || k === "q") return "left";
  if (k === "arrowright" || k === "d") return "right";
  return null;
}

function tryMove(action) {
  if (isDone) return;

  const [r, c] = playerPos;
  let nr = r;
  let nc = c;

  if (action === "up") nr -= 1;
  if (action === "down") nr += 1;
  if (action === "left") nc -= 1;
  if (action === "right") nc += 1;

  // limites
  if (nr < 0 || nc < 0 || nr >= mazeData.length || nc >= mazeData[0].length) {
    return;
  }

  // mur
  if (mazeData[nr][nc] === 1) {
    return;
  }

  // move valide
  playerPos = [nr, nc];
  steps += 1;

  // win ?
  if (nr === goalPos[0] && nc === goalPos[1]) {
    isDone = true;
    updateUI(action, `🏆 Gagné en ${steps} pas !`);
    
    // Déclenchement du feu d'artifice
    const fireworks = document.querySelector('.fireworks-overlay');
    if (fireworks) {
        fireworks.classList.add('active');
        setTimeout(() => fireworks.classList.remove('active'), 5000);
    }

  } else {
    updateUI(action, "En jeu...");
  }

  render();
}

function onKeyDown(e) {
  // Empêche le scroll si on appuie sur les flèches
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }

  const action = keyToAction(e.key);
  if (!action) return;

  tryMove(action);
}

async function resetGame() {
  try {
      const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
      if (!res.ok) throw new Error("Impossible de reset via /reset");

      const data = await res.json();
      
      // On reset juste la position, pas besoin de redimensionner la grille
      playerPos = data.agent; 
      steps = 0;
      isDone = false;
      
      // Reset feu d'artifice
      const fireworks = document.querySelector('.fireworks-overlay');
      if (fireworks) fireworks.classList.remove('active');

      updateUI("-", "Prêt");
      render();
  } catch (err) {
      console.error(err);
      updateUI("-", "Erreur reset");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  document.addEventListener("keydown", onKeyDown);

  if (btnReset) {
    btnReset.addEventListener("click", resetGame);
  }

  // Ajout de l'écouteur sur le bouton de configuration
  if (btnConfigure) {
    btnConfigure.addEventListener("click", configureMaze);
  }

  try {
    await fetchMazeFromBack();
  } catch (err) {
    console.error(err);
    updateUI("-", "Back inaccessible");
  }
});