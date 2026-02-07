// ========================================
// STATE & DATA MANAGEMENT
// ========================================

// Array untuk menyimpan semua data izin
let dataIzin = [];

// ID staff yang sedang izin keluar (untuk lock screen)
let currentLockedStaffId = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load data dari localStorage saat halaman pertama kali dibuka
    loadDataFromStorage();
    
    // Render tabel
    renderTable();
    
    // Cek apakah ada staff yang sedang keluar (lock screen)
    checkLockStatus();
    
    // Setup event listeners
    setupEventListeners();
    
    // Security: Disable right click
    disableRightClick();
    
    // Security: Prevent refresh when locked
    preventRefreshWhenLocked();
    
    // Security: Detect tab switch/blur when locked
    detectTabSwitch();
    
    // Start real-time clock
    startRealtimeClock();
});

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
    // Form submit untuk izin baru
    const form = document.getElementById('formIzin');
    form.addEventListener('submit', handleFormSubmit);
    
    // Button ambil waktu di lock screen
    const btnAmbilWaktu = document.getElementById('btnAmbilWaktu');
    btnAmbilWaktu.addEventListener('click', handleAmbilWaktu);
    
    // Button masuk kembali di lock screen
    const btnMasukKembali = document.getElementById('btnMasukKembali');
    btnMasukKembali.addEventListener('click', handleMasukKembali);
    
    // Export buttons
    document.getElementById('btnExportCSV').addEventListener('click', exportToCSV);
    document.getElementById('btnExportExcel').addEventListener('click', exportToExcel);
    
    // Tombol "Sekarang" untuk auto-fill Jam Keluar
    document.getElementById('btnJamKeluarNow').addEventListener('click', function() {
        document.getElementById('jamKeluar').value = getCurrentTime();
    });
}

// ========================================
// FORM SUBMIT HANDLER
// ========================================

function handleAmbilWaktu() {
    // Ambil waktu sekarang
    const waktuSekarang = getCurrentTime();
    
    // Tampilkan di display
    document.getElementById('lockCurrentTime').textContent = waktuSekarang;
    
    // Enable tombol konfirmasi
    document.getElementById('btnMasukKembali').disabled = false;
    
    // Simpan waktu ke variabel sementara (akan digunakan saat konfirmasi)
    document.getElementById('btnMasukKembali').dataset.jamMasuk = waktuSekarang;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Ambil nilai dari form (hanya inisial dan jam keluar)
    const inisial = document.getElementById('inisial').value.trim().toUpperCase();
    const jamKeluar = document.getElementById('jamKeluar').value;
    const keperluan = document.getElementById('keperluan').value.trim();
    
    // Validasi
    if (!inisial || !jamKeluar || !keperluan) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }
    
    // Status selalu KELUAR saat submit form (jam masuk diisi di lock screen)
    const status = 'KELUAR';
    
    // Buat object data izin
    const izinData = {
        id: Date.now(), // Unique ID berdasarkan timestamp
        inisial: inisial,
        jamKeluar: jamKeluar,
        jamMasuk: '', // Kosong saat pertama submit
        durasi: '',
        keperluan: keperluan,
        status: status
    };
    
    // Tambahkan ke array
    dataIzin.push(izinData);
    
    // Simpan ke localStorage
    saveDataToStorage();
    
    // Render ulang tabel
    renderTable();
    
    // Reset form
    e.target.reset();
    
    // Aktifkan lock screen
    currentLockedStaffId = izinData.id;
    saveCurrentLockToStorage();
    showLockScreen(izinData);
    
    // Notifikasi sukses
    alert(`Izin ${status} berhasil dicatat untuk ${inisial}`);
}

// ========================================
// CALCULATE DURATION
// ========================================

function calculateDuration(jamKeluar, jamMasuk) {
    // Parse jam ke menit
    const [keluarHour, keluarMin] = jamKeluar.split(':').map(Number);
    const [masukHour, masukMin] = jamMasuk.split(':').map(Number);
    
    const keluarTotalMin = keluarHour * 60 + keluarMin;
    const masukTotalMin = masukHour * 60 + masukMin;
    
    // Hitung selisih
    let selisihMin = masukTotalMin - keluarTotalMin;
    
    // Jika negatif (lewat tengah malam), tambah 24 jam
    if (selisihMin < 0) {
        selisihMin += 24 * 60;
    }
    
    // Konversi ke jam dan menit
    const hours = Math.floor(selisihMin / 60);
    const minutes = selisihMin % 60;
    
    // Format output
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">Belum ada data izin</td></tr>';
        return;
    }
    
    let html = '';
    dataIzin.forEach((item, index) => {
        const statusClass = item.status === 'KELUAR' ? 'status-keluar' : 'status-masuk';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.inisial}</strong></td>
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
    
    // Isi informasi di lock screen (hanya inisial dan jam keluar)
    document.getElementById('lockInisial').textContent = data.inisial;
    document.getElementById('lockJamKeluar').textContent = data.jamKeluar;
    
    // Reset display waktu dan button
    document.getElementById('lockCurrentTime').textContent = '--:--';
    document.getElementById('btnMasukKembali').disabled = true;
    document.getElementById('btnMasukKembali').dataset.jamMasuk = '';
    
    // Tampilkan lock screen
    lockScreen.classList.remove('hidden');
    
    // Add locked class ke body
    document.body.classList.add('locked');
    
    // Start real-time clock di lock screen
    updateLockClock();
}

function hideLockScreen() {
    const lockScreen = document.getElementById('lockScreen');
    lockScreen.classList.add('hidden');
    
    // Remove locked class dari body
    document.body.classList.remove('locked');
    
    // Clear current locked staff
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
        alert('Mohon klik "ISI JAM SEKARANG" terlebih dahulu!');
        return;
    }
    
    // Cari data staff yang sedang lock
    const staffIndex = dataIzin.findIndex(item => item.id === currentLockedStaffId);
    
    if (staffIndex === -1) {
        alert('Error: Data tidak ditemukan');
        return;
    }
    
    // Update data
    dataIzin[staffIndex].jamMasuk = jamMasuk;
    dataIzin[staffIndex].durasi = calculateDuration(dataIzin[staffIndex].jamKeluar, jamMasuk);
    dataIzin[staffIndex].status = 'MASUK';
    
    // Simpan ke storage
    saveDataToStorage();
    
    // Render ulang tabel
    renderTable();
    
    // Hide lock screen
    hideLockScreen();
    
    // Notifikasi
    alert(`Selamat datang kembali, ${dataIzin[staffIndex].inisial}!`);
}

// ========================================
// CHECK LOCK STATUS ON PAGE LOAD
// ========================================

function checkLockStatus() {
    // Ambil ID staff yang sedang locked dari localStorage
    const lockedId = localStorage.getItem('currentLockedStaffId');
    
    if (lockedId) {
        currentLockedStaffId = parseInt(lockedId);
        
        // Cari data staff tersebut
        const staffData = dataIzin.find(item => item.id === currentLockedStaffId);
        
        if (staffData && staffData.status === 'KELUAR') {
            // Tampilkan lock screen
            showLockScreen(staffData);
        } else {
            // Jika sudah masuk atau tidak ditemukan, clear lock
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
    
    // Header CSV
    let csv = 'No,Inisial,Jam Keluar,Jam Masuk,Total Durasi,Keperluan,Status\n';
    
    // Data rows
    dataIzin.forEach((item, index) => {
        csv += `${index + 1},"${item.inisial}","${item.jamKeluar}","${item.jamMasuk || '-'}","${item.durasi || '-'}","${item.keperluan}","${item.status}"\n`;
    });
    
    // Download
    downloadFile(csv, 'data-izin-staff.csv', 'text/csv');
}

// ========================================
// EXPORT TO EXCEL (HTML TABLE FORMAT)
// ========================================

function exportToExcel() {
    if (dataIzin.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }
    
    // Buat HTML table untuk Excel
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="utf-8"></head>';
    html += '<body>';
    html += '<table border="1">';
    
    // Header
    html += '<thead><tr>';
    html += '<th>No</th>';
    html += '<th>Inisial</th>';
    html += '<th>Jam Keluar</th>';
    html += '<th>Jam Masuk</th>';
    html += '<th>Total Durasi</th>';
    html += '<th>Keperluan</th>';
    html += '<th>Status</th>';
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    dataIzin.forEach((item, index) => {
        html += '<tr>';
        html += `<td>${index + 1}</td>`;
        html += `<td>${item.inisial}</td>`;
        html += `<td>${item.jamKeluar}</td>`;
        html += `<td>${item.jamMasuk || '-'}</td>`;
        html += `<td>${item.durasi || '-'}</td>`;
        html += `<td>${item.keperluan}</td>`;
        html += `<td>${item.status}</td>`;
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    html += '</body></html>';
    
    // Download
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
    // Langsung update pertama kali
    updateClock();
    // Update setiap detik (1000ms)
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    // Array nama hari dan bulan dalam Bahasa Indonesia
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    // Format tanggal manual untuk memastikan akurasi
    const hari = namaHari[now.getDay()];
    const tanggal = now.getDate();
    const bulan = namaBulan[now.getMonth()];
    const tahun = now.getFullYear();
    
    const dateStr = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    
    // Format waktu manual: HH:MM:SS
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    
    const timeStr = `${jam}:${menit}:${detik}`;
    
    // Update DOM header clock
    const clockDate = document.getElementById('clockDate');
    const clockTime = document.getElementById('clockTime');
    
    if (clockDate) clockDate.textContent = dateStr;
    if (clockTime) clockTime.textContent = timeStr;
    
    // Update DOM lock screen clock (jika sedang locked)
    if (currentLockedStaffId) {
        updateLockClock();
    }
}

function updateLockClock() {
    const now = new Date();
    
    // Array nama hari dan bulan
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const hari = namaHari[now.getDay()];
    const tanggal = now.getDate();
    const bulan = namaBulan[now.getMonth()];
    const tahun = now.getFullYear();
    
    const dateStr = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    
    // Format waktu
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    
    const timeStr = `${jam}:${menit}:${detik}`;
    
    // Update lock screen clock
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

// Disable right click pada seluruh halaman
function disableRightClick() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
}

// Prevent refresh saat lock aktif
function preventRefreshWhenLocked() {
    window.addEventListener('beforeunload', function(e) {
        if (currentLockedStaffId) {
            // Tampilkan konfirmasi
            e.preventDefault();
            e.returnValue = 'Anda sedang izin keluar. Yakin ingin menutup halaman?';
            return e.returnValue;
        }
    });
}

// Detect tab switch atau minimize browser saat locked
function detectTabSwitch() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && currentLockedStaffId) {
            // Tab disembunyikan saat lock aktif
            console.log('Tab switched while locked');
            
            // Saat kembali ke tab, pastikan lock screen tetap muncul
            setTimeout(() => {
                if (currentLockedStaffId) {
                    const lockScreen = document.getElementById('lockScreen');
                    if (lockScreen.classList.contains('hidden')) {
                        // Re-show lock screen jika somehow hilang
                        const staffData = dataIzin.find(item => item.id === currentLockedStaffId);
                        if (staffData) {
                            showLockScreen(staffData);
                        }
                    }
                }
            }, 100);
        }
    });
    
    // Detect window blur (kehilangan focus)
    window.addEventListener('blur', function() {
        if (currentLockedStaffId) {
            console.log('Window lost focus while locked');
        }
    });
    
    // Saat kembali focus, re-check lock
    window.addEventListener('focus', function() {
        if (currentLockedStaffId) {
            const lockScreen = document.getElementById('lockScreen');
            if (lockScreen.classList.contains('hidden')) {
                const staffData = dataIzin.find(item => item.id === currentLockedStaffId);
                if (staffData) {
                    showLockScreen(staffData);
                }
            }
        }
    });
}

// ========================================
// KEYBOARD SHORTCUTS (OPTIONAL)
// ========================================

document.addEventListener('keydown', function(e) {
    // F5 atau Ctrl+R untuk refresh - prevent saat locked
    if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && currentLockedStaffId) {
        e.preventDefault();
        alert('Tidak bisa refresh saat sedang izin keluar!');
        return false;
    }
    
    // Ctrl+W atau Alt+F4 untuk close - confirm saat locked
    if ((e.ctrlKey && e.key === 'w') && currentLockedStaffId) {
        e.preventDefault();
        const confirm = window.confirm('Anda sedang izin keluar. Yakin ingin menutup halaman?');
        if (confirm) {
            window.close();
        }
        return false;
    }
});

// ========================================
// CONSOLE INFO (FOR DEBUGGING)
// ========================================

console.log('%c🔒 Sistem Izin Absen Staff', 'color: #2a5298; font-size: 20px; font-weight: bold;');
console.log('%cFull Screen Lock System Active', 'color: #d32f2f; font-size: 14px;');
console.log('Security Features:');
console.log('✓ Right-click disabled');
console.log('✓ Refresh prevention when locked');
console.log('✓ Tab switch detection');
console.log('✓ Data persistence with localStorage');
