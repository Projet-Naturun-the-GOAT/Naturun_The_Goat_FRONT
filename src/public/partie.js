

import { Grid } from "./grid.js";

const BASE_URL = "http://127.0.0.1:8000";

// --- DOM ---
const canvas = document.getElementById("maze");
const statusSpan = document.getElementById("solo-status");
const stepsSpan = document.getElementById("solo-steps");
const lastMoveSpan = document.getElementById("solo-lastmove");
//const movesList = document.getElementById("moves-list");
const btnReset = document.getElementById("btn-reset");

// --- Etat de jeu ---
let mazeData = [];        
let playerPos = [1, 1];   
let goalPos = [21, 21];   
let steps = 0;
//let moves = [];
let isDone = false;

// --- Grid renderer (canvas) ---
const grid = new Grid(canvas); 
                              

async function fetchMazeFromBack() {
  // Sert à répondre à : "Récupérer la partie depuis le back"
  // Le back renvoie une grille aléatoire (générée via generate_maze)
  const res = await fetch(`${BASE_URL}/maze`);
  if (!res.ok) throw new Error("Impossible de récupérer /maze depuis le back");
  const data = await res.json();

  mazeData = data.maze;
  playerPos = data.agent; // départ (normalement [1,1])
  goalPos = [mazeData.length - 2, mazeData[0].length - 2];

  steps = 0;
  //moves = [];
  isDone = false;

  updateUI("-", "Prêt");
  render();
}

function render() {
  // Sert à afficher la grille + joueur + objectif
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
  // Sert à : "Mouvement avec flèches directionnelles ou ZQSD"
  // On normalise vers 4 actions : up/down/left/right
  const k = key.toLowerCase();
  if (k === "arrowup" || k === "z") return "up";
  if (k === "arrowdown" || k === "s") return "down";
  if (k === "arrowleft" || k === "q") return "left";
  if (k === "arrowright" || k === "d") return "right";
  return null;
}

function tryMove(action) {
  // Sert à appliquer un déplacement en respectant murs/limites
  if (isDone) return; // si gagné, on bloque les moves

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
  //moves.push(action);

  // win ?
  if (nr === goalPos[0] && nc === goalPos[1]) {
    isDone = true;
    updateUI(action, `🏆 Gagné en ${steps} pas !`);
  } else {
    updateUI(action, "En jeu...");
  }

  render();
}

function onKeyDown(e) {
  const action = keyToAction(e.key);
  if (!action) return;

  // évite que les flèches fassent scroller la page
  e.preventDefault();

  tryMove(action);
}

async function resetGame() {
  
  const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Impossible de reset via /reset");

  const data = await res.json();
  playerPos = data.agent; // redevient (1,1)
  steps = 0;
  isDone = false;

  updateUI("-", "Prêt");
  render();
}


document.addEventListener("DOMContentLoaded", async () => {
  document.addEventListener("keydown", onKeyDown);

if (btnReset) {
  btnReset.addEventListener("click", () => {
    resetGame().catch((err) => {
      console.error(err);
      updateUI("-", "Erreur reset");
    });
  });
}


  try {
    await fetchMazeFromBack();
  } catch (err) {
    console.error(err);
    updateUI("-", "Back inaccessible (lance le serveur)");
  }
});
