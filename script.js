// ────────────────────────────────────────────────
// State & Constants
// ────────────────────────────────────────────────
const STORAGE_PREFIX = 'lf_kwai_2026_';
const ITEMS_KEY = STORAGE_PREFIX + 'items';
const USER_KEY = STORAGE_PREFIX + 'user';
const LANG_KEY = STORAGE_PREFIX + 'lang';
let items = JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];
let currentUser = localStorage.getItem(USER_KEY) || null;
let lang = localStorage.getItem(LANG_KEY) || 'en';
const ADMIN_EMAIL = "admin@gmail.com";
const isLoggedIn = () => !!currentUser;
const isAdmin = () => currentUser?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

// ────────────────────────────────────────────────
// Save helpers
// ────────────────────────────────────────────────
function saveItems() { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); }
function saveUser() {
  if (currentUser) localStorage.setItem(USER_KEY, currentUser);
  else localStorage.removeItem(USER_KEY);
}
function saveLang() { localStorage.setItem(LANG_KEY, lang); }

// ────────────────────────────────────────────────
// Language handling
// ────────────────────────────────────────────────
function updateLanguage() {
  document.body.dataset.lang = lang;
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    el.textContent = lang === 'zh' ? el.dataset.zh : el.dataset.en;
  });
  document.querySelectorAll('[data-en-placeholder][data-zh-placeholder]').forEach(el => {
    el.placeholder = lang === 'zh' ? el.dataset.zhPlaceholder : el.dataset.enPlaceholder;
  });
  document.querySelectorAll('option[data-en][data-zh]').forEach(opt => {
    opt.textContent = lang === 'zh' ? opt.dataset.zh : opt.dataset.en;
  });
  document.getElementById('langBtn').textContent = lang === 'zh' ? 'English' : '中文';
  renderItems();
}
function toggleLanguage() {
  lang = lang === 'zh' ? 'en' : 'zh';
  saveLang();
  updateLanguage();
}

// ────────────────────────────────────────────────
// DOM cache & helpers
// ────────────────────────────────────────────────
const els = {
  reportBtn: document.getElementById('reportBtn'),
  matchBtn: document.getElementById('matchBtn'),
  loginBtn: document.getElementById('loginBtn'),
  adminNotice: document.getElementById('adminNotice'),
  reportName: document.getElementById('reportName'),
  itemsGrid: document.getElementById('itemsGrid'),
  count: document.getElementById('count'),
  typeFilter: document.getElementById('typeFilter'),
  catFilter: document.getElementById('categoryFilter'),
  searchInput: document.getElementById('searchInput'),
};
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// ────────────────────────────────────────────────
// Auth UI
// ────────────────────────────────────────────────
function updateAuthUI() {
  const isZh = lang === 'zh';
  if (isLoggedIn()) {
    els.loginBtn.textContent = isZh ? '登出' : 'Logout';
    els.loginBtn.onclick = logout;
    els.reportBtn.classList.remove('hidden');
    if (isAdmin()) {
      els.matchBtn.classList.remove('hidden');
      els.adminNotice.classList.remove('hidden');
      els.adminNotice.textContent = isZh
        ? '管理員模式：只能配對類別與標題完全相同的物品 • 編輯未配對物品 • 刪除任何報告'
        : 'Admin mode: Can only match same category & title • Edit unmatched • Delete any';
    } else {
      els.matchBtn.classList.add('hidden');
      els.adminNotice.classList.add('hidden');
    }
    if (els.reportName) {
      els.reportName.value = currentUser.split('@')[0] || currentUser;
      els.reportName.readOnly = !isAdmin();
    }
  } else {
    els.loginBtn.textContent = isZh ? '登入' : 'Login';
    els.loginBtn.onclick = () => openModal('loginModal');
    els.reportBtn.classList.add('hidden');
    els.matchBtn.classList.add('hidden');
    els.adminNotice.classList.add('hidden');
    if (els.reportName) els.reportName.value = '';
  }
  updateLanguage();
}

// ────────────────────────────────────────────────
// Login / Logout
// ────────────────────────────────────────────────
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pw = document.getElementById('loginPassword').value;
  if (!email || !pw) {
    alert(lang === 'zh' ? '請輸入電郵和密碼' : 'Please enter email and password');
    return;
  }
  currentUser = email;
  saveUser();
  closeModal('loginModal');
  updateAuthUI();
  alert(lang === 'zh' ? `歡迎，${currentUser}${isAdmin() ? '（管理員）' : ''}` : `Welcome, ${currentUser}${isAdmin() ? ' (admin)' : ''}`);
  renderItems();
}
function logout() {
  currentUser = null;
  saveUser();
  updateAuthUI();
  renderItems();
}

// ────────────────────────────────────────────────
// Report logic (image resize + geocode)
// ────────────────────────────────────────────────
let pendingImageDataUrl = null;
document.getElementById('imageInput')?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      const MAX = 760;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      pendingImageDataUrl = canvas.toDataURL('image/jpeg', 0.78);
      document.getElementById('preview').src = pendingImageDataUrl;
      document.getElementById('preview').style.display = 'block';
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

async function geocode(locationText) {
  if (!locationText.trim()) return { lat: 22.3683, lon: 114.1388 };
  try {
    const q = encodeURIComponent(locationText.trim() + ", Hong Kong");
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
    if (!res.ok) return { lat: 22.3683, lon: 114.1388 };
    const data = await res.json();
    if (data?.[0]?.lat && data?.[0]?.lon) return { lat: +data[0].lat, lon: +data[0].lon };
  } catch {}
  return { lat: 22.3683, lon: 114.1388 };
}

async function submitReport() {
  if (!isLoggedIn()) {
    alert(lang === 'zh' ? '請先登入' : 'Please login first');
    return;
  }
  const form = document.getElementById('reportForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const fd = new FormData(form);
  const loc = (fd.get('location') || '').trim();
  const coords = await geocode(loc);
  const newItem = {
    id: Date.now(),
    userEmail: currentUser.toLowerCase(),
    name: (fd.get('name') || '').trim() || currentUser.split('@')[0] || currentUser,
    status: fd.get('status'),
    category: fd.get('category'),
    title: (fd.get('title') || '').trim(),
    location: loc,
    date: fd.get('date'),
    description: (fd.get('description') || '').trim(),
    contact: (fd.get('contact') || '').trim(),
    image: pendingImageDataUrl,
    lat: coords.lat,
    lon: coords.lon,
    created: new Date().toISOString()
  };
  items.unshift(newItem);
  saveItems();
  form.reset();
  pendingImageDataUrl = null;
  document.getElementById('preview').style.display = 'none';
  closeModal('reportModal');
  alert(lang === 'zh' ? `報告已提交！編號：${newItem.id}` : `Report submitted! ID: ${newItem.id}`);
  renderItems();
}

// ────────────────────────────────────────────────
// Matching logic
// ────────────────────────────────────────────────
function openMatchModal() {
  if (!isAdmin()) return;

  const lostItems = items.filter(i => i.status === 'lost');
  const foundItems = items.filter(i => i.status === 'found');

  if (lostItems.length === 0 || foundItems.length === 0) {
    alert(lang === 'zh' ? '沒有可配對的遺失或拾獲物品' : 'No lost or found items available to match');
    return;
  }

  const html = `
    <div style="padding:0.5rem 1rem;">
      <h3 style="margin:1rem 0 0.8rem;">${lang==='zh'?'選擇要配對的物品':'Select items to match'}</h3>
      
      <div style="margin-bottom:1.2rem;">
        <label style="display:block; font-weight:600; margin-bottom:0.4rem;">
          ${lang==='zh'?'遺失物品 (Lost)':'Lost item'} *
        </label>
        <select id="matchLostSelect" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid #d1d5db;">
          <option value="">-- ${lang==='zh'?'請選擇遺失物品':'Select lost item'} --</option>
          ${lostItems.map(i => `<option value="${i.id}">#${i.id} – ${i.title || '(無標題)'} (${i.date || '?'}) [${i.category}]</option>`).join('')}
        </select>
      </div>
      
      <div style="margin-bottom:1.6rem;">
        <label style="display:block; font-weight:600; margin-bottom:0.4rem;">
          ${lang==='zh'?'拾獲物品 (Found)':'Found item'} *
        </label>
        <select id="matchFoundSelect" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid #d1d5db;">
          <option value="">-- ${lang==='zh'?'請選擇拾獲物品':'Select found item'} --</option>
          ${foundItems.map(i => `<option value="${i.id}">#${i.id} – ${i.title || '(無標題)'} (${i.date || '?'}) [${i.category}]</option>`).join('')}
        </select>
      </div>
    </div>
  `;

  let modal = document.getElementById('matchModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'matchModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-box" style="max-width:540px;">
        <div class="modal-header">
          <h2>${lang==='zh'?'配對遺失與拾獲物品':'Match Lost & Found Item'}</h2>
          <span style="font-size:2.4rem;cursor:pointer;" onclick="closeModal('matchModal')">×</span>
        </div>
        <div class="modal-body" id="matchModalBody"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('matchModal')">${lang==='zh'?'取消':'Cancel'}</button>
          <button class="btn btn-success" id="confirmMatchBtn" disabled>${lang==='zh'?'確認配對':'Confirm Match'}</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('matchModalBody').innerHTML = html;

  // ─── IMPORTANT: Re-attach listeners every time ───
  const confirmBtn   = document.getElementById('confirmMatchBtn');
  const lostSelect   = document.getElementById('matchLostSelect');
  const foundSelect  = document.getElementById('matchFoundSelect');

  if (confirmBtn) {
    confirmBtn.onclick = null;                    // prevent duplicates
    confirmBtn.addEventListener('click', confirmMatch, { once: false });
  }

  if (lostSelect && foundSelect) {
    lostSelect.removeEventListener('change', updateMatchButtonState);
    foundSelect.removeEventListener('change', updateMatchButtonState);
    lostSelect.addEventListener('change', updateMatchButtonState);
    foundSelect.addEventListener('change', updateMatchButtonState);
    updateMatchButtonState(); // run now
  }

  openModal('matchModal');
}

function updateMatchButtonState() {
  const lostSelect  = document.getElementById('matchLostSelect');
  const foundSelect = document.getElementById('matchFoundSelect');
  const confirmBtn  = document.getElementById('confirmMatchBtn');

  if (!lostSelect || !foundSelect || !confirmBtn) return;

  const lostId  = Number(lostSelect.value) || 0;
  const foundId = Number(foundSelect.value) || 0;

  let canMatch = false;
  let reason = "";

  if (lostId === 0 || foundId === 0) {
    reason = lang === 'zh' ? "請選擇遺失與拾獲物品" : "Select both a lost and a found item";
  } else if (lostId === foundId) {
    reason = lang === 'zh' ? "不能選擇同一件物品" : "Cannot match the same item with itself";
  } else {
    const lost  = items.find(i => i.id === lostId);
    const found = items.find(i => i.id === foundId);

    if (!lost || !found) {
      reason = lang === 'zh' ? "物品不存在" : "Selected item no longer exists";
    } else if (lost.status !== 'lost' || found.status !== 'found') {
      reason = lang === 'zh' ? "只能配對「遺失」與「拾獲」狀態" : "Can only match lost + found status";
    } else {
      const sameCat   = lost.category === found.category;
      const sameTitle = (lost.title || '').trim().toLowerCase() === (found.title || '').trim().toLowerCase();

      if (sameCat && sameTitle) {
        canMatch = true;
      } else {
        reason = lang === 'zh'
          ? `不匹配：類別 ${sameCat ? '相同' : '不同'} | 標題 ${sameTitle ? '相同' : '不同'}`
          : `No match: Category ${sameCat ? 'same' : 'different'} | Title ${sameTitle ? 'same' : 'different'}`;
      }
    }
  }

  confirmBtn.disabled = !canMatch;

  if (canMatch) {
    confirmBtn.title = "";
    confirmBtn.textContent = lang === 'zh' ? "確認配對" : "Confirm Match";
  } else {
    confirmBtn.title = reason;
    confirmBtn.textContent = lang === 'zh' ? `無法配對 (${reason})` : `Cannot Match (${reason})`;
  }
}

function confirmMatch() {
  const lostSelect  = document.getElementById('matchLostSelect');
  const foundSelect = document.getElementById('matchFoundSelect');

  if (!lostSelect || !foundSelect) {
    alert(lang === 'zh' ? "配對視窗錯誤，請關閉後重新開啟" : "Match modal error – please close and reopen");
    return;
  }

  const lostId  = Number(lostSelect.value);
  const foundId = Number(foundSelect.value);

  if (!lostId || !foundId || lostId === foundId) {
    alert(lang === 'zh' ? "請選擇兩個不同的物品" : "Please select two different items");
    return;
  }

  const lost  = items.find(i => i.id === lostId);
  const found = items.find(i => i.id === foundId);

  if (!lost || !found) {
    alert(lang === 'zh' ? "物品不存在" : "Item not found");
    return;
  }

  if (lost.status !== 'lost' || found.status !== 'found') {
    alert(lang === 'zh' 
      ? '只能配對「遺失」狀態與「拾獲」狀態的物品' 
      : 'Can only match a "lost" item with a "found" item');
    return;
  }

  const sameCategory = lost.category === found.category;
  const sameTitle    = (lost.title   || '').trim().toLowerCase() === (found.title || '').trim().toLowerCase();

  if (!sameCategory || !sameTitle) {
    alert(lang === 'zh'
      ? '只能配對「類別」和「標題」完全相同的物品（不分大小寫）'
      : 'Can only match items with the exact same category and title (case-insensitive)');
    return;
  }

  if (!confirm(lang === 'zh'
    ? `確定配對？\n• 遺失物品 #${lost.id} (${lost.title || '(無標題)'}) → 狀態改為「已配對」\n• 拾獲物品 #${found.id} (${found.title || '(無標題)'}) → 將被**永久刪除**`
    : `Confirm match?\n• Lost #${lost.id} (${lost.title || '(no title)'}) → status becomes "matched"\n• Found #${found.id} (${found.title || '(no title)'}) → will be **permanently deleted**`)) {
    return;
  }

  // Perform the match
  lost.status      = 'matched';
  lost.matchedWith = found.id;
  lost.matchedAt   = new Date().toISOString();
  lost.matchedBy   = currentUser;

  items = items.filter(i => i.id !== found.id);

  saveItems();
  closeModal('matchModal');

  alert(lang === 'zh' 
    ? `配對成功！遺失物品已標記為「已配對」，拾獲報告已移除。` 
    : `Match successful! Lost item marked as matched, found report removed.`);

  renderItems();
}

// ────────────────────────────────────────────────
// Edit & Delete
// ────────────────────────────────────────────────
function openEditModal(id) {
  if (!isAdmin()) return;
  const item = items.find(i => i.id === id);
  if (!item || item.status === 'matched') {
    alert(lang === 'zh' ? '只能編輯遺失或拾獲物品' : 'Can only edit lost or found items');
    return;
  }

  document.getElementById('editId').value = item.id;
  document.getElementById('editStatus').value = item.status;
  document.getElementById('editCategory').value = item.category;
  document.getElementById('editTitle').value = item.title || '';
  document.getElementById('editLocation').value = item.location || '';
  document.getElementById('editDate').value = item.date || '';
  document.getElementById('editDescription').value = item.description || '';
  document.getElementById('editContact').value = item.contact || '';

  openModal('editModal');
}

function saveEdit() {
  const id = Number(document.getElementById('editId').value);
  const item = items.find(i => i.id === id);
  if (!item || !isAdmin()) return;

  item.status = document.getElementById('editStatus').value;
  item.category = document.getElementById('editCategory').value;
  item.title = document.getElementById('editTitle').value.trim();
  item.location = document.getElementById('editLocation').value.trim();
  item.date = document.getElementById('editDate').value;
  item.description = document.getElementById('editDescription').value.trim();
  item.contact = document.getElementById('editContact').value.trim();

  saveItems();
  closeModal('editModal');
  alert(lang === 'zh' ? '物品已更新' : 'Item updated');
  renderItems();
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const isOwner = item.userEmail === currentUser?.toLowerCase();
  if (!isOwner && !isAdmin()) {
    return alert(lang === 'zh' ? '只能刪除自己的報告' : 'You can only delete your own reports');
  }

  if (!confirm(lang === 'zh' ? '確定刪除此報告？' : 'Delete this report?')) return;

  items = items.filter(i => i.id !== id);
  saveItems();
  renderItems();
}

// ────────────────────────────────────────────────
// Map & rendering
// ────────────────────────────────────────────────
let map = null;
const markerGroups = {
  lost: L.layerGroup(),
  found: L.layerGroup(),
  matched: L.layerGroup()
};

function initMap() {
  if (map) return;
  map = L.map('map', { zoomControl: true }).setView([22.3683, 114.1388], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);
  Object.values(markerGroups).forEach(g => g.addTo(map));
}

function clearAllMarkers() {
  Object.values(markerGroups).forEach(g => g.clearLayers());
}

function addMarkersToMap(visibleItems) {
  visibleItems.forEach(item => {
    if (typeof item.lat !== 'number' || typeof item.lon !== 'number') return;
    const group = markerGroups[item.status];
    if (!group) return;
    const color = item.status === 'lost' ? '#dc2626' : item.status === 'found' ? '#16a34a' : '#eab308';
    const marker = L.circleMarker([item.lat, item.lon], {
      radius: 10,
      fillColor: color,
      color: 'white',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.92
    });
    marker.bindPopup(`<b>${item.title || '(No title)'}</b><br>#${item.id}<br>${item.date || '—'}`);
    group.addLayer(marker);
  });
}

function renderItems() {
  let visibleItems = isAdmin() ? [...items] :
    isLoggedIn() ? items.filter(i => i.userEmail === currentUser.toLowerCase()) :
    [...items];

  const typeVal = els.typeFilter.value;
  if (typeVal !== 'all') visibleItems = visibleItems.filter(i => i.status === typeVal);

  const catVal = els.catFilter.value;
  if (catVal !== 'all') visibleItems = visibleItems.filter(i => i.category === catVal);

  const query = (els.searchInput.value || '').trim().toLowerCase();
  if (query) {
    visibleItems = visibleItems.filter(i =>
      (i.title||'').toLowerCase().includes(query) ||
      (i.location||'').toLowerCase().includes(query) ||
      (i.description||'').toLowerCase().includes(query)
    );
  }

  els.count.textContent = visibleItems.length
    ? `${visibleItems.length} ${lang==='zh' ? '個項目' : 'item'}${visibleItems.length > 1 && lang==='en' ? 's' : ''}`
    : (lang==='zh' ? '暫無記錄' : 'No records found');

  els.itemsGrid.innerHTML = visibleItems.map(item => {
    const isOwn = item.userEmail === currentUser?.toLowerCase();
    const canEdit = isAdmin() && (item.status === 'lost' || item.status === 'found');
    const canDelete = isOwn || isAdmin();
    const imgHtml = item.image
      ? `<img src="${item.image}" alt="Item photo">`
      : `<div class="no-photo">${lang==='zh'?'無相片':'No photo'}</div>`;

    let btns = '';
    if (canEdit) {
      btns += `<button class="btn btn-primary" onclick="openEditModal(${item.id})">${lang==='zh'?'編輯':'Edit'}</button>`;
    }
    if (canDelete) {
      btns += `<button class="btn btn-danger" onclick="deleteItem(${item.id})">${lang==='zh'?'刪除':'Delete'}</button>`;
    }

    return `
      <div class="card">
        <div class="card-img">
          ${imgHtml}
          <div class="badge badge-${item.status}">${item.status.toUpperCase()}</div>
        </div>
        <div class="card-body">
          <div class="card-title">${item.title || (lang==='zh'?'(無標題)':'(No title)')}</div>
          <div class="card-desc">${item.description || (lang==='zh'?'無描述':'No description')}</div>
          <div class="meta">
            <div><strong>${lang==='zh'?'地點':'Loc'}:</strong> ${item.location || '—'}</div>
            <div><strong>${lang==='zh'?'日期':'Date'}:</strong> ${item.date || '—'}</div>
          </div>
          <div class="meta">
            <div><strong>#</strong> ${item.id}</div>
            <div>
              ${isOwn ? `<span style="color:var(--success); font-weight:500;">${lang==='zh'?'您的':'Yours'}</span>` : ''}
              ${isAdmin() && !isOwn ? `<span style="color:#7c3aed;">${lang==='zh'?'管理員查看':'Admin view'}</span>` : ''}
            </div>
          </div>
          ${btns ? `<div class="actions">${btns}</div>` : ''}
        </div>
      </div>`;
  }).join('');

  clearAllMarkers();
  addMarkersToMap(visibleItems);
  if (map) map.invalidateSize();
}

// ────────────────────────────────────────────────
// Init
// ────────────────────────────────────────────────
window.addEventListener('load', () => {
  initMap();
  updateAuthUI();
  updateLanguage();

  els.reportBtn.onclick = () => openModal('reportModal');
  els.matchBtn.onclick = openMatchModal;
  document.getElementById('langBtn').onclick = toggleLanguage;

  els.typeFilter.addEventListener('change', renderItems);
  els.catFilter.addEventListener('change', renderItems);
  els.searchInput.addEventListener('input', renderItems);

  setTimeout(() => map?.invalidateSize(), 400);
  window.addEventListener('resize', () => map?.invalidateSize());

  renderItems();
});