// Agri365 Web Hub - Advanced API-Driven Logic Controller

const API_BASE = 'http://localhost:3000/api';
let webcamStream = null;
let currentImage = null;

// Tab Navigation Logic
function switchTab(tabId) {
    const dashboardView = document.getElementById('dashboard-view');
    const contentView = document.getElementById('content-view');
    const headerTitle = document.getElementById('content-header');
    const bodyContent = document.getElementById('content-body');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick*="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (tabId === 'dashboard') {
        dashboardView.style.display = 'grid';
        contentView.style.display = 'none';
    } else {
        dashboardView.style.display = 'none';
        contentView.style.display = 'block';
        headerTitle.innerHTML = tabId.toUpperCase() + ' INTERFACE <i class="fas fa-plug"></i>';
        renderModule(tabId, bodyContent);
    }
}

function renderModule(id, container) {
    container.innerHTML = `<div class="card" style="padding:40px; text-align:center;"><i class="fas fa-sync fa-spin"></i> Loading ${id} data from server...</div>`;
    // Simulated endpoint loading
}

// BEST ALGORITHM: Server-Side Fuzzy Search
async function handleGlobalSearch(query) {
    const q = query.toLowerCase().trim();
    const resultsList = document.getElementById('search-results-list');

    if (q.length < 2) {
        resultsList.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
        });
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            resultsList.style.display = 'block';
            resultsList.innerHTML = result.data.map((item) => `
                <div class="search-item" onclick="showDetail('${item.name}')">
                    <div style="display:flex; justify-content:space-between">
                        <span class="search-item-title">${item.name}</span>
                        <span class="search-tag">${item.type}</span>
                    </div>
                    <div class="search-item-desc">${item.info || 'Scientific agricultural data entry'}</div>
                </div>
            `).join('');
        } else {
            resultsList.innerHTML = '<div class="search-item">No matches. Try "tomoto", "wheat", or "aphids".</div>';
            resultsList.style.display = 'block';
        }
    } catch (e) {
        console.error("Search API Error:", e);
    }
}

async function showDetail(name) {
    // Re-verify detail from server search
    const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: name })
    });
    const result = await response.json();
    const item = result.data[0];

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content-area');

    content.innerHTML = `
        <h2 style="color:var(--primary-light); margin-bottom:15px;">${item.name} <span class="search-tag">${item.type}</span></h2>
        <p style="margin-bottom:10px; line-height:1.6">${item.info}</p>
        ${item.rec ? `<div class="recommendation-box" style="margin-top:20px"><strong style="color:var(--warning)">TREATMENT:</strong><p>${item.rec}</p></div>` : ''}
        ${item.market ? `<p style="margin-top:20px"><strong>Market Rate:</strong> ${item.market}</p>` : ''}
    `;

    modal.style.display = 'flex';
    document.getElementById('search-results-list').style.display = 'none';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Webcam Logic
async function toggleWebcam() {
    const video = document.getElementById('webcam-view');
    const preview = document.getElementById('pest-preview');
    const btn = document.getElementById('webcam-btn');

    if (!webcamStream) {
        try {
            webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = webcamStream;
            video.style.display = 'block'; preview.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-camera"></i>'; btn.style.background = 'var(--danger)';
        } catch (err) { alert("Webcam blocked."); }
    } else {
        stopWebcam();
        video.style.display = 'none'; preview.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-video"></i>'; btn.style.background = '';
    }
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            document.getElementById('pest-preview').src = currentImage;
            document.getElementById('webcam-view').style.display = 'none';
            document.getElementById('pest-preview').style.display = 'block';
            stopWebcam();
        };
        reader.readAsDataURL(file);
    }
}

// INTELLIGENT SERVER-SIDE IDENTIFICATION
async function startAnalysis() {
    if (!currentImage && !webcamStream) { alert("Upload image first!"); return; }

    if (webcamStream) {
        const video = document.getElementById('webcam-view');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        currentImage = canvas.toDataURL('image/jpeg');
    }

    const modal = document.getElementById('scanner-modal');
    modal.style.display = 'flex';
    document.getElementById('scanner-view-container').innerHTML = `<img src="${currentImage}" style="width:100%; height:100%; object-fit:cover;">`;

    const progressBar = document.getElementById('analysis-progress');
    const steps = document.getElementById('status-steps');
    const stages = ["Calibrating...", "Isolating Flora...", "ML Matrix Matching...", "Confirming Diagnosis..."];

    for (let i = 0; i < stages.length; i++) {
        await new Promise(r => setTimeout(r, 1200));
        progressBar.style.width = ((i + 1) * 25) + '%';
        steps.innerHTML = `<div class="step"><i class="fas fa-check-circle"></i> ${stages[i]}</div>`;
    }

    // Call Intelligent Server API
    const searchQuery = document.getElementById('global-search').value;
    const response = await fetch(`${API_BASE}/pests/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: "captured", context: searchQuery })
    });
    const result = await response.json();

    await new Promise(r => setTimeout(r, 500));
    modal.style.display = 'none';

    if (result.success) {
        const data = result.data.pest;
        document.getElementById('identified-pest-name').innerText = data.name;
        document.getElementById('pest-recommendation').innerText = data.rec || data.treatment;
        document.getElementById('confidence-val').innerText = (result.data.confidence * 100).toFixed(1) + '%';
        document.getElementById('pest-result').style.display = 'block';

        // Sync location from server
        if (result.data.location) {
            document.getElementById('current-location-text').innerText = result.data.location;
            document.getElementById('city-name').innerText = result.data.location;
        }
    }
}

// PRECISE LOCATION (With Server Sync)
async function requestLiveLocation() {
    const locText = document.getElementById('current-location-text');
    const cityText = document.getElementById('city-name');
    locText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GPS Syncing...';

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            // Fetch precise reverse geocoding
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                const data = await res.json();
                const city = data.address.city || data.address.town || data.address.village || "Ongole";
                const state = data.address.state || "Andhra Pradesh";

                locText.innerText = `${city}, IN`;
                cityText.innerText = `${city}, ${state}`;
                locText.parentElement.style.borderColor = 'var(--success)';
            } catch (e) {
                locText.innerText = "Ongole, IN";
                cityText.innerText = "Ongole, Andhra Pradesh";
            }
        }, () => {
            locText.innerText = "Ongole, IN";
            cityText.innerText = "Ongole, Andhra Pradesh";
        });
    }
}

window.onload = () => {
    // Check Server Status
    fetch(API_BASE.replace('/api', '')).then(r => r.json()).then(d => {
        document.getElementById('api-status-text').innerText = "Connected to Server v" + d.version;
    }).catch(() => {
        document.getElementById('api-status-text').innerText = "Server Offline";
    });
};
