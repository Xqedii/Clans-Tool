let start = false;
let first = false;
document.querySelector('.start').addEventListener('click', function() {
    const button = this;
    const consoleContent = document.querySelector('.console-content');

    button.classList.add('clicked');
    if (!button.classList.contains('disabled')) {
        if (button.textContent === "Stop") {
            fetch('/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            button.textContent = "Start";
            button.style.backgroundColor = "#ffa136";
            start = false;
            consoleContent.innerHTML += 'Stopped...<br>';
            consoleContent.scrollTop = consoleContent.scrollHeight;

            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
            return;
        }
        fetch('/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        button.classList.add('disabled');
        if (first == false) {
            consoleContent.innerHTML = "";
            first = true;
        }
        button.textContent = "Starting";
        button.style.backgroundColor = "#b3b3b3";

        consoleContent.innerHTML += 'Starting...<br>';
        consoleContent.scrollTop = consoleContent.scrollHeight;

        setTimeout(() => {
            button.textContent = "Stop";
            button.style.backgroundColor = "#ff4040";
            start = true;
            button.classList.remove('disabled');

        }, 3000);
    }

    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
});

function WebVariables() {
    const endpoints = [
        { url: '/version', elementId: 'version', dataKey: 'xqedii' },
        { url: '/nickname', elementId: 'nickname', dataKey: 'xqedii' },
        { url: '/address', elementId: 'address', dataKey: 'xqedii' },
        { url: '/invites', elementId: 'invites', dataKey: 'xqedii' },
        { url: '/messages', elementId: 'messages', dataKey: 'xqedii' },
        { url: '/members', elementId: 'members', dataKey: 'xqedii' },
        { url: '/joins', elementId: 'joins', dataKey: 'xqedii' },
        { url: '/reqinvites', elementId: 'reqinvites', dataKey: 'xqedii' },
        { url: '/online', elementId: 'online', dataKey: 'xqedii' },
        { url: '/maxonline', elementId: 'maxonline', dataKey: 'xqedii' },
        { url: '/timespent', elementId: 'timespent', dataKey: 'xqedii' },
    ];
    endpoints.forEach(endpoint => {
        fetch(endpoint.url)
            .then(response => response.json())
            .then(data => {
                if (endpoint.elementId == 'version') {
                    document.getElementById(endpoint.elementId).innerHTML = `v${data[endpoint.dataKey]}`;
                } else {
                    document.getElementById(endpoint.elementId).innerHTML = data[endpoint.dataKey];
                }
            })
            .catch(error => {
                console.error(`Błąd przy pobieraniu danych z ${endpoint.url}:`, error);
        });
    });
}
WebVariables()
setInterval(WebVariables, 1000);

function ConsoleMessage() {
    fetch('/message')
        .then(response => response.json())
        .then(data => {
            if(data.xqedii.length != 0) {
                const consoleContent = document.querySelector('.console-content');
                data.xqedii.forEach(element => {
                    consoleContent.innerHTML += `${element}<br>`;
                    consoleContent.scrollTop = consoleContent.scrollHeight;
                });
            }
        })
}
setInterval(ConsoleMessage, 250);

function TimerValue() {
    fetch('/timer')
        .then(response => response.json())
        .then(data => {
            updateProgress(data.xqedii)
        })
}
setInterval(TimerValue, 500);

function updateProgress(percent) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = percent + '%';
}

let progressCount = 0;
let hasUpdatedChart = false;
let hasReset = false;

function updateProgress2() {
    const progressBar = document.querySelector('.progress-bar2');
    let one = 0;
    let two = 0;
    Promise.all([
        fetch('/online').then(response => response.json()),
        fetch('/maxonline').then(response => response.json())
    ])
    .then(data => {
        one = data[0].xqedii;
        two = data[1].xqedii;
        if (two > 0) {
            progressBar.style.width = (one / two) * 100 + '%';
            progressCount++;
            if (progressCount > 2 && one !== 0 && !hasUpdatedChart) {
                updateChartData();
                hasUpdatedChart = true;
            }
            if (hasUpdatedChart && !hasReset) {
                progressCount = 0;
                hasUpdatedChart = false;
                hasReset = true;
            }
        } else {
            progressBar.style.width = '0%';
        }
    })
}
setInterval(updateProgress2, 1000);



function changeLobby(lobby) {
    document.getElementById("dropdownButton").innerText = lobby;
    if (lobby == "Lobby 1") {
        fetch('/lobbyone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
    } else {
        fetch('/lobbytwo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
    }
    var button = document.getElementById("dropdownButton");
    button.classList.add('clicked');
    document.getElementById("dropdownContent").style.display = "none";
    setTimeout(function() {
        button.classList.remove('clicked');
    }, 300);
}
window.onclick = function(event) {
    var dropdown = document.querySelector('.dropdown');
    if (!dropdown.contains(event.target)) {
        document.getElementById("dropdownContent").style.display = "none";
        document.getElementById("dropdownButton").classList.remove('clicked');
    }
}
document.getElementById("dropdownButton").addEventListener("click", function() {
    var content = document.getElementById("dropdownContent");
    content.style.display = content.style.display === "block" ? "none" : "block";
    if (content.style.display === "block") {
        content.style.opacity = 1;
        content.style.transform = "translateY(0)";
    }
});

async function fetchOnlineData() {
    try {
        const response = await fetch('/online');
        const data = await response.json();
        return data.xqedii;
    } catch (error) {
        return null;
    }
}

async function updateChartData() {
    const onlineCount = await fetchOnlineData();
    if (onlineCount !== null) {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        playersChart.data.labels.push(formattedTime);
        playersChart.data.datasets[0].data.push(onlineCount);

        if (playersChart.data.labels.length > 25) {
            playersChart.data.labels = playersChart.data.labels.slice(-24);
            playersChart.data.datasets[0].data = playersChart.data.datasets[0].data.slice(-24);

            playersChart.data.labels.push(formattedTime);
            playersChart.data.datasets[0].data.push(onlineCount);
        }

        playersChart.update();
    }
}

const ctx = document.getElementById('playersChart').getContext('2d');
const playersChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Liczba graczy online',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Czas'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: 'Gracze online'
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false,
                position: 'top'
            }
        }
    }
});

setInterval(updateChartData, 5000*60);
updateChartData()

updateChartData()

window.addEventListener('resize', () => {
    playersChart.resize();
});


const sendButton = document.getElementById('send-btn');
const messageInput = document.getElementById('message');

sendButton.addEventListener('click', function(event) {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }
    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.status);
    })
    .catch(error => {
        console.error('Błąd:', error);
    });
    messageInput.value = "";
});

const button = document.querySelector(".send-btn");
button.addEventListener("click", (e) => {
  e.preventDefault;
  button.classList.add("animate");
  setTimeout(() => {
    button.classList.remove("animate");
  }, 600);
});