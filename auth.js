// ========================================
// AUTHENTICATION SYSTEM
// ========================================

// Initialize users database with default users
function initUsersDB() {
    if (!localStorage.getItem('usersDB')) {
        const defaultUsers = [
            {
                id: 1,
                nama: 'Administrator',
                inisial: 'ADM',
                email: 'admin@absensi.com',
                username: 'admin',
                password: 'admin123',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                nama: 'User Demo',
                inisial: 'USR',
                email: 'user@absensi.com',
                username: 'user',
                password: 'user123',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('usersDB', JSON.stringify(defaultUsers));
    }
}

// Get all users
function getAllUsers() {
    return JSON.parse(localStorage.getItem('usersDB') || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
}

// Find user by email
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register new user
function registerUser(nama, inisial, email, password) {
    const users = getAllUsers();
    
    // Check if email already exists
    if (findUserByEmail(email)) {
        return { success: false, message: 'Email sudah terdaftar!' };
    }
    
    // Check if inisial already exists
    if (users.some(user => user.inisial.toUpperCase() === inisial.toUpperCase())) {
        return { success: false, message: 'Inisial sudah digunakan!' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        nama: nama,
        inisial: inisial.toUpperCase(),
        email: email.toLowerCase(),
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Registrasi berhasil!' };
}

// Find user by username or email
function findUser(usernameOrEmail) {
    const users = getAllUsers();
    return users.find(user => 
        user.email.toLowerCase() === usernameOrEmail.toLowerCase() ||
        (user.username && user.username.toLowerCase() === usernameOrEmail.toLowerCase())
    );
}

// Login user
function loginUser(usernameOrEmail, password) {
    const user = findUser(usernameOrEmail);
    
    if (!user) {
        return { success: false, message: 'Username/Email tidak ditemukan!' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'Password salah!' };
    }
    
    // Set current user session
    const session = {
        userId: user.id,
        email: user.email,
        nama: user.nama,
        inisial: user.inisial,
        loginAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(session));
    
    return { success: true, message: 'Login berhasil!', user: session };
}

// Get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initUsersDB();
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const linkRegister = document.getElementById('linkRegister');
    const closeRegister = document.getElementById('closeRegister');
    const registerModal = document.getElementById('registerModal');
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form submit
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Show register modal
    if (linkRegister) {
        linkRegister.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.classList.remove('hidden');
        });
    }
    
    // Close register modal
    if (closeRegister) {
        closeRegister.addEventListener('click', function() {
            registerModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            registerModal.classList.add('hidden');
        }
    });
});

// ========================================
// EVENT HANDLERS
// ========================================

function handleLogin(e) {
    e.preventDefault();
    
    const usernameOrEmail = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (!usernameOrEmail || !password) {
        if (errorMessage) {
            errorMessage.textContent = 'Mohon isi semua field!';
            errorMessage.style.display = 'block';
        } else {
            alert('Mohon isi semua field!');
        }
        return;
    }
    
    const result = loginUser(usernameOrEmail, password);
    
    if (result.success) {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        if (errorMessage) {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
        } else {
            alert(result.message);
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const nama = document.getElementById('regNama').value.trim();
    const inisial = document.getElementById('regInisial').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    
    if (!nama || !inisial || !email || !password) {
        alert('Mohon isi semua field!');
        return;
    }
    
    if (inisial.length < 2 || inisial.length > 5) {
        alert('Inisial harus 2-5 karakter!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password minimal 6 karakter!');
        return;
    }
    
    const result = registerUser(nama, inisial, email, password);
    
    if (result.success) {
        alert(result.message + '\\nSilakan login dengan akun Anda.');
        document.getElementById('registerModal').classList.add('hidden');
        document.getElementById('registerForm').reset();
        
        // Auto-fill login form
        document.getElementById('email').value = email;
        document.getElementById('password').focus();
    } else {
        alert(result.message);
    }
}

// ========================================
// CONSOLE INFO
// ========================================

console.log('%c🔐 Authentication System', 'color: #2a5298; font-size: 20px; font-weight: bold;');
console.log('Login page loaded successfully');
