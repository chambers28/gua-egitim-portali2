// GUA Eğitim Portalı - Veri Yönetimi
let appData = {
    // Kullanıcılar
    users: [
        {
            id: 1,
            username: "admin",
            password: "admin123",
            fullName: "Sistem Yöneticisi",
            email: "admin@guaportal.com",
            department: "Yönetim",
            role: "admin",
            avatarColor: "#1a5f7a",
            lastLogin: "2023-10-15 14:30",
            createdAt: "2023-01-01",
            watchedVideos: [1, 3, 5],
            isActive: true,
            stats: {
                videosWatched: 3,
                videosAdded: 12,
                usersAdded: 5,
                videosDeleted: 2
            }
        },
        {
            id: 2,
            username: "yonetici",
            password: "yonetici123",
            fullName: "Eğitim Yöneticisi",
            email: "yonetici@guaportal.com",
            department: "İnsan Kaynakları",
            role: "admin",
            avatarColor: "#57cc99",
            lastLogin: "2023-10-14 09:15",
            createdAt: "2023-02-15",
            watchedVideos: [1, 2, 4, 6],
            isActive: true,
            stats: {
                videosWatched: 4,
                videosAdded: 8,
                usersAdded: 3,
                videosDeleted: 1
            }
        },
        {
            id: 3,
            username: "ahmet",
            password: "ahmet123",
            fullName: "Ahmet Yılmaz",
            email: "ahmet@guaportal.com",
            department: "Üretim",
            role: "user",
            avatarColor: "#ff9a3c",
            lastLogin: "2023-10-13 11:20",
            createdAt: "2023-03-10",
            watchedVideos: [1, 4],
            isActive: true,
            stats: {
                videosWatched: 2,
                videosAdded: 0,
                usersAdded: 0,
                videosDeleted: 0
            }
        },
        {
            id: 4,
            username: "ayşe",
            password: "ayşe123",
            fullName: "Ayşe Demir",
            email: "ayse@guaportal.com",
            department: "Kalite Kontrol",
            role: "user",
            avatarColor: "#ff6b6b",
            lastLogin: "2023-10-12 16:45",
            createdAt: "2023-03-20",
            watchedVideos: [1, 2, 3],
            isActive: true,
            stats: {
                videosWatched: 3,
                videosAdded: 0,
                usersAdded: 0,
                videosDeleted: 0
            }
        },
        {
            id: 5,
            username: "mehmet",
            password: "mehmet123",
            fullName: "Mehmet Kaya",
            email: "mehmet@guaportal.com",
            department: "Pazarlama",
            role: "user",
            avatarColor: "#6c757d",
            lastLogin: "2023-10-10 10:00",
            createdAt: "2023-04-05",
            watchedVideos: [],
            isActive: true,
            stats: {
                videosWatched: 0,
                videosAdded: 0,
                usersAdded: 0,
                videosDeleted: 0
            }
        }
    ],

    // Videolar
    videos: [
        {
            id: 1,
            title: "Gıda Güvenliği Temelleri",
            description: "Gıda üretiminde temel güvenlik kuralları ve standartlar",
            category: "Gıda Güvenliği",
            duration: 25,
            url: "https://example.com/video1.mp4",
            uploadDate: "2023-09-10",
            uploader: "admin",
            views: 42,
            isActive: true
        },
        {
            id: 2,
            title: "HACCP Prensipleri",
            description: "Tehlike Analizi ve Kritik Kontrol Noktaları sistemi",
            category: "Gıda Güvenliği",
            duration: 32,
            url: "https://example.com/video2.mp4",
            uploadDate: "2023-09-12",
            uploader: "yonetici",
            views: 28,
            isActive: true
        },
        {
            id: 3,
            title: "Üretim Hattı Temizliği",
            description: "Gıda üretim hatlarında etkili temizlik yöntemleri",
            category: "Üretim Süreçleri",
            duration: 18,
            url: "https://example.com/video3.mp4",
            uploadDate: "2023-09-15",
            uploader: "admin",
            views: 35,
            isActive: true
        },
        {
            id: 4,
            title: "Kalite Kontrol Testleri",
            description: "Gıda kalitesi kontrolünde kullanılan test yöntemleri",
            category: "Kalite Kontrol",
            duration: 22,
            url: "https://example.com/video4.mp4",
            uploadDate: "2023-09-18",
            uploader: "yonetici",
            views: 19,
            isActive: true
        },
        {
            id: 5,
            title: "Paketleme Standartları",
            description: "Gıda ürünlerinde paketleme ve etiketleme kuralları",
            category: "Üretim Süreçleri",
            duration: 20,
            url: "https://example.com/video5.mp4",
            uploadDate: "2023-09-20",
            uploader: "admin",
            views: 24,
            isActive: true
        },
        {
            id: 6,
            title: "Soğuk Zincir Yönetimi",
            description: "Soğuk zincirde sıcaklık kontrolü ve izlenebilirlik",
            category: "Lojistik",
            duration: 28,
            url: "https://example.com/video6.mp4",
            uploadDate: "2023-09-22",
            uploader: "yonetici",
            views: 15,
            isActive: true
        },
        {
            id: 7,
            title: "Personel Hijyen Eğitimi",
            description: "Gıda işletmelerinde personel hijyen kuralları",
            category: "Gıda Güvenliği",
            duration: 15,
            url: "https://example.com/video7.mp4",
            uploadDate: "2023-10-05",
            uploader: "admin",
            views: 31,
            isActive: true
        },
        {
            id: 8,
            title: "Depolama Koşulları",
            description: "Gıda ürünleri için ideal depolama koşulları",
            category: "Lojistik",
            duration: 17,
            url: "https://example.com/video8.mp4",
            uploadDate: "2023-10-08",
            uploader: "yonetici",
            views: 12,
            isActive: true
        }
    ],

    // Kategoriler
    categories: [
        {
            id: 1,
            name: "Gıda Güvenliği",
            description: "Gıda güvenliği standartları ve uygulamaları",
            color: "#1a5f7a",
            videoCount: 3
        },
        {
            id: 2,
            name: "Üretim Süreçleri",
            description: "Gıda üretim süreçleri ve optimizasyon",
            color: "#57cc99",
            videoCount: 2
        },
        {
            id: 3,
            name: "Kalite Kontrol",
            description: "Kalite kontrol testleri ve standartları",
            color: "#ff9a3c",
            videoCount: 1
        },
        {
            id: 4,
            name: "Lojistik",
            description: "Depolama, taşıma ve soğuk zincir yönetimi",
            color: "#ff6b6b",
            videoCount: 2
        },
        {
            id: 5,
            name: "Yasal Mevzuat",
            description: "Gıda sektörüne ilişkin yasal düzenlemeler",
            color: "#6c757d",
            videoCount: 0
        }
    ],

    // Sistem Logları
    logs: [
        {
            id: 1,
            type: "success",
            message: "Yeni video yüklendi: Gıda Güvenliği Temelleri",
            user: "admin",
            timestamp: "2023-10-15 14:25",
            details: "Video ID: 1, Kategori: Gıda Güvenliği"
        },
        {
            id: 2,
            type: "info",
            message: "Yeni kullanıcı eklendi: Ahmet Yılmaz",
            user: "admin",
            timestamp: "2023-10-14 10:15",
            details: "Kullanıcı ID: 3, Rol: Kullanıcı"
        },
        {
            id: 3,
            type: "success",
            message: "Video silindi: Eski Eğitim Videosu",
            user: "admin",
            timestamp: "2023-10-13 16:40",
            details: "Video ID: 9, Silen: admin"
        },
        {
            id: 4,
            type: "info",
            message: "Kategori güncellendi: Gıda Güvenliği",
            user: "yonetici",
            timestamp: "2023-10-12 11:20",
            details: "Yeni açıklama eklendi"
        },
        {
            id: 5,
            type: "danger",
            message: "Başarısız giriş denemesi",
            user: "unknown",
            timestamp: "2023-10-11 09:05",
            details: "IP: 192.168.1.100, Kullanıcı adı: test"
        },
        {
            id: 6,
            type: "success",
            message: "Video izlendi: HACCP Prensipleri",
            user: "ahmet",
            timestamp: "2023-10-10 15:30",
            details: "Video ID: 2, Süre: 32 dakika"
        }
    ],

    // Silinen Videolar (çöp kutusu)
    deletedVideos: [
        {
            id: 9,
            title: "Eski Eğitim Videosu",
            description: "Eski versiyon eğitim içeriği",
            category: "Gıda Güvenliği",
            duration: 20,
            deletedDate: "2023-10-13",
            deletedBy: "admin",
            originalId: 9
        }
    ],

    // Geçerli oturum
    currentUser: null,
    currentPage: "home",

    // ID sayaçları
    nextUserId: 6,
    nextVideoId: 9,
    nextCategoryId: 6,
    nextLogId: 7
};

// LocalStorage'dan verileri yükle veya başlangıç verilerini kaydet
function loadAppData() {
    const savedData = localStorage.getItem('guaEgitimPortalData');
    if (savedData) {
        appData = JSON.parse(savedData);
        console.log('Veriler localStorage\'dan yüklendi');
    } else {
        saveAppData();
        console.log('Başlangıç verileri oluşturuldu');
    }
}

// LocalStorage'a verileri kaydet
function saveAppData() {
    localStorage.setItem('guaEgitimPortalData', JSON.stringify(appData));
    console.log('Veriler localStorage\'a kaydedildi');
}

// Kategori başına video sayılarını güncelle
function updateCategoryCounts() {
    appData.categories.forEach(category => {
        category.videoCount = appData.videos.filter(video => 
            video.category === category.name && video.isActive
        ).length;
    });
}

// İstatistikleri hesapla
function calculateStats() {
    const totalVideos = appData.videos.filter(v => v.isActive).length;
    const totalUsers = appData.users.filter(u => u.isActive).length;
    const totalViews = appData.videos.reduce((sum, video) => sum + video.views, 0);
    const totalDeleted = appData.deletedVideos.length;
    
    return { totalVideos, totalUsers, totalViews, totalDeleted };
}

// Başlangıçta verileri yükle
loadAppData();
updateCategoryCounts();