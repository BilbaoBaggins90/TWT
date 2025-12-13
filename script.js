// CONFIGURATION
const TARGET_WEBSITE_URL = "https://docs.google.com/spreadsheets/u/0/"; 

document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('torn_api_key');
    if (savedKey) document.getElementById('apiKey').value = savedKey;
    
    const savedList = localStorage.getItem('torn_watchlist');
    if (savedList) document.getElementById('watchlistIds').value = savedList;
    
    const linkBtn = document.getElementById('extLinkBtn');
    if(linkBtn) linkBtn.href = https://oran.pw/baldrstargets/;
});

function showAlert(msg, type = 'danger') {
    const el = document.getElementById('alertBox');
    el.innerHTML = `<div class="toast show align-items-center text-white bg-${type} border-0"><div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`;
    setTimeout(() => el.innerHTML = '', 4000);
}

function getBadge(state) {
    if (state === 'Okay') return 'badge-okay';
    if (state === 'Hospital') return 'badge-hospital';
    if (state === 'Jail') return 'badge-jail';
    return 'badge-travel';
}

async function autoDetect() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!apiKey) return showAlert("Please enter your API Key at the top.");
    localStorage.setItem('torn_api_key', apiKey);

    try {
        const userRes = await fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`);
        const userData = await userRes.json();
        if (userData.error) throw new Error(userData.error.error);
        
        const myFacId = userData.faction.faction_id;
        localStorage.setItem('my_faction_id', myFacId);

        const facRes = await fetch(`https://api.torn.com/faction/${myFacId}?selections=basic&key=${apiKey}`);
        const facData = await facRes.json();

        let enemyId = null;
        const rankedWars = facData.ranked_wars || {};
        for (const warId in rankedWars) {
            const factions = rankedWars[warId].factions;
            for (const fid in factions) {
                if (parseInt(fid) !== myFacId) enemyId = fid;
            }
        }

        if (enemyId) {
            document.getElementById('enemyId').value = enemyId;
            showAlert(`Enemy Found: ${enemyId}`, 'success');
            fetchTargets();
        } else {
            showAlert("No Ranked War active. Enter Enemy ID manually.", 'warning');
        }
    } catch (e) { showAlert(e.message); }
}

async function updateChainOnly() {
    const apiKey = document.getElementById('apiKey').value.trim();
    let myFacId = localStorage.getItem('my_faction_id');
    if (!apiKey || !myFacId) return;

    try {
        const response = await fetch(`https://api.torn.com/faction/${myFacId}?selections=chain&key=${apiKey}`);
        const data = await response.json();
        if (data.chain) {
            document.getElementById('chainPanel').style.display = 'block';
            document.getElementById('chainCount').innerText = data.chain.current;
            const timerEl = document.getElementById('chainTimeout');
            timerEl.innerText = data.chain.timeout + "s";
            timerEl.style.color = data.chain.timeout < 60 ? '#dc3545' : '#198754';
        }
    } catch (e) { console.error(e); }
}

async function fetchTargets() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const enemyId = document.getElementById('enemyId').value.trim();
    if (!apiKey || !enemyId) return showAlert("Key and Enemy ID required.");
    
    localStorage.setItem('torn_api_key', apiKey);
    updateChainOnly();
    
    const tbody = document.getElementById('warTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Scanning...</td></tr>';
    
    try {
        const response = await fetch(`https://api.torn.com/faction/${enemyId}?selections=basic,members&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.error);

        let members = Object.values(data.members).sort((a, b) => b.level - a.level);
        const statusFilter = document.getElementById('statusFilter').value;
        const minLevel = parseInt(document.getElementById('minLevel').value) || 0;
        const maxLevel = parseInt(document.getElementById('maxLevel').value) || 1000;

        tbody.innerHTML = '';
        members.forEach(m => {
            const state = m.status.state;
            if (m.level < minLevel || m.level > maxLevel) return;
            if (statusFilter === 'okay' && state !== 'Okay') return;

            const respectMin = ((Math.log(m.level) + 1) / 4).toFixed(2);
            const respectMax = (respectMin * 3).toFixed(2);

            tbody.innerHTML += `
                <tr>
                    <td><a href="https://www.torn.com/profiles.php?XID=${m.id}" target="_blank" class="fw-bold text-dark text-decoration-none">${m.name}</a></td>
                    <td>${m.level}</td>
                    <td class="respect-cell">${respectMin}-${respectMax}</td>
                    <td><span class="badge ${getBadge(state)}">${state}</span></td>
                    <td><a href="https://www.torn.com/loader.php?sid=attack&user2ID=${m.id}" target="_blank" class="btn btn-sm btn-danger">Attack</a></td>
                </tr>`;
        });
    } catch (e) { showAlert(e.message); }
}

async function checkWatchlist() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const rawIds = document.getElementById('watchlistIds').value;
    if (!apiKey || !rawIds) return showAlert("Missing Key or IDs.");
    
    localStorage.setItem('torn_watchlist', rawIds);
    const ids = rawIds.split(/[\n,]+/).map(id => id.trim()).filter(id => id.length > 0 && !isNaN(id));
    const tbody = document.getElementById('watchTableBody');
    tbody.innerHTML = '';

    for (let i = 0; i < ids.length; i++) {
        try {
            const res = await fetch(`https://api.torn.com/user/${ids[i]}?selections=profile&key=${apiKey}`);
            const data = await res.json();
            if (data.error) continue;
            
            const badge = getBadge(data.status.state);
            tbody.innerHTML += `
                <tr>
                    <td><a href="https://www.torn.com/profiles.php?XID=${data.player_id}" target="_blank" class="fw-bold text-dark text-decoration-none">${data.name}</a></td>
                    <td>Level ${data.level}</td>
                    <td><span class="badge ${badge}">${data.status.state}</span></td>
                    <td><a href="https://www.torn.com/loader.php?sid=attack&user2ID=${data.player_id}" target="_blank" class="btn btn-sm btn-danger">Attack</a></td>
                </tr>`;
        } catch (e) {}
        await new Promise(r => setTimeout(r, 300)); // Rate limit buffer
    }
}
