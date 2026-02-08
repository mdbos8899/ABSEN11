# 🔥 PANDUAN SETUP FIREBASE

Aplikasi absensi sekarang menggunakan **Firebase** untuk menyimpan data di cloud, sehingga **semua PC/device bisa melihat data yang sama secara real-time!**

## 📋 Langkah-langkah Setup Firebase

### 1. Buat Project Firebase

1. Buka https://console.firebase.google.com/
2. Klik **"Add project"** atau **"Tambah project"**
3. Beri nama project, contoh: `absensi-staff`
4. Disable Google Analytics (tidak perlu untuk project ini)
5. Klik **"Create project"**

### 2. Daftar Aplikasi Web

1. Di halaman project Firebase, klik icon **Web** (`</>`)
2. Beri nama app, contoh: `Sistem Absensi`
3. **Jangan** centang "Firebase Hosting" (sudah pakai GitHub Pages)
4. Klik **"Register app"**

### 3. Copy Firebase Configuration

Setelah register app, akan muncul kode konfigurasi seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "absensi-staff.firebaseapp.com",
  projectId: "absensi-staff",
  storageBucket: "absensi-staff.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**Copy semua data di atas!**

### 4. Update firebase-config.js

1. Buka file `firebase-config.js`
2. **Ganti** bagian configuration dengan data yang Anda copy tadi:

```javascript
const firebaseConfig = {
    apiKey: "PASTE_API_KEY_ANDA",
    authDomain: "PASTE_AUTH_DOMAIN_ANDA",
    projectId: "PASTE_PROJECT_ID_ANDA",
    storageBucket: "PASTE_STORAGE_BUCKET_ANDA",
    messagingSenderId: "PASTE_MESSAGING_SENDER_ID_ANDA",
    appId: "PASTE_APP_ID_ANDA"
};
```

### 5. Aktifkan Firebase Authentication

1. Di Firebase Console, klik **"Authentication"** di menu kiri
2. Klik **"Get started"**
3. Klik tab **"Sign-in method"**
4. Klik **"Email/Password"**
5. **Enable** toggle pertama (Email/Password)
6. Klik **"Save"**

### 6. Aktifkan Cloud Firestore

1. Di Firebase Console, klik **"Firestore Database"** di menu kiri
2. Klik **"Create database"**
3. Pilih **"Start in production mode"** (kita akan atur rules)
4. Pilih lokasi: **asia-southeast1** (Singapore) atau **asia-southeast2** (Jakarta)
5. Klik **"Enable"**

### 7. Atur Firestore Security Rules

1. Di Firestore Database, klik tab **"Rules"**
2. **Ganti** rules dengan kode ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Klik **"Publish"**

### 8. Push ke GitHub

Setelah setup selesai, push perubahan ke GitHub:

```bash
git add .
git commit -m "Integrate Firebase for real-time sync"
git push
```

### 9. Test Aplikasi

1. Buka aplikasi di GitHub Pages: https://mdbos8899.github.io/ABSEN11/
2. Klik **"Buat Akun Baru"** untuk register
3. Isi data:
   - Nama: Nama Anda
   - Inisial: Inisial Anda (2-5 karakter)
   - Email: email@example.com
   - Password: minimal 6 karakter
4. Setelah berhasil, login dengan akun yang baru dibuat
5. Test input izin keluar dan masuk

## ✅ Keuntungan Firebase

✅ **Data tersinkronisasi** - Semua PC/device melihat data yang sama
✅ **Real-time updates** - Perubahan langsung terlihat tanpa refresh
✅ **Aman** - Data tersimpan di server Google yang secure
✅ **Gratis** - Firebase Spark plan gratis untuk aplikasi kecil
✅ **Backup otomatis** - Data tidak hilang walau PC rusak

## 🔒 Keamanan

- User harus **register dan login** untuk akses aplikasi
- Hanya user yang login bisa lihat dan input data
- Password di-hash otomatis oleh Firebase Auth
- Firestore rules mencegah akses tanpa autentikasi

## ❓ Troubleshooting

### "Firebase is not defined"
- Pastikan koneksi internet stabil
- Firebase SDK di-load dari CDN, perlu internet

### "Permission denied"
- Pastikan Firestore Security Rules sudah di-publish
- Logout dan login kembali

### Data tidak muncul
- Buka Developer Tools (F12) > Console
- Lihat error message
- Pastikan Firebase configuration sudah benar

## 📞 Bantuan

Jika ada error atau butuh bantuan setup Firebase, screenshot:
1. Error di Console (F12)
2. Firestore Rules yang digunakan
3. Firebase console (settingsproject)

---

**Selamat! Aplikasi absensi Anda sekarang menggunakan cloud database! 🎉**
