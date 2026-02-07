# 📱 CARA SHARE APLIKASI KE ANGGOTA LAIN

## 🌐 METODE 1: HOSTING ONLINE (PALING MUDAH)

### A. Netlify Drop (5 Menit)
1. Buka browser → [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop seluruh folder **ABSEN BARU** ke website
3. Tunggu upload selesai
4. Dapatkan link (contoh: `random-name-123.netlify.app`)
5. **Share link tersebut ke semua anggota tim**

✅ **Keuntungan:**
- Gratis selamanya
- Bisa diakses dari mana saja (internet)
- HTTPS otomatis (aman)
- Tidak perlu install apa-apa

---

### B. GitHub Pages (Gratis & Profesional)
1. Buat akun di [github.com](https://github.com)
2. Klik **New Repository**
3. Nama: `absen-staff`, Public
4. Upload semua file dari folder ini
5. Settings → Pages → Source: main → Save
6. Link: `username.github.io/absen-staff`

✅ **Keuntungan:**
- Gratis
- Custom domain bisa
- Version control
- Profesional

---

## 💻 METODE 2: JARINGAN LOKAL (SATU KANTOR)

### Cara 1: Pakai Python Server

**1. Jalankan Server:**
- Double klik file **`start-server.bat`**
- Server akan jalan di port 8080

**2. Cari IP Address Anda:**
- Tekan `Windows + R`
- Ketik `cmd` → Enter
- Ketik `ipconfig`
- Cari **IPv4 Address** (contoh: `192.168.1.100`)

**3. Share ke Anggota:**
- Kasih tahu IP Address Anda
- Anggota buka browser: `http://192.168.1.100:8080/login.html`

⚠️ **Catatan:**
- Komputer Anda harus tetap nyala
- Harus satu jaringan WiFi/LAN
- Windows Firewall mungkin minta izin (klik Allow)

---

### Cara 2: XAMPP/WAMP (Alternatif)

**1. Install XAMPP:**
- Download: [apachefriends.org](https://www.apachefriends.org)
- Install XAMPP

**2. Copy File:**
- Copy folder **ABSEN BARU** ke `C:\xampp\htdocs\`

**3. Jalankan:**
- Buka XAMPP Control Panel
- Start Apache

**4. Akses:**
- Komputer Anda: `http://localhost/ABSEN BARU/login.html`
- Komputer lain: `http://[IP_ANDA]/ABSEN BARU/login.html`

---

## 📂 METODE 3: COPY FILE LANGSUNG

**Untuk Tiap Komputer:**
1. Copy seluruh folder **ABSEN BARU**
2. Paste ke komputer anggota
3. Buka `login.html` dengan browser

⚠️ **Masalah:**
- Data tidak sinkron antar komputer
- Setiap orang punya database sendiri (localStorage)
- Tidak cocok untuk tim

---

## ✅ REKOMENDASI TERBAIK

### **UNTUK TIM KECIL (< 10 orang):**
👉 **Netlify Drop** - Paling cepat, 5 menit siap

### **UNTUK TIM KANTOR (Satu Gedung):**
👉 **Python Server** - Gunakan `start-server.bat`, share IP

### **UNTUK PRODUKSI (Profesional):**
👉 **GitHub Pages** - Version control, gratis, unlimited traffic

---

## 🔧 TROUBLESHOOTING

### "Tidak bisa akses dari komputer lain"
- Cek Windows Firewall → Allow port 8080
- Pastikan satu jaringan WiFi/LAN
- Gunakan IP Address, bukan "localhost"

### "Data hilang setelah refresh"
- Normal, data tersimpan di localStorage browser
- Jika deploy online, setiap device punya data sendiri
- Untuk data terpusat, perlu backend server (future update)

### "File tidak muncul di Netlify"
- Pastikan upload semua file: .html, .css, .js
- Cek nama file harus persis: `login.html` (huruf kecil)

---

## 📞 BUTUH BANTUAN?

Jika ada masalah saat share aplikasi, hubungi admin IT atau tanyakan ke developer.
