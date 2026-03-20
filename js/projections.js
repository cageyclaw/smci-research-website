/* ============================================
   SMCI Research — projections.js
   12-Month Projection scenario logic
   ============================================ */

let projectionChart = null;

const SCENARIOS = {
  bull: {
    label: 'Bull Case',
    color: '#10b981',
    colorDim: 'rgba(16, 185, 129, 0.15)',
    fy2027Revenue: '$55B–$60B',
    priceTarget: '$60–$80',
    revenueGrowth: '~50%',
    assumptions: [
      'AI rack-scale leadership maintained',
      'Gross margin recovers to ~17–19%',
      'BDO delivers clean FY2026 audit',
      'DOJ/SEC matters resolved favorably',
      'Large hyperscaler design wins (NVIDIA/AMD)',
      'Campus 3 ramps to full capacity'
    ]
  },
  base: {
    label: 'Base Case',
    color: '#3b82f6',
    colorDim: 'rgba(59, 130, 246, 0.15)',
    fy2027Revenue: '$45B–$52B',
    priceTarget: '$40–$55',
    revenueGrowth: '~25–30%',
    assumptions: [
      'FY2026 ≥$40B revenue achieved',
      'Margin compression stabilizes at ~4–5%',
      'Governance risk persists but contained',
      'Moderate competitive pressure from Dell/HPE',
      'No DOJ/SEC resolution (ongoing uncertainty)',
      'Market share stable at ~5–6% of AI server market'
    ]
  },
  bear: {
    label: 'Bear Case',
    color: '#ef4444',
    colorDim: 'rgba(239, 68, 68, 0.15)',
    fy2027Revenue: '$30B–$38B',
    priceTarget: '$15–$25',
    revenueGrowth: '~0–15%',
    assumptions: [
      'Governance issues escalate (restatements)',
      'DOJ/SEC adverse resolution',
      'GPU supply allocation loses ground to Dell',
      'Hyperscaler customers dual-source more',
      'Margin collapse to ~2–3% net margin',
      'Nasdaq listing risk resurfaces'
    ]
  }
};

// Monthly projection data points (Mar 2026 → Mar 2027)
// Starting from current price ~$30.79
function generateProjectionData(scenario) {
  const currentPrice = 30.79;
  const months = [];
  const prices = [];

  const now = new Date('2026-03-19');
  let price = currentPrice;
  let monthlyGrowth;

  switch (scenario) {
    case 'bull':
      // Target $60–$80 in 12 months, with strong quarters
      monthlyGrowth = 0.065; // ~65% annual gain
      break;
    case 'base':
      // Target $40–$55 in 12 months
      monthlyGrowth = 0.045; // ~45% annual gain
      break;
    case 'bear':
      // Target $15–$25 in 12 months
      monthlyGrowth = -0.04; // ~40% annual decline
      break;
    default:
      monthlyGrowth = 0.04;
  }

  for (let i = 0; i <= 12; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() + i);
    months.push(d);

    // Target price with some oscillation
    if (scenario === 'bull') {
      const targetHigh = 75;
      const targetLow = 60;
      price = currentPrice + (targetHigh - currentPrice) * (i / 12) * (0.85 + Math.random() * 0.3);
    } else if (scenario === 'base') {
      const targetHigh = 52;
      const targetLow = 40;
      price = currentPrice + (targetHigh - currentPrice) * (i / 12) * (0.8 + Math.random() * 0.4);
    } else {
      const targetHigh = 30;
      const targetLow = 18;
      price = currentPrice + (targetLow - currentPrice) * (i / 12) * (0.7 + Math.random() * 0.6);
    }

    // Apply monthly drift with volatility
    const drift = price * monthlyGrowth * (1 + (Math.random() - 0.5) * 0.3);
    price = Math.max(price * 0.7, price * (1 + monthlyGrowth) * (0.9 + Math.random() * 0.2));

    // Quarterly earnings bumps
    if (i === 3) price *= 1.08; // Q3 FY2026 earnings
    if (i === 6) price *= 1.12; // Q4 FY2026 earnings
    if (i === 9) price *= 1.10; // Q1 FY2027 earnings

    prices.push(parseFloat(price.toFixed(2)));
  }

  return { months, prices };
}

function renderProjectionChart(scenario = 'base') {
  const ctx = document.getElementById('projectionChart');
  if (!ctx) return;

  const data = generateProjectionData(scenario);
  const scenarioInfo = SCENARIOS[scenario];

  // Generate confidence band data (upper/lower bounds)
  const upperBand = data.prices.map(p => parseFloat((p * 1.25).toFixed(2)));
  const lowerBand = data.prices.map(p => parseFloat((p * 0.75).toFixed(2)));

  if (projectionChart) projectionChart.destroy();

  projectionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months.map(d => d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      datasets: [
        {
          label: 'Projected Price',
          data: data.prices,
          borderColor: scenarioInfo.color,
          backgroundColor: scenarioInfo.colorDim,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: scenarioInfo.color,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Upper Bound',
          data: upperBand,
          borderColor: scenarioInfo.color,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.3
        },
        {
          label: 'Lower Bound',
          data: lowerBand,
          borderColor: scenarioInfo.color,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
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
            filter: (item) => item.text !== 'Upper Bound' && item.text !== 'Lower Bound'
          }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              return items[0].label;
            },
            label: (context) => {
              if (context.dataset.label === 'Upper Bound' || context.dataset.label === 'Lower Bound') return '';
              return ` Price: $${context.raw.toFixed(2)}`;
            },
            afterBody: (items) => {
              if (items.length === 0) return [];
              const idx = items[0].dataIndex;
              return [
                `Range: $${lowerBand[idx].toFixed(2)} – $${upperBand[idx].toFixed(2)}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { color: '#1f2937' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: (val) => '$' + val.toFixed(0)
          }
        }
      }
    }
  });
}

function updateScenarioUI(scenario) {
  const info = SCENARIOS[scenario];
  if (!info) return;

  // Update scenario cards
  document.querySelectorAll('.projection-scenario').forEach(card => {
    card.classList.remove('active');
  });

  const activeCard = document.querySelector(`.projection-scenario.${scenario}`);
  if (activeCard) {
    activeCard.classList.add('active');
    activeCard.style.borderColor = info.color;
    activeCard.style.background = info.colorDim;
  }

  // Update highlight box
  const highlight = document.querySelector('.scenario-highlight');
  if (highlight) {
    highlight.className = `scenario-highlight ${scenario}`;
    const labelEl = highlight.querySelector('.scenario-label');
    const valueEl = highlight.querySelector('.scenario-value');
    const revEl = highlight.querySelector('.scenario-rev');
    if (labelEl) labelEl.textContent = info.label;
    if (valueEl) valueEl.textContent = info.priceTarget + ' in 12 months';
    if (revEl) revEl.textContent = 'FY2027 Est. Revenue: ' + info.fy2027Revenue;
  }

  // Update price display
  const currentPriceEl = document.querySelector('.current-price');
  const targetPriceEl = document.querySelector('.target-price');
  if (currentPriceEl) currentPriceEl.textContent = '$30.79';

  if (targetPriceEl) {
    const targets = {
      bull: { low: 60, high: 80 },
      base: { low: 40, high: 55 },
      bear: { low: 15, high: 25 }
    };
    const t = targets[scenario];
    targetPriceEl.textContent = `$${t.low}–$${t.high}`;
    targetPriceEl.style.color = info.color;
  }
}

function initScenarioSelector() {
  const buttons = document.querySelectorAll('.scenario-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const scenario = btn.dataset.scenario || 'base';
      renderProjectionChart(scenario);
      updateScenarioUI(scenario);
    });
  });
}

function initProjections() {
  renderProjectionChart('base');
  updateScenarioUI('base');
  initScenarioSelector();
}

// ============================================================
// EXPORTS
// ============================================================
window.renderProjectionChart = renderProjectionChart;
window.updateScenarioUI = updateScenarioUI;
window.initScenarioSelector = initScenarioSelector;
window.initProjections = initProjections;
window.SCENARIOS = SCENARIOS;
