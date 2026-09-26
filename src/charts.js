/**
 * Simulador Hídrico Cidadão — Módulo de Gráficos (Canvas 2D Acessível)
 *
 * Gráficos nativos em Canvas 2D sem dependências externas.
 * Atende estritamente às diretrizes científicas:
 * - Valores independentes comparados por barras verticais e horizontais (NUNCA fatias de pizza/donut).
 * - Zero é exatamente zero (sem 0,01% artificial).
 * - Suporte dinâmico a temas Dark e Light.
 * - Renderização de alta densidade (Device Pixel Ratio).
 */

import { formatCompact, formatPercent } from "./mathEngine.js";

/**
 * Paleta de cores para gráficos sincronizada com temas
 */
function getChartColors(theme = "dark") {
  const isLight = theme === "light";
  return {
    isLight,
    text: isLight ? "#0f172a" : "#eff8ff",
    muted: isLight ? "#475569" : "#94a3b8",
    grid: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(239, 248, 255, 0.08)",
    border: isLight ? "rgba(15, 23, 42, 0.15)" : "rgba(239, 248, 255, 0.15)",
    bars: {
      none: isLight ? "#d97706" : "#f59e0b",
      sphere: isLight ? "#0284c7" : "#38bdf8",
      hex: isLight ? "#059669" : "#34d399",
      evapLoss: isLight ? "#ea580c" : "#fb923c",
      preserved: isLight ? "#0284c7" : "#38bdf8",
      coverage: isLight ? "#6366f1" : "#818cf8"
    }
  };
}

/**
 * Prepara o canvas para renderização nítida em telas HiDPI/Retina
 */
function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width || canvas.width));
  const height = Math.max(1, Math.floor(rect.height || canvas.height));

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { ctx, width, height, dpr };
}

/**
 * Desenha linhas de grade horizontais
 */
function drawGrid(ctx, width, height, padding, count = 4, gridColor = "rgba(255, 255, 255, 0.08)") {
  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const chartHeight = height - padding.top - padding.bottom;

  for (let i = 0; i <= count; i += 1) {
    const y = Math.round(padding.top + (chartHeight * i) / count) + 0.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Gráfico 1: Comparativo Volumétrico Anual (m³/ano)
 * Mostra barras pareadas: Perda Residual (V_com) vs Volume Preservado (V_preservado)
 */
export function drawVolumetricComparisonChart(canvas, comparisons, theme = "dark") {
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const colors = getChartColors(theme);

  const padding = { top: width < 540 ? 68 : 38, right: 16, bottom: 58, left: 86 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  // Determina valor máximo para escala
  const maxVolume = Math.max(...comparisons.map((c) => c.metrics.evaporationWithoutCoverM3), 1);
  drawGrid(ctx, width, height, padding, 4, colors.grid);

  // Eixo Y - Rótulos
  ctx.save();
  ctx.fillStyle = colors.muted;
  ctx.font = "500 11px Inter, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i += 1) {
    const val = maxVolume * (1 - i / 4);
    const y = padding.top + (chartHeight * i) / 4;
    ctx.fillText(formatCompact(val, "m³"), padding.left - 8, y);
  }
  ctx.restore();

  const numScenarios = comparisons.length;
  const groupWidth = chartWidth / numScenarios;
  const barWidth = Math.min(38, Math.max(16, (groupWidth - 36) / 2));

  comparisons.forEach((item, index) => {
    const groupCenterX = padding.left + groupWidth * (index + 0.5);
    const vCom = item.metrics.evaporationWithCoverM3;
    const vPres = item.metrics.preservedM3;

    const hCom = (vCom / maxVolume) * chartHeight;
    const hPres = (vPres / maxVolume) * chartHeight;

    const yCom = padding.top + chartHeight - hCom;
    const yPres = padding.top + chartHeight - hPres;

    const xCom = groupCenterX - barWidth - 3;
    const xPres = groupCenterX + 3;

    // Barra 1: Perda Residual (V_com)
    if (hCom > 0) {
      ctx.fillStyle = colors.bars.evapLoss;
      ctx.beginPath();
      ctx.roundRect(xCom, yCom, barWidth, hCom, [4, 4, 0, 0]);
      ctx.fill();

      // Valor no topo
      ctx.fillStyle = colors.text;
      ctx.font = "600 10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatCompact(vCom), xCom + barWidth, yCom - 6);
    }

    // Barra 2: Volume Preservado (V_preservado)
    if (hPres > 0) {
      ctx.fillStyle = colors.bars.preserved;
      ctx.beginPath();
      ctx.roundRect(xPres, yPres, barWidth, hPres, [4, 4, 0, 0]);
      ctx.fill();

      // Valor no topo
      ctx.fillStyle = colors.text;
      ctx.font = "600 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(formatCompact(vPres), xPres, yPres - 6);
    } else {
      // Zero é exatamente zero: traço na base
      ctx.fillStyle = colors.muted;
      ctx.font = "600 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("0", xPres + barWidth / 2, padding.top + chartHeight - 4);
    }

    // Rótulo do cenário abaixo do grupo
    ctx.fillStyle = colors.text;
    ctx.font = "600 12px Inter, sans-serif";
    ctx.textAlign = "center";
    item.cover.shortName.split(" ").forEach((word,i)=>ctx.fillText(word, groupCenterX, height-padding.bottom+18+i*14));
  });

  // Legenda no topo
  ctx.save();
  const legendY = 16;
  ctx.font = "500 11px Inter, sans-serif";
  ctx.textAlign = "left";

  // Item 1: Perda residual
  ctx.fillStyle = colors.bars.evapLoss;
  ctx.fillRect(width < 540 ? 8 : padding.left, legendY - 8, 12, 12);
  ctx.fillStyle = colors.text;
  ctx.fillText("Evaporação residual (m³/ano)", (width < 540 ? 8 : padding.left) + 18, legendY + 2);

  // Item 2: Preservado
  const offset2 = width < 540 ? 8 : padding.left + 200;
  const secondY = width < 540 ? legendY + 20 : legendY;
  ctx.fillStyle = colors.bars.preserved;
  ctx.fillRect(offset2, secondY - 8, 12, 12);
  ctx.fillStyle = colors.text;
  ctx.fillText("Volume preservado (m³/ano)", offset2 + 18, secondY + 2);
  ctx.restore();
}

/**
 * Gráfico 2: Comparativo de Eficiências Independentes (%)
 * Compara Redução Evaporativa vs Cobertura Superficial em barras independentes.
 * ZERO É ZERO (sem slices de donut).
 */
export function drawEfficiencyComparisonChart(canvas, comparisons, theme = "dark") {
  if (!canvas) return;
  const { ctx, width, height } = setupCanvas(canvas);
  const colors = getChartColors(theme);

  const padding = { top: width < 540 ? 68 : 38, right: 64, bottom: 42, left: 105 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  // Linhas verticais para 0%, 25%, 50%, 75%, 100%
  ctx.save();
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = colors.muted;
  ctx.font = "500 11px Inter, sans-serif";
  ctx.textAlign = "center";

  for (let i = 0; i <= 4; i += 1) {
    const pct = i * 25;
    const x = padding.left + (chartWidth * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();

    ctx.fillText(`${pct}%`, x, height - padding.bottom + 18);
  }
  ctx.restore();

  const numScenarios = comparisons.length;
  const rowHeight = chartHeight / numScenarios;
  const barHeight = Math.min(18, Math.max(10, rowHeight / 3));

  comparisons.forEach((item, index) => {
    const centerY = padding.top + rowHeight * (index + 0.5);
    const redPct = item.metrics.reductionFraction; // 0 a 1
    const covPct = item.metrics.surfaceCoverageFraction; // 0 a 1

    const yRed = centerY - barHeight - 2;
    const yCov = centerY + 2;

    const wRed = redPct * chartWidth;
    const wCov = covPct * chartWidth;

    // Rótulo da linha
    ctx.fillStyle = colors.text;
    ctx.font = "600 12px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const label = item.cover.shortName.split(" ");
    label.forEach((word, i) => ctx.fillText(word, padding.left - 12, centerY + (i - (label.length - 1) / 2) * 14));

    // Barra 1: Redução Evaporativa
    if (wRed > 0) {
      ctx.fillStyle = colors.bars.preserved;
      ctx.beginPath();
      ctx.roundRect(padding.left, yRed, wRed, barHeight, [0, 4, 4, 0]);
      ctx.fill();

      // Texto do percentual
      ctx.fillStyle = colors.text;
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(formatPercent(redPct), padding.left + wRed + 6, yRed + barHeight / 2);
    } else {
      // Exatamente zero
      ctx.fillStyle = colors.muted;
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("0,00%", padding.left + 6, yRed + barHeight / 2);
    }

    // Barra 2: Cobertura Superficial
    if (wCov > 0) {
      ctx.fillStyle = colors.bars.coverage;
      ctx.beginPath();
      ctx.roundRect(padding.left, yCov, wCov, barHeight, [0, 4, 4, 0]);
      ctx.fill();

      ctx.fillStyle = colors.text;
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(formatPercent(covPct), padding.left + wCov + 6, yCov + barHeight / 2);
    } else {
      ctx.fillStyle = colors.muted;
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("0,00%", padding.left + 6, yCov + barHeight / 2);
    }
  });

  // Legenda no topo
  ctx.save();
  const legendY = 16;
  ctx.font = "500 11px Inter, sans-serif";
  ctx.textAlign = "left";

  // Item 1: Redução evaporativa
  ctx.fillStyle = colors.bars.preserved;
  ctx.fillRect(width < 540 ? 8 : padding.left, legendY - 8, 12, 12);
  ctx.fillStyle = colors.text;
  ctx.fillText("Redução evaporativa", (width < 540 ? 8 : padding.left) + 18, legendY + 2);

  // Item 2: Cobertura de área
  const offset2 = width < 540 ? 8 : padding.left + 180;
  const secondY = width < 540 ? legendY + 20 : legendY;
  ctx.fillStyle = colors.bars.coverage;
  ctx.fillRect(offset2, secondY - 8, 12, 12);
  ctx.fillStyle = colors.text;
  ctx.fillText("Cobertura de área geométrica", offset2 + 18, secondY + 2);
  ctx.restore();
}
