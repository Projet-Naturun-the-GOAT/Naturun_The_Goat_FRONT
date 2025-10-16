
export class Grid {
  constructor(canvas, { cols = 31, rows = 31, palette = {} } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cols = cols;
    this.rows = rows;
    this.cellW = Math.floor(canvas.width / cols);
    this.cellH = Math.floor(canvas.height / rows);
    this.palette = {
      bg: "rgba(0,0,0,0.18)",
      line: "rgba(255,255,255,0.25)",
      axis: "rgba(255,255,255,0.45)",
      border: "rgba(255,255,255,0.35)",
      ...palette,
    };
  }

  draw() {
    const { ctx, canvas, cols, rows, cellW, cellH, palette } = this;
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.strokeStyle = c % 5 === 0 ? palette.axis : palette.line;
      const x = c * cellW + 0.5;
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.strokeStyle = r % 5 === 0 ? palette.axis : palette.line;
      const y = r * cellH + 0.5;
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  }

  pixelToCell(x, y) {
    return { c: Math.floor(x / this.cellW), r: Math.floor(y / this.cellH) };
  }

  toMatrix(defaultValue = 0) {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(defaultValue));
  }

  fromMatrix(matrix, fillColor = "rgba(255,0,0,0.3)") {
    const { ctx, cellW, cellH } = this;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[0].length; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillStyle = fillColor;
          ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
        }
      }
    }
  }
}
