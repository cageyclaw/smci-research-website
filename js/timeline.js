/* ============================================
   SMCI Research — timeline.js
   News timeline logic + chart overlay
   ============================================ */

let newsTimelineChart = null;

// News events for chart overlay (defined here to avoid circular deps)
function getTimelineNews() {
  return [
    {
      date: '2025-02-28',
      category: 'Manufacturing',
      severity: 'Positive',
      headline: 'Silicon Valley Campus 3 Expansion Announced',
      summary: 'Supermicro announced expansion of U.S. manufacturing capacity with a third campus in Silicon Valley. Initial phase ~333,400 sq ft; total planned ~3M sq ft.',
      color: '#8b5cf6'
    },
    {
      date: '2025-04-28',
      category: 'Earnings',
      severity: 'Mixed',
      headline: 'Q3 FY2025 Earnings',
      summary: 'Q3 FY2025 net sales of $4.6B, EPS $0.17. Company reaffirmed FY2025 guidance of $21.8B–$22.6B.',
      color: '#10b981'
    },
    {
      date: '2025-06-12',
      category: 'Product',
      severity: 'Positive',
      headline: 'AMD Instinct MI350 GPU Platform Launch',
      summary: 'Supermicro launched AI solutions optimized for AMD Instinct MI350 series GPUs in both liquid and air-cooled configurations.',
      color: '#3b82f6'
    },
    {
      date: '2025-07-16',
      category: 'Product',
      severity: 'Positive',
      headline: 'Intel Xeon 6 4-Socket Server Launch',
      summary: 'Supermicro launched 4-socket server platform based on Intel Xeon 6 processors supporting dual 500W processors per node.',
      color: '#3b82f6'
    },
    {
      date: '2025-08-05',
      category: 'Earnings',
      severity: 'Mixed',
      headline: 'Q4 FY2025 & Full-Year FY2025 Results',
      summary: 'Q4 revenue $5.8B, EPS $0.41. FY2025 revenue $22.0B. Company issued FY2026 guidance of ≥$33B.',
      color: '#10b981'
    },
    {
      date: '2025-10-28',
      category: 'Product',
      severity: 'Positive',
      headline: 'NVIDIA Vera Rubin NVL144 Platform Announcement',
      summary: 'Supermicro announced NVIDIA Vera Rubin NVL144 and Vera Rubin CPX platforms for 2026, offering 3x AI attention acceleration vs Blackwell Ultra.',
      color: '#3b82f6'
    },
    {
      date: '2025-11-04',
      category: 'Earnings',
      severity: 'Mixed',
      headline: 'Q1 FY2026 Results',
      summary: 'Q1 FY2026 revenue $5.0B, EPS $0.26. FY2026 guidance raised to ≥$36B. Operating cash flow -$918M due to working capital buildup.',
      color: '#10b981'
    },
    {
      date: '2025-12-01',
      category: 'Governance',
      severity: 'Neutral',
      headline: 'Special Committee Investigation Ongoing',
      summary: 'Special Committee of Supermicro\'s Board continued its investigation into accounting and governance matters.',
      color: '#f59e0b'
    },
    {
      date: '2026-01-15',
      category: 'Governance',
      severity: 'Neutral',
      headline: 'BDO USA Engagement Progress',
      summary: 'BDO USA continued its audit work following EY\'s resignation, working to restore financial reporting credibility.',
      color: '#f59e0b'
    },
    {
      date: '2026-02-03',
      category: 'Earnings',
      severity: 'Positive',
      headline: 'Q2 FY2026 Results — Massive Beat',
      summary: 'Q2 FY2026 revenue $12.68B (+123% YoY), EPS $0.69 vs $0.46 est (+50% beat). FY2026 guidance raised to ≥$40B. Cash $4.1B.',
      color: '#10b981'
    },
    {
      date: '2026-02-08',
      category: 'Governance',
      severity: 'Neutral',
      headline: 'Margin Compression Analysis',
      summary: 'Analysts noted Q2 FY2026 net margin of ~3.1% vs 6.9% a year earlier — ongoing competitive pricing pressure on AI infrastructure deals.',
      color: '#f59e0b'
    },
    {
      date: '2026-03-14',
      category: 'Governance',
      severity: 'Neutral',
      headline: 'CEO Statement on AI Infrastructure Position',
      summary: 'CEO Charles Liang emphasized Supermicro\'s central role in AI infrastructure buildout, highlighting manufacturing expansion and multi-vendor GPU partnerships.',
      color: '#f59e0b'
    }
  ];
}

function getCategoryColor(category) {
  const colors = {
    'Earnings': { bg: 'var(--color-accent-dim)', text: 'var(--color-accent)', border: 'rgba(16, 185, 129, 0.3)' },
    'Product': { bg: 'var(--color-primary-dim)', text: 'var(--color-primary)', border: 'rgba(59, 130, 246, 0.3)' },
    'Governance': { bg: 'var(--color-warning-dim)', text: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.3)' },
    'Manufacturing': { bg: 'var(--color-purple-dim)', text: 'var(--color-purple)', border: 'rgba(139, 92, 246, 0.3)' }
  };
  return colors[category] || colors['Governance'];
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildTimelineHTML() {
  const container = document.getElementById('news-timeline');
  if (!container) return;

  const news = getTimelineNews();
  let html = '';

  news.forEach((item, idx) => {
    const colors = getCategoryColor(item.category);
    const catClass = item.category.toLowerCase();
    const dotClass = catClass === 'earnings' ? 'earnings' :
                     catClass === 'product' ? 'product' :
                     catClass === 'governance' ? 'governance' : 'manufacturing';

    html += `
      <div class="timeline-item ${dotClass}" data-category="${item.category}" style="animation-delay: ${idx * 80}ms">
        <div class="timeline-date">${formatDateShort(item.date)}</div>
        <div class="timeline-card">
          <h4>
            <span>${item.headline}</span>
          </h4>
          <div class="tags">
            <span class="tag" style="background:${colors.bg};color:${colors.text};border-color:${colors.border}">${item.category}</span>
            <span class="tag tag-${item.severity.toLowerCase()}">${item.severity}</span>
          </div>
          <p style="margin-top:0.625rem;">${item.summary}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function initNewsTimeline() {
  buildTimelineHTML();
  initNewsFilter();
}

function getNewsMarkerPositions(chartRange) {
  // Returns news events that fall within the selected chart range
  const news = getTimelineNews();
  const now = new Date('2026-03-19');

  let startDate;
  switch (chartRange) {
    case '6m': startDate = new Date('2025-09-19'); break;
    case '1y': startDate = new Date('2025-03-19'); break;
    case '2y': startDate = new Date('2024-03-19'); break;
    default: startDate = new Date('2023-03-19'); break;
  }

  return news.filter(item => {
    const d = new Date(item.date);
    return d >= startDate && d <= now;
  });
}

// Chart overlay plugin for news markers
function createNewsOverlayPlugin(newsEvents) {
  return {
    id: 'newsOverlay',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;

      const xScale = scales.x;

      newsEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const xPixel = xScale.getPixelForValue(eventDate);

        if (xPixel >= chartArea.left && xPixel <= chartArea.right) {
          ctx.save();

          // Vertical dashed line
          ctx.strokeStyle = event.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.moveTo(xPixel, chartArea.top);
          ctx.lineTo(xPixel, chartArea.bottom);
          ctx.stroke();

          // Top dot
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          ctx.fillStyle = event.color;
          ctx.beginPath();
          ctx.arc(xPixel, chartArea.top + 6, 5, 0, Math.PI * 2);
          ctx.fill();

          // Label (show for earnings events or major ones)
          if (event.category === 'Earnings') {
            ctx.font = "10px 'Inter', sans-serif";
            ctx.fillStyle = event.color;
            ctx.globalAlpha = 0.85;
            const label = formatDateShort(event.date);
            const textWidth = ctx.measureText(label).width;
            const labelX = Math.min(xPixel - textWidth / 2, chartArea.right - textWidth - 4);
            ctx.fillText(label, Math.max(labelX, chartArea.left + 2), chartArea.top + 20);
          }

          ctx.restore();
        }
      });
    }
  };
}

// ============================================================
// EXPORTS
// ============================================================
window.buildTimelineHTML = buildTimelineHTML;
window.initNewsTimeline = initNewsTimeline;
window.getTimelineNews = getTimelineNews;
window.getCategoryColor = getCategoryColor;
window.formatDateShort = formatDateShort;
window.createNewsOverlayPlugin = createNewsOverlayPlugin;
window.getNewsMarkerPositions = getNewsMarkerPositions;
