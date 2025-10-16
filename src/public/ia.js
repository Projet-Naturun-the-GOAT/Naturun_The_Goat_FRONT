// ia.js — grille pour /ia (aucun backend)
import { Grid } from "./grid.js";

const canvas = document.getElementById("maze");
const grid = new Grid(canvas, {
  cols: 31,
  rows: 31,
  palette: {
    bg: "rgba(0,0,40,0.3)",
    line: "rgba(120,160,255,0.25)",
    axis: "rgba(120,160,255,0.5)",
    border: "rgba(120,160,255,0.6)",
  },
});
grid.draw();


