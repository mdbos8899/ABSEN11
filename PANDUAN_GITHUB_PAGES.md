# 📘 PANDUAN LENGKAP UPLOAD KE GITHUB PAGES

## 🎯 LANGKAH 1: BUAT AKUN GITHUB

1. **Buka Browser** → Ketik: [https://github.com](https://github.com)

2. **Klik "Sign Up"** (tombol hijau di pojok kanan atas)

3. **Isi Form Pendaftaran:**
   - **Email:** Masukkan email Anda (contoh: nama@gmail.com)
   - Klik **Continue**
   - **Password:** Buat password (minimal 8 karakter)
   - Klik **Continue**
   - **Username:** Pilih username unik (contoh: staffabsen2026)
   - Klik **Continue**
   
4. **Verifikasi:**
   - Jawab pertanyaan verifikasi (puzzle)
   - Klik **Create Account**
   
5. **Cek Email:**
   - Buka email Anda
   - Cari email dari GitHub
   - Klik link verifikasi

✅ **SELESAI! Akun GitHub sudah jadi**

---

## 🎯 LANGKAH 2: BUAT REPOSITORY BARU

1. **Login ke GitHub** → [https://github.com](https://github.com)

2. **Klik Tombol Hijau "New"** (atau klik ikon + di pojok kanan atas → New repository)

3. **Isi Form Repository:**
   ```
   Repository name: absen-staff
   Description: Sistem Izin Absen Staff
   
   ☑️ Public (HARUS PUBLIC untuk GitHub Pages gratis)
   ☑️ Add a README file (CENTANG INI)
   ```

4. **Klik "Create Repository"** (tombol hijau di bawah)

✅ **Repository sudah dibuat!**

---

## 🎯 LANGKAH 3: UPLOAD FILE

### **CARA A: Upload via Web (Paling Mudah)**

1. **Di halaman repository Anda**, klik **"Add file"** → **"Upload files"**

2. **Drag & Drop atau Pilih File:**
   - Buka folder `ABSEN BARU` di komputer Anda
   - Select semua file berikut:
     ```
     ✅ login.html
     ✅ dashboard.html
     ✅ style.css
     ✅ auth.js
     ✅ dashboard.js
     ```
   - **Drag file-file tersebut ke browser** (ke kotak "Drag files here")
   
   ATAU
   
   - Klik **"choose your files"**
   - Pilih semua 5 file di atas
   - Klik **Open**

3. **Commit Changes:**
   - Di bawah, ada box "Commit changes"
   - Tulis pesan: `Upload aplikasi absen staff`
   - Klik tombol hijau **"Commit changes"**

4. **Tunggu Upload Selesai** (biasanya 10-30 detik)

✅ **File sudah terupload!**

---

### **CARA B: Upload via GitHub Desktop (Alternatif)**

Jika Cara A tidak bisa, download GitHub Desktop:

1. Download: [desktop.github.com](https://desktop.github.com)
2. Install dan login
3. Clone repository
4. Copy paste semua file ke folder repository di komputer
5. Commit & Push

---

## 🎯 LANGKAH 4: AKTIFKAN GITHUB PAGES

1. **Di repository Anda**, klik tab **"Settings"** (⚙️ di menu atas)

2. **Scroll ke bawah**, cari menu **"Pages"** di sidebar kiri
   - Atau langsung buka: `https://github.com/USERNAME/absen-staff/settings/pages`

3. **Konfigurasi Pages:**
   
   **Branch:**
   - Klik dropdown yang awalnya "None"
   - Pilih **"main"** (atau "master")
   - Folder: biarkan **"/ (root)"**
   - Klik **"Save"**

4. **Tunggu Deploy (1-2 menit)**
   - Halaman akan refresh otomatis
   - Akan muncul kotak biru/hijau dengan pesan:
     ```
     Your site is live at https://username.github.io/absen-staff/
     ```

✅ **GitHub Pages sudah aktif!**

---

## 🎯 LANGKAH 5: AKSES APLIKASI

**Link Aplikasi Anda:**
```
https://[USERNAME].github.io/absen-staff/login.html
```

**Contoh:**
- Jika username Anda: `staffabsen2026`
- Maka link: `https://staffabsen2026.github.io/absen-staff/login.html`

### **📝 PENTING: Harus Tambah `/login.html`**

Karena halaman utama kita adalah `login.html`, maka harus tambahkan di akhir URL.

---

## 🎯 LANGKAH 6: SHARE KE TIM

1. **Copy Link Lengkap:**
   ```
   https://[USERNAME].github.io/absen-staff/login.html
   ```

2. **Share via:**
   - 📧 Email
   - 💬 WhatsApp
   - 📱 Telegram
   - Atau cara lainnya

3. **Instruksi untuk Anggota:**
   ```
   Halo Tim!
   
   Silakan akses aplikasi absen di link berikut:
   https://[USERNAME].github.io/absen-staff/login.html
   
   - Jika belum punya akun, klik "Buat Akun Baru"
   - Setelah register, login dengan email & password
   
   Terima kasih!
   ```

---

## 🔄 CARA UPDATE FILE (Jika Ada Perubahan)

Jika nanti Anda ingin update aplikasi:

1. **Buka repository** di GitHub
2. **Klik nama file** yang mau diubah (contoh: `style.css`)
3. **Klik ikon pensil** (Edit this file)
4. **Edit kode**
5. **Scroll ke bawah** → Klik **"Commit changes"**
6. **Tunggu 1-2 menit** → Perubahan langsung live

---

## ⚠️ TROUBLESHOOTING

### **❌ "404 - Page Not Found"**

**Penyebab:**
- GitHub Pages belum aktif sepenuhnya (tunggu 5 menit)
- URL salah (pastikan ada `/login.html` di akhir)

**Solusi:**
1. Tunggu 5-10 menit setelah aktifkan Pages
2. Cek URL: `https://username.github.io/repo-name/login.html`
3. Refresh halaman (Ctrl + F5)

---

### **❌ "Repository not found"**

**Penyebab:**
- Repository masih Private

**Solusi:**
1. Settings → Scroll ke bawah
2. Cari **"Danger Zone"**
3. **"Change visibility"** → **"Make public"**

---

### **❌ "CSS tidak load / tampilan berantakan"**

**Penyebab:**
- File path salah
- File belum terupload

**Solusi:**
1. Pastikan semua 5 file sudah ada di repository
2. Cek nama file sama persis: `style.css` (huruf kecil semua)
3. Refresh dengan Ctrl + Shift + R (hard refresh)

---

### **❌ "Data hilang setelah logout"**

**Penyebab:**
- Data tersimpan di localStorage browser
- Ini normal untuk aplikasi frontend-only

**Catatan:**
- Setiap device/browser punya data sendiri
- Data tidak tersinkronisasi antar device
- Untuk data terpusat, perlu backend server

---

## 📊 KELEBIHAN & KEKURANGAN

### ✅ **KELEBIHAN:**
- ✅ Gratis selamanya
- ✅ Tidak perlu server
- ✅ HTTPS otomatis (aman)
- ✅ Unlimited bandwidth
- ✅ Bisa diakses dari mana saja (internet)
- ✅ Update mudah (edit langsung di GitHub)

### ⚠️ **KEKURANGAN:**
- ⚠️ Data tidak terpusat (setiap user punya data sendiri)
- ⚠️ Tidak cocok untuk data sensitif/besar
- ⚠️ Perlu internet untuk akses

---

## 🎓 VIDEO TUTORIAL (Jika Masih Bingung)

Cari di YouTube:
- "Cara upload website ke GitHub Pages"
- "GitHub Pages tutorial bahasa Indonesia"
- "Deploy HTML to GitHub Pages"

---

## 📞 BUTUH BANTUAN?

Jika masih ada yang bingung:

1. **Cek tab "Issues"** di repository
2. **Baca dokumentasi GitHub:** [docs.github.com/pages](https://docs.github.com/pages)
3. **Tanya di forum GitHub Community**

---

## ✨ TIPS PRO

### **1. Custom Domain (Opsional)**

Jika punya domain sendiri (contoh: `absen.company.com`):
- Settings → Pages → Custom domain
- Masukkan domain Anda
- Update DNS record di provider domain

### **2. Rename Repository**

Jika mau ganti nama repository:
- Settings → Repository name → Rename
- Link akan berubah otomatis

### **3. Analytics**

Mau tau berapa visitor:
- Gunakan Google Analytics
- Atau GitHub Insights (tab Insights di repository)

---

## 🎉 SELAMAT!

Aplikasi Absen Staff Anda sekarang sudah online dan bisa diakses semua orang!

**Link Anda:**
```
https://[USERNAME].github.io/absen-staff/login.html
```

Share link ini ke seluruh tim dan mulai gunakan aplikasi! 🚀
