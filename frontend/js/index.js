const modal = document.getElementById('modal');
const searchInput = document.getElementById('searchInput');
let searchTimer = null;

/* ---------------- modal ---------------- */

function showModal(mode, entry) {
    modal.style.display = 'block';
    document.getElementById('submit').onclick = mode === 'edit' ? updateEntry : addEntry;
    document.getElementById('modalTitle').textContent = mode === 'edit' ? '编辑联系人' : '新增联系人';
    clearInputs();

    if (mode === 'edit' && entry) {
        document.getElementById('entryId').value = entry.id;
        document.getElementById('username').value = entry.username || '';
        document.getElementById('phone').value = entry.phone || '';
        document.getElementById('phone1').value = entry.phone1 || '';
        document.getElementById('email').value = entry.email || '';
        document.getElementById('socialmedia').value = entry.socialmedia || '';
        document.getElementById('address').value = entry.address || '';
        if (entry.image) {
            const preview = document.getElementById('previewImage');
            preview.src = entry.image;
            preview.style.display = 'block';
        }
    }
}

function closeModal() {
    modal.style.display = 'none';
    clearInputs();
}

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
};

document.querySelector('.close').onclick = closeModal;

function clearInputs() {
    ['username', 'phone', 'phone1', 'email', 'socialmedia', 'address'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('entryId').value = '';
    const preview = document.getElementById('previewImage');
    preview.src = '';
    preview.style.display = 'none';
    document.getElementById('imageInput').value = '';
}

/* ---------------- image ---------------- */

document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const preview = document.getElementById('previewImage');
            preview.src = reader.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch(`${API_BASE}/uploadImage`, {
            method: 'POST',
            body: formData
        });
        return await response.text();
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('上传图片失败，请重试');
        return '';
    }
}

/* ---------------- create / update / delete ---------------- */

async function addEntry() {
    const data = readForm();
    if (!data) {
        return;
    }
    data.image = '';
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
        data.image = await uploadImage(imageFile);
    }
    fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(checkResponse)
        .then(() => {
            closeModal();
            loadPhoneBook();
        })
        .catch(console.error);
}

async function updateEntry() {
    const data = readForm();
    if (!data) {
        return;
    }
    data.id = document.getElementById('entryId').value;
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
        data.image = await uploadImage(imageFile);
    } else {
        data.image = document.getElementById('previewImage').getAttribute('src') || '';
    }
    fetch(`${API_BASE}/update`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(checkResponse)
        .then(() => {
            closeModal();
            loadPhoneBook();
        })
        .catch(console.error);
}

function readForm() {
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!username || !phone) {
        alert('姓名和手机号码不能为空');
        return null;
    }
    return {
        username: username,
        phone: phone,
        phone1: document.getElementById('phone1').value.trim(),
        email: document.getElementById('email').value.trim(),
        socialmedia: document.getElementById('socialmedia').value.trim(),
        address: document.getElementById('address').value.trim()
    };
}

function checkResponse(response) {
    return response.text().then(text => {
        if (text !== 'ok') {
            throw new Error('request failed: ' + text);
        }
        return text;
    });
}

function deleteEntry(id) {
    if (confirm('确定要删除此条目吗?')) {
        fetch(`${API_BASE}/delete?id=${id}`, {method: 'DELETE'})
            .then(checkResponse)
            .then(loadPhoneBook)
            .catch(console.error);
    }
}

/* ---------------- list / search ---------------- */

function loadPhoneBook() {
    const keyword = searchInput.value.trim();
    const url = keyword
        ? `${API_BASE}/list?name=${encodeURIComponent(keyword)}`
        : `${API_BASE}/list`;
    fetch(url)
        .then(response => response.json())
        .then(displayData)
        .catch(console.error);
}

function displayData(data) {
    const tbody = document.getElementById('phonebookTbody');
    tbody.innerHTML = '';
    if (!data.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'empty-tip';
        cell.textContent = searchInput.value.trim() ? '没有匹配的联系人' : '暂无联系人，点击“新增”添加';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    data.forEach(entry => {
        const row = document.createElement('tr');
        if (entry.collect === 2) {
            row.classList.add('collected');
        }

        const starCell = document.createElement('td');
        starCell.className = 'col-star';
        const starButton = document.createElement('button');
        starButton.className = 'starBtn' + (entry.collect === 2 ? ' active' : '');
        starButton.textContent = entry.collect === 2 ? '★' : '☆';
        starButton.title = entry.collect === 2 ? '取消收藏' : '收藏';
        starButton.onclick = () => toggleBookmark(entry.id, entry.collect);
        starCell.appendChild(starButton);

        row.appendChild(starCell);
        row.appendChild(cellWithText(entry.username));
        row.appendChild(cellWithText(entry.phone));
        row.appendChild(cellWithText(entry.email || '-'));
        row.appendChild(cellWithText(entry.address || '-'));

        const actionCell = document.createElement('td');
        actionCell.className = 'col-action';

        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = '编辑';
        editButton.onclick = () => showModal('edit', entry);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'deleteButton';
        deleteButton.textContent = '删除';
        deleteButton.onclick = () => deleteEntry(entry.id);

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
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
        .then(checkResponse)
        .then(loadPhoneBook)
        .catch(console.error);
}

searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadPhoneBook, 300);
});

/* ---------------- excel ---------------- */

function download() {
    fetch(`${API_BASE}/export`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my_contacts.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(console.error);
}

document.getElementById('importButton').addEventListener('click', () => {
    document.getElementById('excelFileInput').click();
});

document.getElementById('excelFileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch(`${API_BASE}/importExcel`, {
            method: 'POST',
            body: formData
        });
        const data = await response.text();
        if (data.startsWith('ok:')) {
            const parts = data.split(':');
            alert(`导入完成：成功 ${parts[1]} 条，跳过 ${parts[2]} 条（姓名或手机号码为空）`);
            loadPhoneBook();
        } else {
            alert('导入失败：' + (data.replace('error:', '') || '未知错误'));
        }
    } catch (error) {
        console.error('Error importing Excel:', error);
        alert('导入失败，请重试');
    } finally {
        event.target.value = '';
    }
});

loadPhoneBook();
