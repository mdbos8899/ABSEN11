// ========================================
// FIREBASE CONFIGURATION
// ========================================
// IMPORTANT: Ganti dengan credential Firebase Anda sendiri
// Cara mendapatkan Firebase credentials:
// 1. Buka https://console.firebase.google.com/
// 2. Klik "Add project" atau pilih project yang sudah ada
// 3. Daftar aplikasi web (Web app)
// 4. Copy Firebase configuration dan paste di bawah

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Auth
const auth = firebase.auth();

console.log('Firebase initialized successfully');
