export class Grid {
  constructor(canvas, { cols = 23, rows = 23, palette = {} } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cols = cols;
    this.rows = rows;
    this.cellW = canvas.width / cols;
    this.cellH = canvas.height / rows;

    this.palette = {
      bg: "#0b0b1a",          // fond sombre légèrement bleu
      wall: "rgba(0,200,255,0.3)",  // murs bleu clair translucide
      agent: "#00f0ff",       // agent bleu néon
      goal: "#00ff90",        // sortie verte néon
      ...palette,
    };
  }

  drawGrid() {
    const { ctx, canvas, palette } = this;
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  fromMatrix(matrix) {
    const { ctx, cellW, cellH, palette } = this;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[0].length; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillStyle = palette.wall;
          ctx.shadowColor = "rgba(0,200,255,0.4)";
          ctx.shadowBlur = 8;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }
    ctx.shadowBlur = 0; // reset
  }

  drawAgent(pos) {
    const { ctx, cellW, cellH, palette } = this;
    ctx.fillStyle = palette.agent;
    ctx.shadowColor = palette.agent;
    ctx.shadowBlur = 12;
    ctx.fillRect(pos[1] * cellW, pos[0] * cellH, cellW, cellH);
    ctx.shadowBlur = 0;
  }

  drawGoal(pos) {
    const { ctx, cellW, cellH, palette } = this;
    ctx.fillStyle = palette.goal;
    ctx.shadowColor = palette.goal;
    ctx.shadowBlur = 12;
    ctx.fillRect(pos[1] * cellW, pos[0] * cellH, cellW, cellH);
    ctx.shadowBlur = 0;
  }
}
