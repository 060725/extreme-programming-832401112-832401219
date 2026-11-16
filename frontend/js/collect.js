const searchInput = document.getElementById('searchInput');
let searchTimer = null;
let cachedData = [];

function displayData(data) {
    const tbody = document.getElementById('phonebookTbody');
    tbody.innerHTML = '';
    if (!data.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'empty-tip';
        cell.textContent = '还没有收藏的联系人，回到首页点击 ☆ 即可收藏';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    data.forEach(entry => {
        const row = document.createElement('tr');
        row.classList.add('collected');

        const starCell = document.createElement('td');
        starCell.className = 'col-star';
        const starButton = document.createElement('button');
        starButton.className = 'starBtn active';
        starButton.textContent = '★';
        starButton.title = '取消收藏';
        starButton.onclick = () => toggleBookmark(entry.id, entry.collect);
        starCell.appendChild(starButton);

        row.appendChild(starCell);
        row.appendChild(cellWithText(entry.username));
        row.appendChild(cellWithText(entry.phone));
        row.appendChild(cellWithText(entry.email || '-'));
        row.appendChild(cellWithText(entry.address || '-'));

        const actionCell = document.createElement('td');
        actionCell.className = 'col-action';
        const removeButton = document.createElement('button');
        removeButton.className = 'cancelCollect';
        removeButton.textContent = '取消收藏';
        removeButton.onclick = () => toggleBookmark(entry.id, entry.collect);
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    });
}

function cellWithText(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function toggleBookmark(id, currentStatus) {
    const newStatus = currentStatus === 2 ? 1 : 2;
    fetch(`${API_BASE}/toggleBookmark`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, collect: newStatus})
    })
        .then(() => loadMyCollect())
        .catch(console.error);
}

function loadMyCollect() {
    fetch(`${API_BASE}/collectList`)
        .then(response => response.json())
        .then(data => {
            cachedData = data;
            renderFiltered();
        })
        .catch(console.error);
}

function renderFiltered() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = keyword
        ? cachedData.filter(entry => (entry.username || '').toLowerCase().includes(keyword))
        : cachedData;
    displayData(filtered);
}

searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderFiltered, 200);
});

loadMyCollect();
