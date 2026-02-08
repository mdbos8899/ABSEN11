// ========================================
// FIREBASE HELPER FUNCTIONS
// ========================================

// Collections
const USERS_COLLECTION = 'users';
const ATTENDANCE_COLLECTION = 'attendance';

// ========================================
// USER MANAGEMENT
// ========================================

// Register new user with Firebase Auth and Firestore
async function registerUserFirebase(nama, inisial, email, password) {
    try {
        // Check if inisial already exists
        const inisialQuery = await db.collection(USERS_COLLECTION)
            .where('inisial', '==', inisial.toUpperCase())
            .get();
        
        if (!inisialQuery.empty) {
            return { success: false, message: 'Inisial sudah digunakan!' };
        }
        
        // Create user with Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save user data to Firestore
        await db.collection(USERS_COLLECTION).doc(user.uid).set({
            nama: nama,
            inisial: inisial.toUpperCase(),
            email: email.toLowerCase(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, message: 'Registrasi berhasil!' };
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: 'Email sudah terdaftar!' };
        }
        return { success: false, message: error.message };
    }
}

// Login user with Firebase Auth
async function loginUserFirebase(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get user data from Firestore
        const userDoc = await db.collection(USERS_COLLECTION).doc(user.uid).get();
        
        if (!userDoc.exists) {
            await auth.signOut();
            return { success: false, message: 'Data user tidak ditemukan!' };
        }
        
        const userData = userDoc.data();
        const session = {
            userId: user.uid,
            email: user.email,
            nama: userData.nama,
            inisial: userData.inisial,
            loginAt: new Date().toISOString()
        };
        
        // Save session to localStorage for quick access
        localStorage.setItem('currentUser', JSON.stringify(session));
        
        return { success: true, message: 'Login berhasil!', user: session };
    } catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: 'Email tidak ditemukan!' };
        } else if (error.code === 'auth/wrong-password') {
            return { success: false, message: 'Password salah!' };
        }
        return { success: false, message: error.message };
    }
}

// Get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout user
async function logoutUserFirebase() {
    try {
        await auth.signOut();
        localStorage.removeItem('currentUser');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: error.message };
    }
}

// ========================================
// ATTENDANCE MANAGEMENT
// ========================================

// Submit attendance (keluar/masuk)
async function submitAttendanceFirebase(data) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: 'User tidak terautentikasi!' };
        }
        
        const attendanceData = {
            userId: user.userId,
            inisial: user.inisial,
            nama: user.nama,
            jamKeluar: data.jamKeluar,
            tanggal: data.tanggal,
            keperluan: data.keperluan,
            jamMasuk: data.jamMasuk || null,
            status: data.status || 'keluar',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection(ATTENDANCE_COLLECTION).add(attendanceData);
        
        return { 
            success: true, 
            message: 'Data berhasil disimpan!',
            id: docRef.id
        };
    } catch (error) {
        console.error('Submit attendance error:', error);
        return { success: false, message: error.message };
    }
}

// Update attendance (saat masuk kembali)
async function updateAttendanceFirebase(attendanceId, jamMasuk) {
    try {
        await db.collection(ATTENDANCE_COLLECTION).doc(attendanceId).update({
            jamMasuk: jamMasuk,
            status: 'masuk',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, message: 'Jam masuk berhasil dicatat!' };
    } catch (error) {
        console.error('Update attendance error:', error);
        return { success: false, message: error.message };
    }
}

// Get all attendance records (real-time)
function getAllAttendanceRealtime(callback) {
    return db.collection(ATTENDANCE_COLLECTION)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            const records = [];
            snapshot.forEach((doc) => {
                records.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(records);
        }, (error) => {
            console.error('Get attendance error:', error);
            callback([]);
        });
}

// Get attendance for specific user
async function getUserAttendance(userId) {
    try {
        const snapshot = await db.collection(ATTENDANCE_COLLECTION)
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const records = [];
        snapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, records: records };
    } catch (error) {
        console.error('Get user attendance error:', error);
        return { success: false, message: error.message };
    }
}

// Get attendance for today
async function getTodayAttendance() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const snapshot = await db.collection(ATTENDANCE_COLLECTION)
            .where('tanggal', '>=', today.toISOString().split('T')[0])
            .orderBy('tanggal', 'desc')
            .orderBy('createdAt', 'desc')
            .get();
        
        const records = [];
        snapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, records: records };
    } catch (error) {
        console.error('Get today attendance error:', error);
        return { success: false, message: error.message };
    }
}

// Check if user currently in "keluar" status
async function checkUserOutStatus(userId) {
    try {
        const snapshot = await db.collection(ATTENDANCE_COLLECTION)
            .where('userId', '==', userId)
            .where('status', '==', 'keluar')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            return { isOut: false, record: null };
        }
        
        const doc = snapshot.docs[0];
        return { 
            isOut: true, 
            record: {
                id: doc.id,
                ...doc.data()
            }
        };
    } catch (error) {
        console.error('Check user status error:', error);
        return { isOut: false, record: null };
    }
}

console.log('Firebase helpers loaded successfully');
