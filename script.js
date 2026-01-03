// GUA Eğitim Portalı - Ana Uygulama Mantığı

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Login formunu dinle
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    // Diğer formları dinle
    document.getElementById('add-user-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewUser();
    });

    document.getElementById('upload-video-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadVideo();
    });

    document.getElementById('add-category-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addCategory();
    });

    document.getElementById('edit-profile-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });

    // Onay modalı butonlarını dinle
    document.getElementById('confirm-cancel')?.addEventListener('click', function() {
        hideConfirmationModal();
    });

    document.getElementById('confirm-ok')?.addEventListener('click', function() {
        if (window.pendingAction) {
            window.pendingAction();
            hideConfirmationModal();
        }
    });

    // Başlangıçta demo hesapları göster
    showDemoAccounts();
});

// Login fonksiyonu
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kullanıcıyı bul
    const user = appData.users.find(u => 
        u.username === username && u.password === password && u.isActive
    );

    if (user) {
        // Giriş başarılı
        appData.currentUser = user;
        
        // Son giriş zamanını güncelle
        const now = new Date();
        user.lastLogin = now.toISOString().replace('T', ' ').substr(0, 16);
        
        // Log ekle
        addLog('success', `${user.fullName} sisteme giriş yaptı`, user.username);
        
        // Verileri kaydet
        saveAppData();
        
        // Ana uygulamayı göster
        showApp();
        
        // Kullanıcıyı karşılama mesajı göster
        setTimeout(() => {
            showNotification('success', `Hoş geldiniz, ${user.fullName}!`);
        }, 500);
    } else {
        // Giriş başarısız
        showNotification('danger', 'Kullanıcı adı veya şifre hatalı!');
        
        // Log ekle
        addLog('danger', 'Başarısız giriş denemesi', 'unknown');
        saveAppData();
    }
}

// Ana uygulamayı göster
function showApp() {
    // Login sayfasını gizle
    document.getElementById('login-page').style.display = 'none';
    
    // Ana uygulamayı göster
    document.getElementById('app').style.display = 'block';
    
    // Kullanıcı bilgilerini güncelle
    updateUserInfo();
    
    // Sayfayı yükle
    showPage('home');
    
    // Admin linkini kontrol et
    if (appData.currentUser.role !== 'admin') {
        document.getElementById('admin-nav').style.display = 'none';
    } else {
        document.getElementById('admin-nav').style.display = 'block';
    }
}

// Kullanıcı bilgilerini güncelle
function updateUserInfo() {
    const user = appData.currentUser;
    
    // Avatar ve isim
    document.getElementById('current-user-name').textContent = user.fullName;
    document.getElementById('header-avatar').textContent = user.fullName.charAt(0);
    document.getElementById('header-avatar').style.backgroundColor = user.avatarColor;
    
    // Rol badge
    const roleBadge = document.getElementById('current-user-role');
    roleBadge.textContent = user.role === 'admin' ? 'TÜM YETKİLER' : 'SADECE İZLEME';
    roleBadge.className = user.role === 'admin' ? 'role-badge role-admin' : 'role-badge role-user';
    
    // Profil sayfası bilgileri
    document.getElementById('profile-avatar').textContent = user.fullName.charAt(0);
    document.getElementById('profile-avatar').style.backgroundColor = user.avatarColor;
    document.getElementById('profile-name').textContent = user.fullName;
    document.getElementById('profile-department').textContent = user.department;
    document.getElementById('profile-email').textContent = user.email;
    
    // Hoş geldin mesajı
    document.getElementById('welcome-message').textContent = `Hoş Geldiniz, ${user.fullName}!`;
}

// Sayfa değiştirme
function showPage(pageName) {
    // Geçerli sayfayı kaydet
    appData.currentPage = pageName;
    
    // Tüm sayfaları gizle
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.style.display = 'none';
    });
    
    // Aktif navigasyon linkini güncelle
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // İstenen sayfayı göster
    document.getElementById(`${pageName}-page`).style.display = 'block';
    
    // Navigasyon linkini aktif yap
    const navLink = document.querySelector(`.nav-links a[onclick*="${pageName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Sayfa içeriğini yükle
    switch(pageName) {
        case 'home':
            loadHomePage();
            break;
        case 'videos':
            loadVideosPage();
            break;
        case 'admin':
            loadAdminPage();
            break;
        case 'profile':
            loadProfilePage();
            break;
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Ana sayfayı yükle
function loadHomePage() {
    // İstatistikleri göster
    const stats = calculateStats();
    document.getElementById('home-total-videos').textContent = stats.totalVideos;
    document.getElementById('home-total-users').textContent = stats.totalUsers;
    document.getElementById('home-total-views').textContent = stats.totalViews;
    
    // Son eklenen videoları göster (en fazla 6)
    const recentVideos = [...appData.videos]
        .filter(v => v.isActive)
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(0, 6);
    
    displayVideos(recentVideos, 'home-video-grid');
}

// Videolar sayfasını yükle
function loadVideosPage() {
    const allVideos = appData.videos.filter(v => v.isActive);
    displayVideos(allVideos, 'all-videos-grid');
}

// Admin sayfasını yükle
function loadAdminPage() {
    if (appData.currentUser.role !== 'admin') {
        showNotification('danger', 'Bu sayfaya erişim izniniz yok!');
        showPage('home');
        return;
    }
    
    // İstatistikleri göster
    const stats = calculateStats();
    document.getElementById('dashboard-users').textContent = stats.totalUsers;
    document.getElementById('dashboard-videos').textContent = stats.totalVideos;
    document.getElementById('dashboard-views').textContent = stats.totalViews;
    document.getElementById('dashboard-deleted').textContent = stats.totalDeleted;
    
    // Footer istatistiklerini güncelle
    document.getElementById('footer-users').textContent = `${stats.totalUsers} Kullanıcı`;
    document.getElementById('footer-videos').textContent = `${stats.totalVideos} Video`;
    document.getElementById('footer-deleted').textContent = `${stats.totalDeleted} Silinen`;
    
    // Kullanıcıları yükle
    loadUsersTable();
    
    // Videoları yükle
    loadAdminVideosTable();
    
    // Kategorileri yükle
    loadCategoriesGrid();
    
    // Logları yükle
    loadSystemLogs();
    
    // Varsayılan olarak kullanıcılar tabını göster
    showAdminTab('users');
}

// Profil sayfasını yükle
function loadProfilePage() {
    const user = appData.currentUser;
    
    // Admin istatistiklerini göster
    document.getElementById('admin-total-videos').textContent = user.stats.videosAdded || 0;
    document.getElementById('admin-deleted-videos').textContent = user.stats.videosDeleted || 0;
    document.getElementById('admin-added-users').textContent = user.stats.usersAdded || 0;
    document.getElementById('admin-system-logs').textContent = appData.logs.length;
    
    // Son yönetici işlemlerini göster
    loadRecentAdminActions();
}

// Sidebar'ı güncelle
function updateSidebar() {
    // Kategorileri yükle
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    
    appData.categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="filterByCategory('${category.name}'); return false;">
                <span class="category-color" style="background-color: ${category.color}; width: 12px; height: 12px; display: inline-block; border-radius: 50%; margin-right: 8px;"></span>
                ${category.name} (${category.videoCount})
            </a>
        `;
        categoryList.appendChild(li);
    });
    
    // İlerlemeyi güncelle
    updateProgress();
}

// İlerlemeyi güncelle
function updateProgress() {
    const user = appData.currentUser;
    const totalVideos = appData.videos.filter(v => v.isActive).length;
    const completedVideos = user.watchedVideos.length;
    const percentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    
    document.getElementById('progress-percentage').textContent = `%${percentage}`;
    document.getElementById('progress-bar-fill').style.width = `${percentage}%`;
    document.getElementById('completed-videos').textContent = completedVideos;
    document.getElementById('total-videos').textContent = totalVideos;
}

// Videoları grid'e yükle
function displayVideos(videos, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (videos.length === 0) {
        container.innerHTML = '<div class="no-content"><p>Henüz video bulunmuyor.</p></div>';
        return;
    }
    
    videos.forEach(video => {
        const isWatched = appData.currentUser.watchedVideos.includes(video.id);
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-thumbnail" style="background-color: ${getCategoryColor(video.category)};">
                <i class="fas fa-play-circle"></i>
                <div class="video-duration">${video.duration} dk</div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <div class="video-meta">
                    <span class="video-category">${video.category}</span>
                    <span class="video-views">
                        <i class="fas fa-eye"></i> ${video.views} izlenme
                    </span>
                </div>
                <div class="video-actions">
                    <button class="btn btn-primary btn-sm" onclick="watchVideo(${video.id})">
                        <i class="fas fa-play"></i> ${isWatched ? 'Tekrar İzle' : 'İzle'}
                    </button>
                    ${appData.currentUser.role === 'admin' ? `
                        <button class="btn btn-danger btn-sm" onclick="deleteVideoConfirmation(${video.id})">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(videoCard);
    });
}

// Kullanıcılar tablosunu yükle
function loadUsersTable() {
    const tableBody = document.getElementById('users-table');
    tableBody.innerHTML = '';
    
    appData.users.forEach(user => {
        if (!user.isActive) return;
        
        const progress = appData.videos.length > 0 
            ? Math.round((user.watchedVideos.length / appData.videos.filter(v => v.isActive).length) * 100) 
            : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <div class="profile-avatar" style="background-color: ${user.avatarColor}; margin-right: 10px;">${user.fullName.charAt(0)}</div>
                    <div>
                        <div><strong>${user.fullName}</strong></div>
                        <small>${user.username}</small>
                    </div>
                </div>
            </td>
            <td>${user.department}</td>
            <td>
                <span class="role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}">
                    ${user.role === 'admin' ? 'YÖNETİCİ' : 'KULLANICI'}
                </span>
            </td>
            <td>${formatDate(user.lastLogin)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 100px; height: 8px; background-color: #e9ecef; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${progress}%; height: 100%; background-color: #57cc99;"></div>
                    </div>
                    <span>${progress}%</span>
                </div>
            </td>
            <td>
                ${appData.currentUser.id !== user.id ? `
                    <button class="btn btn-danger btn-sm" onclick="deleteUserConfirmation(${user.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                ` : '<span class="text-muted">-</span>'}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Admin videos tablosunu yükle
function loadAdminVideosTable() {
    const tableBody = document.getElementById('admin-videos-table');
    tableBody.innerHTML = '';
    
    appData.videos.filter(v => v.isActive).forEach(video => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div><strong>${video.title}</strong></div>
                <small>${video.description}</small>
            </td>
            <td>
                <span class="video-category">${video.category}</span>
            </td>
            <td>${video.duration} dk</td>
            <td>${video.views} izlenme</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteVideoConfirmation(${video.id})">
                    <i class="fas fa-trash"></i> Sil
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Kategoriler grid'ini yükle
function loadCategoriesGrid() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    
    appData.categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.style.borderLeftColor = category.color;
        card.innerHTML = `
            <div class="category-header">
                <h4>${category.name}</h4>
                <span class="category-count">${category.videoCount} video</span>
            </div>
            <p>${category.description || 'Açıklama yok'}</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i> Düzenle
                </button>
                ${category.videoCount === 0 ? `
                    <button class="btn btn-danger btn-sm" onclick="deleteCategoryConfirmation(${category.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Kategori seçimini yükle (video yükleme modalı için)
    loadCategoryOptions();
}

// Sistem loglarını yükle
function loadSystemLogs() {
    const container = document.getElementById('system-logs');
    container.innerHTML = '';
    
    // En yeni loglar en üstte
    const recentLogs = [...appData.logs].reverse().slice(0, 10);
    
    recentLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        let iconClass = '';
        switch(log.type) {
            case 'success': iconClass = 'log-icon-success'; break;
            case 'danger': iconClass = 'log-icon-danger'; break;
            default: iconClass = 'log-icon-info';
        }
        
        logEntry.innerHTML = `
            <div class="log-icon ${iconClass}">
                <i class="fas fa-${log.type === 'success' ? 'check-circle' : log.type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="log-content">
                <p><strong>${log.message}</strong> - ${log.user}</p>
                <p><small>${log.details}</small></p>
                <div class="log-time">${formatDate(log.timestamp)}</div>
            </div>
        `;
        container.appendChild(logEntry);
    });
}

// Son yönetici işlemlerini yükle
function loadRecentAdminActions() {
    const container = document.getElementById('admin-recent-actions');
    container.innerHTML = '';
    
    // Mevcut kullanıcının işlemlerini filtrele
    const userLogs = appData.logs
        .filter(log => log.user === appData.currentUser.username)
        .reverse()
        .slice(0, 5);
    
    if (userLogs.length === 0) {
        container.innerHTML = '<p class="text-muted">Henüz işlem kaydı bulunmuyor.</p>';
        return;
    }
    
    userLogs.forEach(log => {
        const action = document.createElement('div');
        action.className = 'log-entry';
        action.style.padding = '10px 0';
        action.style.borderBottom = '1px solid #e9ecef';
        
        action.innerHTML = `
            <div style="flex: 1;">
                <p style="margin-bottom: 5px;"><strong>${log.message}</strong></p>
                <small class="text-muted">${formatDate(log.timestamp)}</small>
            </div>
        `;
        container.appendChild(action);
    });
}

// Demo hesapları göster
function showDemoAccounts() {
    // Bu fonksiyon zaten HTML'de demo hesapları gösteriyor
    // JavaScript ile ekstra bir şey yapmaya gerek yok
}

// Yeni kullanıcı ekle
function addNewUser() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const fullName = document.getElementById('new-fullname').value;
    const email = document.getElementById('new-email').value;
    const department = document.getElementById('new-department').value;
    const role = document.getElementById('new-role').value;
    
    // Kullanıcı adı kontrolü
    if (appData.users.some(u => u.username === username)) {
        showNotification('danger', 'Bu kullanıcı adı zaten kullanılıyor!');
        return;
    }
    
    // Avatar rengi oluştur
    const avatarColors = ['#1a5f7a', '#57cc99', '#ff9a3c', '#ff6b6b', '#6c757d', '#17a2b8', '#6610f2'];
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    
    // Yeni kullanıcı oluştur
    const newUser = {
        id: appData.nextUserId++,
        username,
        password,
        fullName,
        email,
        department,
        role,
        avatarColor,
        lastLogin: new Date().toISOString().replace('T', ' ').substr(0, 16),
        createdAt: new Date().toISOString().split('T')[0],
        watchedVideos: [],
        isActive: true,
        stats: {
            videosWatched: 0,
            videosAdded: 0,
            usersAdded: 0,
            videosDeleted: 0
        }
    };
    
    // Kullanıcıyı ekle
    appData.users.push(newUser);
    
    // Eğer admin ekliyorsa, admin istatistiğini güncelle
    if (appData.currentUser.role === 'admin') {
        appData.currentUser.stats.usersAdded = (appData.currentUser.stats.usersAdded || 0) + 1;
    }
    
    // Log ekle
    addLog('success', `Yeni kullanıcı eklendi: ${fullName}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Formu temizle ve modal'ı kapat
    document.getElementById('add-user-form').reset();
    closeModal('add-user');
    
    // Bildirim göster
    showNotification('success', 'Kullanıcı başarıyla eklendi!');
    
    // Kullanıcılar tablosunu yenile
    if (appData.currentPage === 'admin') {
        loadUsersTable();
        
        // İstatistikleri güncelle
        const stats = calculateStats();
        document.getElementById('dashboard-users').textContent = stats.totalUsers;
        document.getElementById('home-total-users').textContent = stats.totalUsers;
    }
}

// Video yükle
function uploadVideo() {
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const category = document.getElementById('video-category').value;
    const duration = parseInt(document.getElementById('video-duration').value);
    const url = document.getElementById('video-url').value || `https://example.com/video${appData.nextVideoId}.mp4`;
    
    // Yeni video oluştur
    const newVideo = {
        id: appData.nextVideoId++,
        title,
        description,
        category,
        duration,
        url,
        uploadDate: new Date().toISOString().split('T')[0],
        uploader: appData.currentUser.username,
        views: 0,
        isActive: true
    };
    
    // Videoyu ekle
    appData.videos.push(newVideo);
    
    // Kategori video sayısını güncelle
    updateCategoryCounts();
    
    // Admin istatistiğini güncelle
    if (appData.currentUser.role === 'admin') {
        appData.currentUser.stats.videosAdded = (appData.currentUser.stats.videosAdded || 0) + 1;
    }
    
    // Log ekle
    addLog('success', `Yeni video yüklendi: ${title}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Formu temizle ve modal'ı kapat
    document.getElementById('upload-video-form').reset();
    closeModal('upload-video');
    
    // Bildirim göster
    showNotification('success', 'Video başarıyla yüklendi!');
    
    // Videoları yenile
    if (appData.currentPage === 'home') {
        loadHomePage();
    } else if (appData.currentPage === 'videos') {
        loadVideosPage();
    } else if (appData.currentPage === 'admin') {
        loadAdminVideosTable();
        loadCategoriesGrid();
        
        // İstatistikleri güncelle
        const stats = calculateStats();
        document.getElementById('dashboard-videos').textContent = stats.totalVideos;
        document.getElementById('home-total-videos').textContent = stats.totalVideos;
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Yeni kategori ekle
function addCategory() {
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    const color = document.getElementById('category-color').value;
    
    // Kategori adı kontrolü
    if (appData.categories.some(c => c.name === name)) {
        showNotification('danger', 'Bu kategori adı zaten kullanılıyor!');
        return;
    }
    
    // Yeni kategori oluştur
    const newCategory = {
        id: appData.nextCategoryId++,
        name,
        description,
        color,
        videoCount: 0
    };
    
    // Kategoriyi ekle
    appData.categories.push(newCategory);
    
    // Log ekle
    addLog('success', `Yeni kategori eklendi: ${name}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Formu temizle ve modal'ı kapat
    document.getElementById('add-category-form').reset();
    closeModal('add-category');
    
    // Bildirim göster
    showNotification('success', 'Kategori başarıyla eklendi!');
    
    // Kategorileri yenile
    if (appData.currentPage === 'admin') {
        loadCategoriesGrid();
        loadCategoryOptions();
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Profil güncelle
function updateProfile() {
    const fullName = document.getElementById('edit-fullname').value;
    const email = document.getElementById('edit-email').value;
    const department = document.getElementById('edit-department').value;
    const password = document.getElementById('edit-password').value;
    
    // Kullanıcıyı güncelle
    const user = appData.currentUser;
    user.fullName = fullName;
    user.email = email;
    user.department = department;
    
    // Şifre değiştirilmişse güncelle
    if (password.trim() !== '') {
        user.password = password;
    }
    
    // Log ekle
    addLog('info', 'Profil bilgileri güncellendi', user.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Formu temizle ve modal'ı kapat
    document.getElementById('edit-profile-form').reset();
    closeModal('edit-profile');
    
    // Bildirim göster
    showNotification('success', 'Profil başarıyla güncellendi!');
    
    // Kullanıcı bilgilerini yenile
    updateUserInfo();
    
    // Profil sayfasını yenile
    if (appData.currentPage === 'profile') {
        loadProfilePage();
    }
}

// Kategori seçeneklerini yükle (modal için)
function loadCategoryOptions() {
    const select = document.getElementById('video-category');
    if (!select) return;
    
    select.innerHTML = '<option value="">Kategori Seçin</option>';
    appData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Video izle
function watchVideo(videoId) {
    const video = appData.videos.find(v => v.id === videoId);
    if (!video) return;
    
    // İzlenme sayısını artır
    video.views++;
    
    // Kullanıcının izlediği videolara ekle (daha önce izlemediyse)
    if (!appData.currentUser.watchedVideos.includes(videoId)) {
        appData.currentUser.watchedVideos.push(videoId);
        appData.currentUser.stats.videosWatched++;
    }
    
    // Log ekle
    addLog('success', `Video izlendi: ${video.title}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Bildirim göster
    showNotification('info', `${video.title} videosunu izliyorsunuz...`);
    
    // Gerçek bir video oynatıcı olmadığı için demo mesajı göster
    setTimeout(() => {
        if (confirm('Video izleme simülasyonu tamamlandı. Video izlendi olarak işaretlensin mi?')) {
            // İlerlemeyi güncelle
            updateProgress();
            
            // Profil istatistiklerini güncelle
            if (appData.currentPage === 'profile') {
                loadProfilePage();
            }
            
            showNotification('success', 'Video izleme kaydınız güncellendi!');
        }
    }, 1000);
}

// Video silme onayı
function deleteVideoConfirmation(videoId) {
    const video = appData.videos.find(v => v.id === videoId);
    if (!video) return;
    
    showConfirmationModal(
        'Video Sil',
        `"${video.title}" videosunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        function() {
            deleteVideo(videoId);
        }
    );
}

// Video sil
function deleteVideo(videoId) {
    const videoIndex = appData.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;
    
    const video = appData.videos[videoIndex];
    
    // Videoyu sil (aktif durumunu false yap)
    video.isActive = false;
    
    // Silinen videolar listesine ekle
    appData.deletedVideos.push({
        ...video,
        deletedDate: new Date().toISOString().split('T')[0],
        deletedBy: appData.currentUser.username,
        originalId: video.id
    });
    
    // Kategori video sayısını güncelle
    updateCategoryCounts();
    
    // Admin istatistiğini güncelle
    if (appData.currentUser.role === 'admin') {
        appData.currentUser.stats.videosDeleted = (appData.currentUser.stats.videosDeleted || 0) + 1;
    }
    
    // Log ekle
    addLog('danger', `Video silindi: ${video.title}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Bildirim göster
    showNotification('warning', 'Video başarıyla silindi!');
    
    // Videoları yenile
    if (appData.currentPage === 'home') {
        loadHomePage();
    } else if (appData.currentPage === 'videos') {
        loadVideosPage();
    } else if (appData.currentPage === 'admin') {
        loadAdminVideosTable();
        loadCategoriesGrid();
        
        // İstatistikleri güncelle
        const stats = calculateStats();
        document.getElementById('dashboard-videos').textContent = stats.totalVideos;
        document.getElementById('dashboard-deleted').textContent = stats.totalDeleted;
        document.getElementById('home-total-videos').textContent = stats.totalVideos;
        document.getElementById('footer-deleted').textContent = `${stats.totalDeleted} Silinen`;
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Kullanıcı silme onayı
function deleteUserConfirmation(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (!user) return;
    
    // Kendini silme kontrolü
    if (userId === appData.currentUser.id) {
        showNotification('danger', 'Kendi hesabınızı silemezsiniz!');
        return;
    }
    
    showConfirmationModal(
        'Kullanıcı Sil',
        `"${user.fullName}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        function() {
            deleteUser(userId);
        }
    );
}

// Kullanıcı sil
function deleteUser(userId) {
    const userIndex = appData.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;
    
    const user = appData.users[userIndex];
    
    // Kullanıcıyı sil (aktif durumunu false yap)
    user.isActive = false;
    
    // Log ekle
    addLog('danger', `Kullanıcı silindi: ${user.fullName}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Bildirim göster
    showNotification('warning', 'Kullanıcı başarıyla silindi!');
    
    // Kullanıcıları yenile
    if (appData.currentPage === 'admin') {
        loadUsersTable();
        
        // İstatistikleri güncelle
        const stats = calculateStats();
        document.getElementById('dashboard-users').textContent = stats.totalUsers;
        document.getElementById('home-total-users').textContent = stats.totalUsers;
    }
}

// Kategori silme onayı
function deleteCategoryConfirmation(categoryId) {
    const category = appData.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Kategoriye ait video kontrolü
    if (category.videoCount > 0) {
        showNotification('danger', 'Bu kategoride videolar bulunuyor. Önce videoları silin veya taşıyın.');
        return;
    }
    
    showConfirmationModal(
        'Kategori Sil',
        `"${category.name}" kategorisini silmek istediğinize emin misiniz?`,
        function() {
            deleteCategory(categoryId);
        }
    );
}

// Kategori sil
function deleteCategory(categoryId) {
    const categoryIndex = appData.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const category = appData.categories[categoryIndex];
    
    // Kategoriyi sil
    appData.categories.splice(categoryIndex, 1);
    
    // Log ekle
    addLog('danger', `Kategori silindi: ${category.name}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Bildirim göster
    showNotification('warning', 'Kategori başarıyla silindi!');
    
    // Kategorileri yenile
    if (appData.currentPage === 'admin') {
        loadCategoriesGrid();
        loadCategoryOptions();
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Kategori düzenle (basit versiyon)
function editCategory(categoryId) {
    const category = appData.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const newName = prompt('Yeni kategori adı:', category.name);
    if (!newName || newName.trim() === '') return;
    
    const newDescription = prompt('Yeni açıklama:', category.description || '');
    
    // Kategoriyi güncelle
    category.name = newName;
    category.description = newDescription;
    
    // Log ekle
    addLog('info', `Kategori güncellendi: ${newName}`, appData.currentUser.username);
    
    // Verileri kaydet
    saveAppData();
    
    // Bildirim göster
    showNotification('success', 'Kategori başarıyla güncellendi!');
    
    // Kategorileri yenile
    if (appData.currentPage === 'admin') {
        loadCategoriesGrid();
        loadCategoryOptions();
    }
    
    // Sidebar'ı güncelle
    updateSidebar();
}

// Admin tablarını göster
function showAdminTab(tabName) {
    // Tüm tabları gizle
    document.getElementById('users-tab').style.display = 'none';
    document.getElementById('videos-tab').style.display = 'none';
    document.getElementById('categories-tab').style.display = 'none';
    document.getElementById('logs-tab').style.display = 'none';
    
    // Tüm tab butonlarını pasif yap
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // İstenen tab'ı göster
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Tab butonunu aktif yap
    document.querySelector(`.tab-btn[onclick*="${tabName}"]`).classList.add('active');
}

// Modal göster
function showModal(modalName) {
    // İlgili modal'ı göster
    document.getElementById(`${modalName}-modal`).style.display = 'flex';
    
    // Eğer video yükleme modalı ise kategori seçeneklerini yükle
    if (modalName === 'upload-video') {
        loadCategoryOptions();
    }
    
    // Eğer profil düzenleme modalı ise mevcut bilgileri yükle
    if (modalName === 'edit-profile') {
        const user = appData.currentUser;
        document.getElementById('edit-fullname').value = user.fullName;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-department').value = user.department;
        document.getElementById('edit-password').value = '';
    }
}

// Modal kapat
function closeModal(modalName) {
    document.getElementById(`${modalName}-modal`).style.display = 'none';
}

// Onay modalını göster
function showConfirmationModal(title, message, confirmAction) {
    document.getElementById('confirmation-title').textContent = title;
    document.getElementById('confirmation-message').textContent = message;
    document.getElementById('confirmation-modal').style.display = 'flex';
    
    // Onay butonunu güncelle
    const confirmBtn = document.getElementById('confirm-ok');
    if (title.includes('Sil')) {
        confirmBtn.textContent = 'Sil';
        confirmBtn.className = 'btn btn-danger';
    } else {
        confirmBtn.textContent = 'Onayla';
        confirmBtn.className = 'btn btn-primary';
    }
    
    // Bekleyen işlemi kaydet
    window.pendingAction = confirmAction;
}

// Onay modalını gizle
function hideConfirmationModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    window.pendingAction = null;
}

// Bildirim göster
function showNotification(type, message) {
    // Basit bir bildirim sistemi
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 9999; background-color: ${type === 'success' ? '#28a745' : type === 'danger' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; max-width: 400px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}" style="margin-right: 10px; font-size: 1.2rem;"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 5 saniye sonra bildirimi kaldır
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Log ekle
function addLog(type, message, user) {
    const newLog = {
        id: appData.nextLogId++,
        type,
        message,
        user,
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16),
        details: `${type} log - ${new Date().toLocaleTimeString()}`
    };
    
    appData.logs.push(newLog);
    
    // Log sayısını sınırla (en fazla 100)
    if (appData.logs.length > 100) {
        appData.logs = appData.logs.slice(-100);
    }
}

// Yardımcı fonksiyonlar
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function getCategoryColor(categoryName) {
    const category = appData.categories.find(c => c.name === categoryName);
    return category ? category.color : '#6c757d';
}

function filterByCategory(categoryName) {
    const videos = appData.videos.filter(v => v.category === categoryName && v.isActive);
    
    // Videolar sayfasına git
    showPage('videos');
    
    // Videoları göster
    setTimeout(() => {
        displayVideos(videos, 'all-videos-grid');
        
        // Filtre uygulandığını belirt
        document.querySelector('.page-header h2').innerHTML = `<i class="fas fa-filter"></i> ${categoryName} Kategorisindeki Videolar`;
    }, 100);
}

// Çıkış yap
function logout() {
    // Onay iste
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        // Log ekle
        addLog('info', `${appData.currentUser.fullName} sistemden çıkış yaptı`, appData.currentUser.username);
        
        // Verileri kaydet
        saveAppData();
        
        // Ana uygulamayı gizle
        document.getElementById('app').style.display = 'none';
        
        // Login sayfasını göster
        document.getElementById('login-page').style.display = 'flex';
        
        // Formu temizle
        document.getElementById('login-form').reset();
        
        // Bildirim göster
        showNotification('info', 'Başarıyla çıkış yapıldı.');
    }
}

// Sayfa yenilendiğinde verileri yükle
window.onload = function() {
    // Verileri localStorage'dan yükle
    loadAppData();
    
    // Eğer kullanıcı oturum açmışsa uygulamayı göster
    if (appData.currentUser) {
        showApp();
    }
};