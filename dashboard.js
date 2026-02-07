// ========================================
// IMPORT AUTH FUNCTIONS
// ========================================

// Get current user from auth.js functions
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ========================================
// STATE & DATA MANAGEMENT
// ========================================

let dataIzin = [];
let currentLockedStaffId = null;
let currentUser = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    displayUserInfo();
    
    // Load data dari localStorage
    loadDataFromStorage();
    
    // Render tabel
    renderTable();
    
    // Cek apakah ada staff yang sedang keluar (lock screen)
    checkLockStatus();
    
    // Setup event listeners
    setupEventListeners();
    
    // Security features
    disableRightClick();
    preventRefreshWhenLocked();
    detectTabSwitch();
    
    // Start real-time clock
    startRealtimeClock();
});

// ========================================
// DISPLAY USER INFO
// ========================================

function displayUserInfo() {
    document.getElementById('userName').textContent = currentUser.nama;
    document.getElementById('userEmail').textContent = currentUser.email;
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
    // Form submit
    document.getElementById('formIzin').addEventListener('submit', handleFormSubmit);
    
    // Button ambil waktu di lock screen
    document.getElementById('btnAmbilWaktu').addEventListener('click', handleAmbilWaktu);
    
    // Button masuk kembali di lock screen
    document.getElementById('btnMasukKembali').addEventListener('click', handleMasukKembali);
    
    // Export buttons
    document.getElementById('btnExportCSV').addEventListener('click', exportToCSV);
    document.getElementById('btnExportExcel').addEventListener('click', exportToExcel);
    
    // Tombol \"Sekarang\" untuk auto-fill Jam Keluar
    document.getElementById('btnJamKeluarNow').addEventListener('click', function() {
        document.getElementById('jamKeluar').value = getCurrentTime();
    });
    
    // Logout button
    document.getElementById('btnLogout').addEventListener('click', function() {
        if (currentLockedStaffId) {
            alert('Tidak bisa logout saat sedang izin keluar!');
            return;
        }
        
        if (confirm('Yakin ingin logout?')) {
            logoutUser();
        }
    });
}

// ========================================
// FORM SUBMIT HANDLER
// ========================================

function handleAmbilWaktu() {
    const waktuSekarang = getCurrentTime();
    document.getElementById('lockCurrentTime').textContent = waktuSekarang;
    document.getElementById('btnMasukKembali').disabled = false;
    document.getElementById('btnMasukKembali').dataset.jamMasuk = waktuSekarang;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const jamKeluar = document.getElementById('jamKeluar').value;
    const keperluan = document.getElementById('keperluan').value;
    
    if (!jamKeluar || !keperluan) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    const status = 'KELUAR';
    
    const izinData = {
        id: Date.now(),
        userId: currentUser.userId,
        userNama: currentUser.nama,
        userInisial: currentUser.inisial,
        userEmail: currentUser.email,
        tanggal: new Date().toISOString().split('T')[0],
        jamKeluar: jamKeluar,
        jamMasuk: '',
        durasi: '',
        keperluan: keperluan,
        status: status,
        createdAt: new Date().toISOString()
    };
    
    dataIzin.push(izinData);
    saveDataToStorage();
    renderTable();
    
    e.target.reset();
    
    currentLockedStaffId = izinData.id;
    saveCurrentLockToStorage();
    showLockScreen(izinData);
    
    alert(`Izin ${status} berhasil dicatat`);
}

// ========================================
// CALCULATE DURATION
// ========================================

function calculateDuration(jamKeluar, jamMasuk) {
    const [keluarHour, keluarMin] = jamKeluar.split(':').map(Number);
    const [masukHour, masukMin] = jamMasuk.split(':').map(Number);
    
    const keluarTotalMin = keluarHour * 60 + keluarMin;
    const masukTotalMin = masukHour * 60 + masukMin;
    
    let selisihMin = masukTotalMin - keluarTotalMin;
    
    if (selisihMin < 0) {
        selisihMin += 24 * 60;
    }
    
    const hours = Math.floor(selisihMin / 60);
    const minutes = selisihMin % 60;
    
    if (hours === 0) {
        return `${minutes} menit`;
    } else if (minutes === 0) {
        return `${hours} jam`;
    } else {
        return `${hours} jam ${minutes} menit`;
    }
}

// ========================================
// RENDER TABLE
// ========================================

function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (dataIzin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #999;">Belum ada data izin</td></tr>';
        return;
    }
    
    // Sort by date and time descending (newest first)
    const sortedData = [...dataIzin].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    let html = '';
    sortedData.forEach((item, index) => {
        const statusClass = item.status === 'KELUAR' ? 'status-keluar' : 'status-masuk';
        const tanggalFormat = new Date(item.tanggal).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${tanggalFormat}</td>
                <td>${item.userNama}</td>
                <td><strong>${item.userInisial}</strong></td>
                <td>${item.jamKeluar}</td>
                <td>${item.jamMasuk || '-'}</td>
                <td>${item.durasi || '-'}</td>
                <td>${item.keperluan}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// ========================================
// FULL SCREEN LOCK IMPLEMENTATION
// ========================================

function showLockScreen(data) {
    const lockScreen = document.getElementById('lockScreen');
    
    document.getElementById('lockInisial').textContent = data.userInisial;
    document.getElementById('lockJamKeluar').textContent = data.jamKeluar;
    
    document.getElementById('lockCurrentTime').textContent = '--:--';
    document.getElementById('btnMasukKembali').disabled = true;
    document.getElementById('btnMasukKembali').dataset.jamMasuk = '';
    
    lockScreen.classList.remove('hidden');
    document.body.classList.add('locked');
    
    updateLockClock();
}

function hideLockScreen() {
    const lockScreen = document.getElementById('lockScreen');
    lockScreen.classList.add('hidden');
    document.body.classList.remove('locked');
    
    currentLockedStaffId = null;
    saveCurrentLockToStorage();
}

// ========================================
// HANDLE MASUK KEMBALI
// ========================================

function handleMasukKembali() {
    const btnMasukKembali = document.getElementById('btnMasukKembali');
    const jamMasuk = btnMasukKembali.dataset.jamMasuk;
    
    if (!jamMasuk) {
        alert('Mohon klik \"ISI JAM SEKARANG\" terlebih dahulu!');
        return;
    }
    
    const staffIndex = dataIzin.findIndex(item => item.id === currentLockedStaffId);
    
    if (staffIndex === -1) {
        alert('Error: Data tidak ditemukan');
        return;
    }
    
    dataIzin[staffIndex].jamMasuk = jamMasuk;
    dataIzin[staffIndex].durasi = calculateDuration(dataIzin[staffIndex].jamKeluar, jamMasuk);
    dataIzin[staffIndex].status = 'MASUK';
    
    saveDataToStorage();
    renderTable();
    hideLockScreen();
    
    alert(`Selamat datang kembali!`);
}

// ========================================
// CHECK LOCK STATUS ON PAGE LOAD
// ========================================

function checkLockStatus() {
    const lockedId = localStorage.getItem('currentLockedStaffId');
    
    if (lockedId) {
        currentLockedStaffId = parseInt(lockedId);
        const staffData = dataIzin.find(item => item.id === currentLockedStaffId);
        
        if (staffData && staffData.status === 'KELUAR') {
            // Check if it's the current user
            if (staffData.userId === currentUser.userId) {
                showLockScreen(staffData);
            } else {
                // Different user, clear lock
                currentLockedStaffId = null;
                saveCurrentLockToStorage();
            }
        } else {
            currentLockedStaffId = null;
            saveCurrentLockToStorage();
        }
    }
}

// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================

function saveDataToStorage() {
    localStorage.setItem('dataIzinStaff', JSON.stringify(dataIzin));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('dataIzinStaff');
    if (stored) {
        dataIzin = JSON.parse(stored);
    }
}

function saveCurrentLockToStorage() {
    if (currentLockedStaffId) {
        localStorage.setItem('currentLockedStaffId', currentLockedStaffId.toString());
    } else {
        localStorage.removeItem('currentLockedStaffId');
    }
}

// ========================================
// EXPORT TO CSV
// ========================================

function exportToCSV() {
    if (dataIzin.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }
    
    let csv = 'No,Tanggal,Nama Staff,Inisial,Jam Keluar,Jam Masuk,Total Durasi,Keperluan,Status\\n';
    
    dataIzin.forEach((item, index) => {
        const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID');
        csv += `${index + 1},"${tanggal}","${item.userNama}","${item.userInisial}","${item.jamKeluar}","${item.jamMasuk || '-'}","${item.durasi || '-'}","${item.keperluan}","${item.status}"\\n`;
    });
    
    downloadFile(csv, 'data-izin-staff.csv', 'text/csv');
}

// ========================================
// EXPORT TO EXCEL
// ========================================

function exportToExcel() {
    if (dataIzin.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }
    
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="utf-8"></head>';
    html += '<body><table border="1">';
    
    html += '<thead><tr>';
    html += '<th>No</th><th>Tanggal</th><th>Nama Staff</th><th>Inisial</th><th>Jam Keluar</th><th>Jam Masuk</th><th>Total Durasi</th><th>Keperluan</th><th>Status</th>';
    html += '</tr></thead>';
    
    html += '<tbody>';
    dataIzin.forEach((item, index) => {
        const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID');
        html += '<tr>';
        html += `<td>${index + 1}</td>`;
        html += `<td>${tanggal}</td>`;
        html += `<td>${item.userNama}</td>`;
        html += `<td>${item.userInisial}</td>`;
        html += `<td>${item.jamKeluar}</td>`;
        html += `<td>${item.jamMasuk || '-'}</td>`;
        html += `<td>${item.durasi || '-'}</td>`;
        html += `<td>${item.keperluan}</td>`;
        html += `<td>${item.status}</td>`;
        html += '</tr>';
    });
    html += '</tbody></table></body></html>';
    
    downloadFile(html, 'data-izin-staff.xls', 'application/vnd.ms-excel');
}

// ========================================
// DOWNLOAD FILE HELPER
// ========================================

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ========================================
// REAL-TIME CLOCK
// ========================================

function startRealtimeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const hari = namaHari[now.getDay()];
    const tanggal = now.getDate();
    const bulan = namaBulan[now.getMonth()];
    const tahun = now.getFullYear();
    const dateStr = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${jam}:${menit}:${detik}`;
    
    const clockDate = document.getElementById('clockDate');
    const clockTime = document.getElementById('clockTime');
    
    if (clockDate) clockDate.textContent = dateStr;
    if (clockTime) clockTime.textContent = timeStr;
    
    if (currentLockedStaffId) {
        updateLockClock();
    }
}

function updateLockClock() {
    const now = new Date();
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const hari = namaHari[now.getDay()];
    const tanggal = now.getDate();
    const bulan = namaBulan[now.getMonth()];
    const tahun = now.getFullYear();
    const dateStr = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${jam}:${menit}:${detik}`;
    
    const lockClockDate = document.getElementById('lockClockDate');
    const lockClockTime = document.getElementById('lockClockTime');
    
    if (lockClockDate) lockClockDate.textContent = dateStr;
    if (lockClockTime) lockClockTime.textContent = timeStr;
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ========================================
// SECURITY FEATURES
// ========================================

function disableRightClick() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
}

function preventRefreshWhenLocked() {
    window.addEventListener('beforeunload', function(e) {
        if (currentLockedStaffId) {
            e.preventDefault();
            e.returnValue = 'Anda sedang izin keluar. Yakin ingin menutup halaman?';
            return e.returnValue;
        }
    });
}

function detectTabSwitch() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && currentLockedStaffId) {
            setTimeout(() => {
                if (currentLockedStaffId) {
                    const lockScreen = document.getElementById('lockScreen');
                    if (lockScreen.classList.contains('hidden')) {
                        const staffData = dataIzin.find(item => item.id === currentLockedStaffId);
                        if (staffData) {
                            showLockScreen(staffData);
                        }
                    }
                }
            }, 100);
        }
    });
}

// ========================================
// CONSOLE INFO
// ========================================

console.log('%c🔒 Dashboard Loaded', 'color: #2a5298; font-size: 20px; font-weight: bold;');
console.log('User:', currentUser?.nama);
