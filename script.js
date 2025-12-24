document.addEventListener("DOMContentLoaded", () => {
    console.log("HiveMind Ready!");
    // Check if already logged in
    if (localStorage.getItem("hive_isLoggedIn") === "true") {
        showDashboard();
    }
});

function goToLogin() {
    document.getElementById("landing-view").classList.add("hidden");
    document.getElementById("login-view").classList.remove("hidden");
}

function backToHome() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("landing-view").classList.remove("hidden");
}

function attemptLogin() {
    const email = document.getElementById("email-input").value;
    const pass = document.getElementById("password-input").value;

    if (email.endsWith("@gmail.com") && pass === "hive123") {
        localStorage.setItem("hive_isLoggedIn", "true");
        showDashboard();
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

function showDashboard() {
    document.getElementById("landing-view").classList.add("hidden");
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("dashboard-view").classList.remove("hidden");
    initChart();
}

function logout() {
    localStorage.removeItem("hive_isLoggedIn");
    location.reload();
}

function initChart() {
    const ctx = document.getElementById('hiveChart');
    if(!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10am', '11am', '12pm'],
            datasets: [{ label: 'Temp', data: [32, 33, 32.5], borderColor: '#f1c40f' }]
        }
    });
}
