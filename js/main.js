// main.js
// Requires Chart.js loaded (see index.html)
// Click an icon to open modal and render a date-over-time chart.
// Replace fetchData(...) with real API calls.

document.addEventListener('DOMContentLoaded', () => {
  const icons = document.querySelectorAll('.icon-btn');
  const modal = document.getElementById('chart-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const chartTitle = document.getElementById('chart-title');
  const ctx = document.getElementById('trend-chart').getContext('2d');
  const downloadCsvBtn = document.getElementById('download-csv');

  let currentChart = null;
  let lastData = null;
  let lastSensor = null;

  icons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const sensor = btn.getAttribute('data-sensor') || 'unknown';
      chartTitle.textContent = `${btn.textContent.trim()} — Date over time`;
      openModal();
      // fetch or generate data for the sensor
      const payload = await fetchData(sensor);
      lastData = payload; lastSensor = sensor;
      renderChart(payload);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  downloadCsvBtn.addEventListener('click', () => {
    if(!lastData) return;
    const csv = toCSV(lastData);
    downloadFile(csv, `${lastSensor || 'data'}-trend.csv`, 'text/csv');
  });

  function openModal(){
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    if(currentChart){ currentChart.destroy(); currentChart = null; }
  }

  function renderChart(payload){
    const labels = payload.map(p => p.date);
    const data = payload.map(p => p.value);
    if(currentChart) currentChart.destroy();
    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Value',
          data,
          fill: true,
          backgroundColor: gradient(ctx),
          borderColor: 'rgba(255,60,166,0.95)',
          tension: 0.25,
          pointRadius: 2,
          pointBackgroundColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111',
            titleColor: '#fff',
            bodyColor: '#fff',
          }
        },
        scales: {
          x: {
            ticks: { color: '#ddd' },
            grid: { color: 'rgba(255,255,255,0.03)' }
          },
          y: {
            ticks: { color: '#ddd' },
            grid: { color: 'rgba(255,255,255,0.03)' }
          }
        }
      }
    });
  }

  // Simple vertical gradient for chart fill
  function gradient(ctx){
    const g = ctx.createLinearGradient(0, 0, 0, 400);
    g.addColorStop(0, 'rgba(255,60,166,0.28)');
    g.addColorStop(1, 'rgba(255,60,166,0.02)');
    return g;
  }

  // Example: replace this with "fetch('/api/sensor?name='+sensor)" or websocket
  async function fetchData(sensor){
    // demo: generate 14 days of fake data
    const days = 14;
    const arr = [];
    const now = new Date();
    for(let i = days - 1; i >= 0; i--){
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      arr.push({
        date: d.toISOString().slice(0,10), // YYYY-MM-DD
        value: Math.round(50 + Math.sin(i/2)*15 + Math.random()*10)
      });
    }
    // simulate network delay
    await new Promise(res=>setTimeout(res, 250));
    return arr;
  }

  function toCSV(data){
    const header = 'date,value\n';
    const rows = data.map(r => `${r.date},${r.value}`).join('\n');
    return header + rows;
  }

  function downloadFile(content, filename, mime){
    const blob = new Blob([content], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
});
