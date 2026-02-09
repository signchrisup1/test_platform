// Simple chart rendering with HTML/CSS
const Charts = {
  // Horizontal bar chart
  barChart(data, { height = 180, maxValue = null } = {}) {
    const max = maxValue || Math.max(...data.map(d => d.value), 1);

    return `
      <div class="bar-chart" style="height:${height}px">
        ${data.map(d => {
          const pct = (d.value / max) * 100;
          return `
            <div class="bar-item">
              <div class="bar-value">${d.value}</div>
              <div class="bar" style="height:${Math.max(pct, 2)}%;background:${d.color || 'var(--gradient-primary)'}"></div>
              <div class="bar-label">${d.label}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Donut/pie chart using conic-gradient
  donutChart(segments, { size = 140, thickness = 24 } = {}) {
    let gradient = '';
    let currentAngle = 0;

    segments.forEach(seg => {
      const angle = (seg.value / 100) * 360;
      gradient += `${seg.color} ${currentAngle}deg ${currentAngle + angle}deg, `;
      currentAngle += angle;
    });

    // Fill remaining
    if (currentAngle < 360) {
      gradient += `var(--bg-input) ${currentAngle}deg 360deg`;
    } else {
      gradient = gradient.slice(0, -2);
    }

    const inner = size - thickness * 2;

    return `
      <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:conic-gradient(${gradient});display:flex;align-items:center;justify-content:center;margin:0 auto">
        <div style="width:${inner}px;height:${inner}px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-direction:column">
          ${segments.length > 0 ? `
            <div style="font-size:1.4rem;font-weight:700">${Math.round(segments.reduce((s, seg) => s + seg.value, 0))}%</div>
          ` : ''}
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:12px">
        ${segments.map(seg => `
          <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem">
            <div style="width:10px;height:10px;border-radius:50%;background:${seg.color}"></div>
            <span style="color:var(--text-secondary)">${seg.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Heatmap calendar
  heatmap(data, { weeks = 12 } = {}) {
    const cells = [];
    const today = new Date();

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const value = data[key] || 0;

      let level = 0;
      if (value > 0) level = 1;
      if (value >= 30) level = 2;
      if (value >= 60) level = 3;
      if (value >= 120) level = 4;

      cells.push(`<div class="heatmap-cell level-${level}" data-tooltip="${key}: ${value}m" style="width:14px;height:14px"></div>`);
    }

    return `
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <span style="font-size:0.75rem;color:var(--text-muted)">Less</span>
        <div style="display:flex;gap:3px">
          <div class="heatmap-cell" style="width:14px;height:14px"></div>
          <div class="heatmap-cell level-1" style="width:14px;height:14px"></div>
          <div class="heatmap-cell level-2" style="width:14px;height:14px"></div>
          <div class="heatmap-cell level-3" style="width:14px;height:14px"></div>
          <div class="heatmap-cell level-4" style="width:14px;height:14px"></div>
        </div>
        <span style="font-size:0.75rem;color:var(--text-muted)">More</span>
      </div>
      <div class="heatmap" style="grid-template-columns:repeat(${weeks}, 1fr);max-width:${weeks * 17}px">
        ${cells.join('')}
      </div>
    `;
  },

  // Progress ring
  progressRing(percentage, { size = 80, strokeWidth = 6, color = 'var(--primary)' } = {}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
      <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--bg-input)" stroke-width="${strokeWidth}" />
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" style="transition:stroke-dashoffset 0.5s ease" />
      </svg>
    `;
  },

  // Mini sparkline
  sparkline(values, { width = 100, height = 30, color = 'var(--primary)' } = {}) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values, 1);
    const step = width / (values.length - 1 || 1);

    const points = values.map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg width="${width}" height="${height}" style="overflow:visible">
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }
};
