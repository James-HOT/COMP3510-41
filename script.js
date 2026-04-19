// --- TRANSLATIONS ---
const translations = {
    en: {
        appTitle: 'Lost & Found', login: 'Login', logout: 'Logout', register: 'Register', reportItem: 'Report Item',
        adminPanel: 'Admin Panel', email: 'Email', password: 'Password', submit: 'Submit', cancel: 'Cancel',
        type: 'Type', lost: 'Lost', found: 'Found', title: 'Title', desc: 'Description', category: 'Category',
        photo: 'Photo', location: 'Location', contact: 'Contact Info', search: 'Search', allTypes: 'All Types',
        allCats: 'All Categories', electronics: 'Electronics', clothing: 'Clothing', documents: 'Documents',
        keys: 'Keys', pets: 'Pets', other: 'Other', match: 'Match', edit: 'Edit', delete: 'Delete', save: 'Save',
        status: 'Status', active: 'Active', matched: 'Matched', noItems: 'No items found.', selectLoc: 'Select location on map',
        adminHint: 'Admin: admin / admin | User: Jack / Jack123',
        authTitle: 'Login or Register', authHint: "Enter your email and password. We'll create an account if you don't have one.",
        continueBtn: 'Continue', authNav: 'Login / Register', incorrectPass: 'Incorrect password for this email.',
        loginRequired: 'Please login to report an item.', registerAgree: 'I understand this will register a new account.',
        registerAgreeRequired: 'Please accept to register a new account.'
    },
    zh: {
        appTitle: '失物招領', login: '登入', logout: '登出', register: '註冊', reportItem: '通報物品',
        adminPanel: '管理員面板', email: '電子郵件', password: '密碼', submit: '送出', cancel: '取消',
        type: '類型', lost: '遺失', found: '尋獲', title: '標題', desc: '描述', category: '分類',
        photo: '照片', location: '地點', contact: '聯絡資訊', search: '搜尋', allTypes: '所有類型',
        allCats: '所有分類', electronics: '電子產品', clothing: '衣物', documents: '文件',
        keys: '鑰匙', pets: '寵物', other: '其他', match: '配對', edit: '編輯', delete: '刪除', save: '儲存',
        status: '狀態', active: '處理中', matched: '已配對', noItems: '找不到物品。', selectLoc: '在地圖上選擇地點',
        adminHint: '管理員: admin / admin | 用戶: Jack / Jack123',
        authTitle: '登入或註冊', authHint: '請輸入電子郵件與密碼。若無帳號將自動為您註冊。',
        continueBtn: '繼續', authNav: '登入 / 註冊', incorrectPass: '密碼錯誤。',
        loginRequired: '請先登入以通報物品。', registerAgree: '我了解這將註冊一個新帳戶。',
        registerAgreeRequired: '請勾選以註冊新帳戶。'
    }
};

let currentLang = 'en'; // Removed localStorage
document.getElementById('lang-select').value = currentLang;

function changeLang(lang) {
    currentLang = lang;
    // Removed localStorage
    applyTranslations();
    renderItems();
    if(document.getElementById('view-admin').classList.contains('hidden') === false) renderAdminTable();
}

function applyTranslations() {
    const t = translations[currentLang];
    document.getElementById('nav-title').innerText = t.appTitle;
    document.querySelectorAll('.t-login').forEach(e => e.innerText = t.login);
    document.querySelectorAll('.t-logout').forEach(e => e.innerText = t.logout);
    document.querySelectorAll('.t-register').forEach(e => e.innerText = t.register);
    document.querySelectorAll('.t-report').forEach(e => e.innerText = t.reportItem);
    document.querySelectorAll('.t-admin').forEach(e => e.innerText = t.adminPanel);
    document.querySelectorAll('.t-email').forEach(e => e.innerText = t.email);
    document.querySelectorAll('.t-password').forEach(e => e.innerText = t.password);
    document.querySelectorAll('.t-submit').forEach(e => e.innerText = t.submit);
    document.querySelectorAll('.t-cancel').forEach(e => e.innerText = t.cancel);
    document.querySelectorAll('.t-type').forEach(e => e.innerText = t.type);
    document.querySelectorAll('.t-lost').forEach(e => e.innerText = t.lost);
    document.querySelectorAll('.t-found').forEach(e => e.innerText = t.found);
    document.querySelectorAll('.t-title').forEach(e => e.innerText = t.title);
    document.querySelectorAll('.t-desc').forEach(e => e.innerText = t.desc);
    document.querySelectorAll('.t-category').forEach(e => e.innerText = t.category);
    document.querySelectorAll('.t-photo').forEach(e => e.innerText = t.photo);
    document.querySelectorAll('.t-location').forEach(e => e.innerText = t.location);
    document.querySelectorAll('.t-contact').forEach(e => e.innerText = t.contact);
    document.querySelectorAll('.t-all-types').forEach(e => e.innerText = t.allTypes);
    document.querySelectorAll('.t-all-cats').forEach(e => e.innerText = t.allCats);
    document.querySelectorAll('.t-electronics').forEach(e => e.innerText = t.electronics);
    document.querySelectorAll('.t-clothing').forEach(e => e.innerText = t.clothing);
    document.querySelectorAll('.t-documents').forEach(e => e.innerText = t.documents);
    document.querySelectorAll('.t-keys').forEach(e => e.innerText = t.keys);
    document.querySelectorAll('.t-pets').forEach(e => e.innerText = t.pets);
    document.querySelectorAll('.t-other').forEach(e => e.innerText = t.other);
    document.querySelectorAll('.t-status').forEach(e => e.innerText = t.status);
    document.querySelectorAll('.t-select-loc').forEach(e => e.innerText = t.selectLoc);
    document.querySelectorAll('.t-admin-hint').forEach(e => e.innerText = t.adminHint);
    document.querySelectorAll('.t-auth-title').forEach(e => e.innerText = t.authTitle);
    document.querySelectorAll('.t-auth-hint').forEach(e => e.innerText = t.authHint);
    document.querySelectorAll('.t-continue').forEach(e => e.innerText = t.continueBtn);
    document.querySelectorAll('.t-auth-nav').forEach(e => e.innerText = t.authNav);
    document.querySelectorAll('.t-register-agree').forEach(e => e.innerText = t.registerAgree);
    document.getElementById('search-input').placeholder = t.search + '...';
}

// --- STATE & STORAGE (In-Memory Only) ---
let currentUser = null; // Removed localStorage
let items = []; // Removed localStorage
let users = [{ email: 'Jack', password: 'Jack123', isAdmin: false }]; // Default user account
let homeMode = 'list';
let homeMapInstance = null;
let reportMapInstance = null;
let reportMarker = null;
let reportLat = 25.0330, reportLng = 121.5654, reportLocName = '';
let reportPhotoBase64 = '';

function saveItems() { /* No-op: items are updated directly in memory */ }
function saveUsers(newUsers) { users = newUsers; }
function getUsers() { return users; }

// --- NAVIGATION ---
function updateNav() {
    if (currentUser) {
        document.getElementById('nav-logged-out').classList.add('hidden');
        document.getElementById('nav-logged-in').classList.remove('hidden');
        document.getElementById('nav-logged-in').classList.add('flex');
        if (currentUser.isAdmin) {
            document.getElementById('nav-admin-btn').classList.remove('hidden');
            document.getElementById('nav-admin-btn').classList.add('flex');
        } else {
            document.getElementById('nav-admin-btn').classList.add('hidden');
            document.getElementById('nav-admin-btn').classList.remove('flex');
        }
    } else {
        document.getElementById('nav-logged-out').classList.remove('hidden');
        document.getElementById('nav-logged-in').classList.add('hidden');
        document.getElementById('nav-logged-in').classList.remove('flex');
    }
}

function showView(viewId) {
    ['home', 'auth', 'report', 'admin'].forEach(v => {
        document.getElementById('view-' + v).classList.add('hidden');
    });
    document.getElementById('view-' + viewId).classList.remove('hidden');
    
    document.getElementById('mobile-fab').classList.add('hidden');
    if (viewId === 'home' && currentUser) {
        document.getElementById('mobile-fab').classList.remove('hidden');
    }

    if (viewId === 'home') {
        renderItems();
        if (homeMode === 'map') setTimeout(initHomeMap, 100);
    } else if (viewId === 'report') {
        setTimeout(initReportMap, 100);
    } else if (viewId === 'admin') {
        renderAdminTable();
    }
}

function handleReportClick() {
    if (currentUser) {
        showView('report');
    } else {
        alert(translations[currentLang].loginRequired);
        showView('auth');
    }
}

// --- AUTH ---
function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;
    const err = document.getElementById('auth-error');
    
    // Check for admin account
    if (email === 'admin' && pass === 'admin') {
        currentUser = { email: 'admin', isAdmin: true };
        updateNav();
        showView('admin');
        err.classList.add('hidden');
        return;
    }

    const currentUsers = getUsers();
    const user = currentUsers.find(u => u.email === email);
    
    if (user) {
        // Login
        if (user.password === pass) {
            currentUser = user;
            updateNav();
            showView('home');
            err.classList.add('hidden');
        } else {
            err.innerText = translations[currentLang].incorrectPass;
            err.classList.remove('hidden');
        }
    } else {
        // Check for registration agreement
        const agreeCheckbox = document.getElementById('auth-register-agree');
        if (!agreeCheckbox.checked) {
            err.innerText = translations[currentLang].registerAgreeRequired;
            err.classList.remove('hidden');
            return;
        }
        // Register new user
        const newUser = { email, password: pass, isAdmin: false };
        currentUsers.push(newUser);
        saveUsers(currentUsers);
        
        currentUser = newUser;
        updateNav();
        showView('home');
        err.classList.add('hidden');
    }
}

// --- AUTH VIEW TOGGLE ---
function checkRegisterMode() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;
    const currentUsers = getUsers();
    const userExists = currentUsers.find(u => u.email === email);
    const registerCheckbox = document.getElementById('register-checkbox');
    
    // Show checkbox if it's a new user registration
    if (!userExists && email.length > 0) {
        registerCheckbox.classList.remove('hidden');
    } else {
        registerCheckbox.classList.add('hidden');
        document.getElementById('auth-register-agree').checked = false;
    }
}

function logout() {
    currentUser = null;
    // Removed localStorage
    updateNav();
    showView('home');
}

// --- HOME VIEW ---
function setHomeMode(mode) {
    homeMode = mode;
    const btnList = document.getElementById('btn-mode-list');
    const btnMap = document.getElementById('btn-mode-map');
    const viewList = document.getElementById('home-list-mode');
    const viewMap = document.getElementById('home-map-mode');

    if (mode === 'list') {
        btnList.className = "p-1.5 rounded-md flex items-center transition-colors bg-white shadow-sm text-indigo-600";
        btnMap.className = "p-1.5 rounded-md flex items-center transition-colors text-zinc-500 hover:text-zinc-700";
        viewList.classList.remove('hidden');
        viewMap.classList.add('hidden');
    } else {
        btnMap.className = "p-1.5 rounded-md flex items-center transition-colors bg-white shadow-sm text-indigo-600";
        btnList.className = "p-1.5 rounded-md flex items-center transition-colors text-zinc-500 hover:text-zinc-700";
        viewMap.classList.remove('hidden');
        viewList.classList.add('hidden');
        setTimeout(initHomeMap, 100);
    }
}

function renderItems() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const category = document.getElementById('filter-category').value;
    const listContainer = document.getElementById('home-list-mode');
    
    const filtered = items.filter(item => {
        const mSearch = item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
        const mType = type === 'all' || item.type === type;
        const mCat = category === 'all' || item.category === category;
        const mUser = currentUser ? item.reporterEmail === currentUser.email : true;
        return mSearch && mType && mCat && mUser;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="col-span-full py-12 text-center text-zinc-500 bg-white rounded-xl border border-zinc-200 border-dashed">
            <i data-lucide="filter" class="h-12 w-12 mx-auto mb-3 text-zinc-300"></i>
            <p>${translations[currentLang].noItems}</p>
        </div>`;
    } else {
        listContainer.innerHTML = filtered.map(item => `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-200 hover:shadow-md transition-shadow group flex flex-col">
                <div class="relative h-48 bg-zinc-100 overflow-hidden">
                    ${item.photo ? `<img src="${item.photo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` : 
                    `<div class="w-full h-full flex items-center justify-center text-zinc-400"><i data-lucide="image" class="h-12 w-12 opacity-20"></i></div>`}
                    <div class="absolute top-3 left-3 flex gap-2">
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${item.type === 'lost' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'}">
                            ${translations[currentLang][item.type]}
                        </span>
                        ${item.status === 'matched' ? `<span class="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md bg-indigo-500/90 text-white">${translations[currentLang].matched}</span>` : ''}
                    </div>
                </div>
                <div class="p-4 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg text-zinc-900 line-clamp-1">${item.title}</h3>
                        <span class="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md whitespace-nowrap ml-2">${translations[currentLang][item.category]}</span>
                    </div>
                    <p class="text-sm text-zinc-600 line-clamp-2 mb-4 flex-1">${item.description}</p>
                    <div class="space-y-2 text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-100">
                        <div class="flex items-center"><i data-lucide="map-pin" class="h-3.5 w-3.5 mr-1.5 text-zinc-400 shrink-0"></i><span class="truncate">${item.locationName}</span></div>
                        <div class="flex items-center"><span class="font-medium mr-1.5 text-zinc-400">Contact:</span><span class="truncate">${item.contactInfo}</span></div>
                        <div class="text-right text-[10px] text-zinc-400 mt-2">${new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    lucide.createIcons();

    if (homeMode === 'map' && homeMapInstance) {
        // Clear existing markers
        homeMapInstance.eachLayer(layer => {
            if (layer instanceof L.Marker) homeMapInstance.removeLayer(layer);
        });
        // Add new markers
        filtered.forEach(item => {
            const marker = L.marker([item.lat, item.lng]).addTo(homeMapInstance);
            marker.bindPopup(`
                <div class="p-1 max-w-[200px]">
                    <h3 class="font-semibold text-sm mb-1">${item.title}</h3>
                    <span class="text-xs px-2 py-0.5 rounded-full ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">${item.type.toUpperCase()}</span>
                    ${item.photo ? `<img src="${item.photo}" class="w-full h-24 object-cover mt-2 rounded-md">` : ''}
                    <p class="text-xs text-zinc-600 mt-1 line-clamp-2">${item.description}</p>
                </div>
            `);
        });
    }
}

function initHomeMap() {
    if (!homeMapInstance) {
        homeMapInstance = L.map('home-map').setView([25.0330, 121.5654], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(homeMapInstance);
    }
    homeMapInstance.invalidateSize();
    renderItems();
}

// --- REPORT VIEW ---
function updateTypeUI() {
    const isLost = document.querySelector('input[name="report-type"]:checked').value === 'lost';
    const lblLost = document.getElementById('lbl-type-lost');
    const lblFound = document.getElementById('lbl-type-found');
    
    if (isLost) {
        lblLost.className = "flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all border-red-500 bg-red-50 text-red-700 font-semibold";
        lblFound.className = "flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all border-zinc-200 hover:border-zinc-300 text-zinc-600";
    } else {
        lblFound.className = "flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold";
        lblLost.className = "flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all border-zinc-200 hover:border-zinc-300 text-zinc-600";
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800, MAX_HEIGHT = 800;
            let width = img.width, height = img.height;
            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            reportPhotoBase64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('photo-preview').src = reportPhotoBase64;
            document.getElementById('photo-preview').classList.remove('hidden');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function initReportMap() {
    if (!reportMapInstance) {
        reportMapInstance = L.map('report-map').setView([25.0330, 121.5654], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(reportMapInstance);

        reportMapInstance.on('click', function(e) {
            reportLat = e.latlng.lat;
            reportLng = e.latlng.lng;
            
            if (reportMarker) reportMapInstance.removeLayer(reportMarker);
            reportMarker = L.marker([reportLat, reportLng]).addTo(reportMapInstance);

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${reportLat}&lon=${reportLng}`)
                .then(res => res.json())
                .then(data => {
                    reportLocName = data.display_name || `${reportLat.toFixed(4)}, ${reportLng.toFixed(4)}`;
                    const locDisplay = document.getElementById('selected-loc-display');
                    locDisplay.innerText = reportLocName;
                    locDisplay.classList.remove('hidden');
                })
                .catch(() => {
                    reportLocName = `${reportLat.toFixed(4)}, ${reportLng.toFixed(4)}`;
                    const locDisplay = document.getElementById('selected-loc-display');
                    locDisplay.innerText = reportLocName;
                    locDisplay.classList.remove('hidden');
                });
        });
    }
    reportMapInstance.invalidateSize();
}

function submitReport(e) {
    e.preventDefault();
    const err = document.getElementById('report-error');
    if (!reportLocName) {
        err.innerText = 'Please select a location on the map.';
        err.classList.remove('hidden');
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        type: document.querySelector('input[name="report-type"]:checked').value,
        title: document.getElementById('report-title').value,
        category: document.getElementById('report-category').value,
        description: document.getElementById('report-desc').value,
        contactInfo: document.getElementById('report-contact').value,
        photo: reportPhotoBase64,
        lat: reportLat,
        lng: reportLng,
        locationName: reportLocName,
        reporterEmail: currentUser.email,
        createdAt: Date.now(),
        status: 'active'
    };

    items.push(newItem);
    saveItems();
    
    // Reset form
    e.target.reset();
    document.getElementById('photo-preview').classList.add('hidden');
    document.getElementById('selected-loc-display').classList.add('hidden');
    reportPhotoBase64 = '';
    reportLocName = '';
    if (reportMarker) reportMapInstance.removeLayer(reportMarker);
    err.classList.add('hidden');
    
    showView('home');
}

// --- ADMIN VIEW ---
function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-zinc-500">${translations[currentLang].noItems}</td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const matches = item.status === 'active' ? items.filter(i => 
            i.id !== item.id && i.type !== item.type && i.category === item.category && i.status === 'active' &&
            (i.title.toLowerCase().includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(i.title.toLowerCase()))
        ) : [];

        return `
        <tr class="hover:bg-zinc-50 transition-colors group">
            <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}">
                    ${translations[currentLang][item.type]}
                </span>
            </td>
            <td class="p-4">
                <div class="font-medium text-zinc-900">${item.title}</div>
                <div class="text-xs text-zinc-500 truncate max-w-xs">${item.description}</div>
            </td>
            <td class="p-4 text-sm text-zinc-600">${translations[currentLang][item.category]}</td>
            <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-zinc-100 text-zinc-800'}">
                    ${translations[currentLang][item.status]}
                </span>
                ${matches.length > 0 ? `<div class="mt-2 text-xs text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded border border-amber-200"><i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>${matches.length} match(es)</div>` : ''}
            </td>
            <td class="p-4 text-right space-x-2">
                ${matches.length > 0 ? `<button onclick="matchItems('${item.id}', '${matches[0].id}')" class="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium"><i data-lucide="check-circle" class="w-4 h-4 mr-1.5"></i>${translations[currentLang].match}</button>` : ''}
                <button onclick="deleteItem('${item.id}')" class="inline-flex items-center p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
            </td>
        </tr>
        `;
    }).join('');
    lucide.createIcons();
}

function matchItems(id1, id2) {
    const i1 = items.find(i => i.id === id1);
    const i2 = items.find(i => i.id === id2);
    if (i1) i1.status = 'matched';
    if (i2) i2.status = 'matched';
    saveItems();
    renderAdminTable();
}

function deleteItem(id) {
    if (confirm(currentLang === 'en' ? 'Are you sure you want to delete this item?' : '確定要刪除此物品嗎？')) {
        items = items.filter(i => i.id !== id);
        saveItems();
        renderAdminTable();
    }
}

// --- INIT ---
applyTranslations();
updateNav();
showView('home');
lucide.createIcons();
