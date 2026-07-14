function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, Math.floor(rect.width * dpr));
  canvas.height = Math.max(220, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: canvas.width / dpr, height: canvas.height / dpr };
}

function drawGrid(ctx, width, height, padding) {
  ctx.strokeStyle = "rgba(190, 232, 255, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + ((height - padding.top - padding.bottom) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
}

function label(ctx, text, x, y, color = "rgba(239, 248, 255, 0.78)", align = "center") {
  ctx.fillStyle = color;
  ctx.font = "600 12px Inter, sans-serif";
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

export function drawBarChart(canvas, rows, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  const padding = { top: 26, right: 24, bottom: 52, left: 48 };
  const maxValue = Math.max(...rows.map((row) => row.value), 1);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = Math.min(74, chartWidth / rows.length - 22);

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height, padding);

  rows.forEach((row, index) => {
    const x = padding.left + (chartWidth * (index + 0.5)) / rows.length;
    const barHeight = (row.value / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, padding.top + chartHeight);
    gradient.addColorStop(0, row.color || "#69f0ff");
    gradient.addColorStop(1, "rgba(105, 240, 255, 0.18)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, y, barWidth, barHeight, 8);
    ctx.fill();

    label(ctx, options.formatValue ? options.formatValue(row.value) : row.value.toFixed(0), x, y - 8, "#f4fbff");
    label(ctx, row.label, x, height - 24);
  });
}

export function drawEfficiencyChart(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas);
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const radius = Math.min(width, height) * 0.28;
  let start = -Math.PI / 2;
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 26;
  ctx.lineCap = "round";

  rows.forEach((row) => {
    const angle = (row.value / total) * Math.PI * 2;
    ctx.strokeStyle = row.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, start, start + angle - 0.04);
    ctx.stroke();
    start += angle;
  });

  ctx.fillStyle = "rgba(8, 20, 28, 0.92)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 21, 0, Math.PI * 2);
  ctx.fill();

  label(ctx, "redução", centerX, centerY - 4, "rgba(239, 248, 255, 0.66)");
  label(ctx, rows[2] ? `${rows[2].value.toFixed(2)}%` : "0%", centerX, centerY + 16, "#f4fbff");

  rows.forEach((row, index) => {
    const x = 30;
    const y = 28 + index * 24;
    ctx.fillStyle = row.color;
    ctx.beginPath();
    ctx.roundRect(x, y - 9, 18, 8, 4);
    ctx.fill();
    label(ctx, `${row.label} · ${row.value.toFixed(2)}%`, x + 28, y, "rgba(239, 248, 255, 0.78)", "left");
  });
}