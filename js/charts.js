/* ============================================
   SMCI Research — charts.js
   Chart.js configurations for all charts
   ============================================ */

// Global Chart.js defaults for dark theme
Chart.defaults.color = '#9ca3af';
Chart.defaults.borderColor = '#1f2937';
Chart.defaults.font.family = "'Inter', sans-serif";

// ============================================================
// 1. STOCK PRICE CHART (with MA overlays & news markers)
// ============================================================
let stockChart = null;

function generatePriceData(range) {
  // Generate representative SMCI price data based on range
  const data = [];
  const now = new Date('2026-03-19');

  let points, startDate, startPrice, endPrice;

  switch(range) {
    case '6m':
      points = 130;
      startDate = new Date('2025-09-19');
      startPrice = 42;
      endPrice = 30.79;
      break;
    case '1y':
      points = 250;
      startDate = new Date('2025-03-19');
      startPrice = 52;
      endPrice = 30.79;
      break;
    case '2y':
      points = 500;
      startDate = new Date('2024-03-19');
      startPrice = 105;
      endPrice = 30.79;
      break;
    case 'max':
    default:
      points = 750;
      startDate = new Date('2023-03-19');
      startPrice = 95;
      endPrice = 30.79;
      break;
  }

  // Generate prices with volatility
  let price = startPrice;
  const priceStep = (endPrice - startPrice) / points;

  for (let i = 0; i <= points; i++) {
    const date = new Date(startDate.getTime() + (i * (now - startDate) / points));
    if (date > now) break;

    // Add noise
    const noise = (Math.random() - 0.5) * price * 0.04;
    price = Math.max(price * 0.85, price + priceStep + noise);

    data.push({
      x: date,
      y: parseFloat(price.toFixed(2))
    });
  }

  // Ensure last point is current price
  if (data.length > 0) data[data.length - 1].y = 30.79;

  return data;
}

function generateMA(priceData, period) {
  return priceData.map((point, i) => {
    if (i < period - 1) return null;
    const slice = priceData.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.y, 0) / period;
    return { x: point.x, y: parseFloat(avg.toFixed(2)) };
  });
}

function generateVolumeData(priceData) {
  return priceData.map(point => {
    const baseVol = 45 + Math.random() * 30;
    // Spike around earnings dates
    const isEarnings = point.x.getMonth() % 3 === 2 && point.x.getDate() >= 1 && point.x.getDate() <= 10;
    return {
      x: point.x,
      y: isEarnings ? baseVol * 2 : baseVol
    };
  });
}

function getNewsAnnotations() {
  // Key news events to show as vertical line annotations on the chart
  return [
    { date: '2025-02-28', headline: 'Campus 3 Expansion Announced', category: 'manufacturing', color: '#8b5cf6' },
    { date: '2025-04-28', headline: 'Q3 FY2025 Earnings', category: 'earnings', color: '#10b981' },
    { date: '2025-06-12', headline: 'AMD MI350 GPU Launch', category: 'product', color: '#3b82f6' },
    { date: '2025-07-16', headline: 'Intel Xeon 6 Server Launch', category: 'product', color: '#3b82f6' },
    { date: '2025-08-05', headline: 'Q4 FY2025 Earnings', category: 'earnings', color: '#10b981' },
    { date: '2025-10-28', headline: 'NVIDIA Vera Rubin Platform', category: 'product', color: '#3b82f6' },
    { date: '2025-11-04', headline: 'Q1 FY2026 Earnings', category: 'earnings', color: '#10b981' },
    { date: '2025-12-01', headline: 'Special Committee Update', category: 'governance', color: '#f59e0b' },
    { date: '2026-01-15', headline: 'BDO USA Progress', category: 'governance', color: '#f59e0b' },
    { date: '2026-02-03', headline: 'Q2 FY2026 Earnings Beat', category: 'earnings', color: '#10b981' },
    { date: '2026-03-14', headline: 'CEO AI Infrastructure Statement', category: 'governance', color: '#f59e0b' },
  ];
}

function renderStockChart(range = '1y') {
  const ctx = document.getElementById('stockChart');
  if (!ctx) return;

  const priceData = generatePriceData(range);
  const ma50Data = generateMA(priceData, 50);
  const ma200Data = generateMA(priceData, 200);
  const volumeData = generateVolumeData(priceData);
  const newsAnnotations = getNewsAnnotations();

  // News annotation vertical lines as custom plugin
  const newsPlugin = {
    id: 'newsMarkers',
    afterDraw(chart) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (!chartArea) return; // Guard: skip if Chart.js hasn't computed layout yet

      const { left, right } = chartArea;
      const xScale = chart.scales.x;

      newsAnnotations.forEach(event => {
        const eventDate = new Date(event.date);
        const xPixel = xScale.getPixelForValue(eventDate);

        if (xPixel >= left && xPixel <= right) {
          ctx.save();
          ctx.strokeStyle = event.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(xPixel, chartArea.top);
          ctx.lineTo(xPixel, chartArea.bottom);
          ctx.stroke();

          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          ctx.fillStyle = event.color;
          ctx.beginPath();
          ctx.arc(xPixel, chartArea.top, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    }
  };

  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'SMCI Price',
          data: priceData,
          borderColor: '#3b82f6',
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return;
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: '50-Day MA',
          data: ma50Data,
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderDash: [],
          pointRadius: 0,
          fill: false,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: '200-Day MA',
          data: ma200Data,
          borderColor: '#ef4444',
          borderWidth: 1.5,
          borderDash: [6, 3],
          pointRadius: 0,
          fill: false,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Volume (M)',
          data: volumeData,
          type: 'bar',
          backgroundColor: 'rgba(107, 114, 128, 0.35)',
          borderColor: 'rgba(107, 114, 128, 0.5)',
          borderWidth: 1,
          yAxisID: 'yVolume',
          barPercentage: 0.8,
          categoryPercentage: 1.0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.2,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'line',
            padding: 16,
            font: { size: 11 },
            filter: (item) => item.text !== 'Volume (M)'
          }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
          bodyFont: { size: 12 },
          padding: 10,
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const d = new Date(items[0].raw.x);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            },
            label: (context) => {
              if (context.dataset.label === 'Volume (M)') {
                return `Volume: ${context.raw.y.toFixed(0)}M`;
              }
              return `${context.dataset.label}: $${context.raw.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: range === '6m' ? 'month' : range === '1y' ? 'month' : 'quarter',
            displayFormats: {
              month: 'MMM yyyy',
              quarter: 'QQQ yyyy'
            }
          },
          grid: { display: false },
          ticks: { maxTicksLimit: 8, font: { size: 11 } }
        },
        y: {
          position: 'left',
          grid: { color: '#1f2937' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: (val) => '$' + val.toFixed(0)
          }
        },
        yVolume: {
          position: 'right',
          grid: { display: false },
          max: 200,
          ticks: {
            font: { size: 10 },
            callback: (val) => val + 'M'
          }
        }
      }
    },
    plugins: [newsPlugin]
  });
}

// ============================================================
// 2. REVENUE CHART (5-year bars)
// ============================================================
let revenueChart = null;

function renderRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  if (revenueChart) revenueChart.destroy();

  const labels = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025'];
  const revenues = [3.557, 5.196, 7.123, 14.989, 21.972]; // in billions
  const growth = [null, 46.1, 37.1, 110.4, 46.6]; // percent

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue ($B)',
        data: revenues,
        backgroundColor: revenues.map((v, i) =>
          i === revenues.length - 1 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(59, 130, 246, 0.7)'
        ),
        borderColor: revenues.map((v, i) =>
          i === revenues.length - 1 ? '#10b981' : '#3b82f6'
        ),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        yAxisID: 'y'
      },
      {
        label: 'YoY Growth (%)',
        data: growth,
        type: 'line',
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#f59e0b',
        tension: 0.3,
        yAxisID: 'y2'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.8,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, padding: 16, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => {
              if (context.dataset.label.includes('Growth')) {
                return context.raw ? `YoY Growth: ${context.raw}%` : '';
              }
              return `Revenue: $${context.raw}B`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: {
          grid: { color: '#1f2937' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: (v) => '$' + v + 'B'
          }
        },
        y2: {
          position: 'right',
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            callback: (v) => v + '%'
          }
        }
      }
    }
  });
}

// ============================================================
// 3. NET INCOME CHART (5-year bars)
// ============================================================
let netIncomeChart = null;

function renderNetIncomeChart() {
  const ctx = document.getElementById('netIncomeChart');
  if (!ctx) return;

  if (netIncomeChart) netIncomeChart.destroy();

  // Use approximate net income values from financials.json
  const labels = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025'];
  const netIncomes = [0.120, 0.265, 0.450, 0.660, 1.000]; // in billions (FY2021-2022 estimated)
  const margins = [3.4, 5.1, 6.3, 4.4, 4.5]; // approximate net margins

  netIncomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Net Income ($B)',
        data: netIncomes,
        backgroundColor: netIncomes.map((v, i) => {
          if (i < 3) return 'rgba(59, 130, 246, 0.7)';
          return 'rgba(16, 185, 129, 0.8)';
        }),
        borderColor: netIncomes.map((v, i) => {
          if (i < 3) return '#3b82f6';
          return '#10b981';
        }),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        yAxisID: 'y'
      },
      {
        label: 'Net Margin (%)',
        data: margins,
        type: 'line',
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
        tension: 0.3,
        yAxisID: 'y2'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.8,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, padding: 16, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => {
              if (context.dataset.label.includes('Margin')) {
                return `Net Margin: ${context.raw}%`;
              }
              return `Net Income: $${context.raw}B`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: {
          grid: { color: '#1f2937' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: (v) => '$' + v + 'B'
          }
        },
        y2: {
          position: 'right',
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            callback: (v) => v + '%'
          }
        }
      }
    }
  });
}

// ============================================================
// 4. EPS SURPRISE CHART
// ============================================================
let epsChart = null;

function renderEPSChart() {
  const ctx = document.getElementById('epsSurpriseChart');
  if (!ctx) return;

  if (epsChart) epsChart.destroy();

  // Quarterly EPS data from financials.json
  const quarters = ['Q3 FY25\n(Apr \'25)', 'Q4 FY25\n(Aug \'25)', 'Q1 FY26\n(Nov \'25)', 'Q2 FY26\n(Feb \'26)'];
  const epsActual = [0.17, 0.41, 0.26, 0.69];
  // Estimates (consensus) - approximate
  const epsEst = [null, null, null, 0.46];
  // Beat percentage
  const beatPct = [null, null, null, 50];

  const actualColors = epsActual.map((actual, i) => {
    if (epsEst[i] === null) return 'rgba(59, 130, 246, 0.8)';
    return actual >= epsEst[i] ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
  });

  epsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: quarters,
      datasets: [
        {
          label: 'Non-GAAP EPS',
          data: epsActual,
          backgroundColor: actualColors,
          borderColor: actualColors.map(c => c.replace('0.8', '1')),
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.5,
          yAxisID: 'y'
        },
        {
          label: 'Consensus Estimate',
          data: epsEst,
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: '#f59e0b',
          tension: 0,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.6,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, padding: 16, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => {
              const idx = context.dataIndex;
              if (context.dataset.label === 'Consensus Estimate') {
                return context.raw ? `Estimate: $${context.raw.toFixed(2)}` : '';
              }
              let label = `EPS: $${context.raw.toFixed(2)}`;
              if (epsEst[idx] !== null) {
                const beat = ((context.raw - epsEst[idx]) / epsEst[idx] * 100).toFixed(0);
                label += ` (${beat > 0 ? '+' : ''}${beat}% vs est)`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: '#1f2937' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: (v) => '$' + v.toFixed(2)
          }
        }
      }
    }
  });
}

// ============================================================
// 5. ANALYST RATINGS DISTRIBUTION
// ============================================================
let analystChart = null;

function renderAnalystChart() {
  const ctx = document.getElementById('analystRatingChart');
  if (!ctx) return;

  if (analystChart) analystChart.destroy();

  analystChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Buy (6)', 'Hold (8)', 'Sell (2)'],
      datasets: [{
        data: [6, 8, 2],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(239, 68, 68, 0.85)'
        ],
        borderColor: [
          '#10b981',
          '#3b82f6',
          '#ef4444'
        ],
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => {
              const pct = [37.5, 50, 12.5];
              return ` ${context.label}: ${context.raw} analysts (${pct[context.dataIndex]}%)`;
            }
          }
        }
      }
    }
  });
}

// ============================================================
// RENDER ALL CHARTS (called on page load)
// ============================================================
function renderAllCharts() {
  renderRevenueChart();
  renderNetIncomeChart();
  renderEPSChart();
  renderAnalystChart();
}

function initStockChartRange() {
  const rangeBtns = document.querySelectorAll('.range-btn');
  rangeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rangeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const range = btn.dataset.range || '1y';
      try {
        renderStockChart(range);
      } catch (e) {
        console.error('renderStockChart error:', e);
      }
    });
  });
}

// ============================================================
// EXPORTS
// ============================================================
window.renderStockChart = renderStockChart;
window.renderRevenueChart = renderRevenueChart;
window.renderNetIncomeChart = renderNetIncomeChart;
window.renderEPSChart = renderEPSChart;
window.renderAnalystChart = renderAnalystChart;
window.renderAllCharts = renderAllCharts;
window.initStockChartRange = initStockChartRange;
window.getNewsAnnotations = getNewsAnnotations;
