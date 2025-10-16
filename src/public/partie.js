// partie.js — grille pour /partie (aucun backend)
import { Grid } from "./grid.js";

const canvas = document.getElementById("maze");
const grid = new Grid(canvas, {
  cols: 31,
  rows: 31,
  palette: {
    bg: "rgba(255,245,230,0.1)",
    line: "rgba(255,215,0,0.3)",
    axis: "rgba(255,215,0,0.55)",
    border: "rgba(255,215,0,0.5)",
  },
});
grid.draw();


