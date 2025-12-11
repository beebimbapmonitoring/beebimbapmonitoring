// script.js

let myChart = null;

const mockData = {
    temp: { label: 'Temperature (°C)', data: [22, 23, 21, 24, 25, 23], color: '#f39c12' },
    humidity: { label: 'Humidity (%)', data: [50, 55, 60, 58, 55, 52], color: '#3498db' },
    weight: { label: 'Weight (kg)', data: [15, 15.2, 15.5, 15.4, 15.8, 16], color: '#2ecc71' }
};

function showGraph(type) {
    const section = document.getElementById('detailsSection');
    const videoSec = document.getElementById('videoSection');
    const canvas = document.getElementById('detailChart');
    const title = document.getElementById('panelTitle');

    section.style.display = 'block';
    videoSec.style.display = 'none';
    canvas.style.display = 'block';

    title.innerText = type.charAt(0).toUpperCase() + type.slice(1) + " History";

    if (myChart) myChart.destroy();

    const ctx = canvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10am', '11am', '12pm', '1pm', '2pm', 'Now'],
            datasets: [{
                label: mockData[type].label,
                data: mockData[type].data,
                borderColor: mockData[type].color,
                backgroundColor: mockData[type].color + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true }
    });

    section.scrollIntoView({ behavior: 'smooth' });
}

function showVideoPanel() {
    const section = document.getElementById('detailsSection');
    const videoSec = document.getElementById('videoSection');
    const canvas = document.getElementById('detailChart');
    const title = document.getElementById('panelTitle');

    section.style.display = 'block';
    canvas.style.display = 'none';
    videoSec.style.display = 'block';
    title.innerText = "Live Camera Feed";

    section.scrollIntoView({ behavior: 'smooth' });
}

function closePanel() {
    document.getElementById('detailsSection').style.display = 'none';
}

function downloadLogs() {
    alert("Downloading CSV Logs...");
}
