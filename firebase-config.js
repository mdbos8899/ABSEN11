// ========================================
// FIREBASE CONFIGURATION
// ========================================
// Configuration untuk Firebase project: fir-28384

const firebaseConfig = {
    apiKey: "AIzaSyCYTGgxNeR4Ucgj5_nubQZYBIADeM0DjhA",
    authDomain: "fir-28384.firebaseapp.com",
    projectId: "fir-28384",
    storageBucket: "fir-28384.firebasestorage.app",
    messagingSenderId: "675536082033",
    appId: "1:675536082033:web:d19de275f274724c76b7d0",
    measurementId: "G-9WRGTV4TXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Auth
const auth = firebase.auth();

console.log('Firebase initialized successfully');
