// ========================================
// AUTHENTICATION SYSTEM WITH FIREBASE
// ========================================

// Note: Firebase functions are now in firebase.js
// This file handles UI interactions and calls Firebase functions

// Get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout user
async function logoutUser() {
    const result = await logoutUserFirebase();
    if (!result.success) {
        console.error('Logout failed:', result.message);
    }
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded');
    console.log('Firebase ready:', typeof firebase !== 'undefined');
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const linkRegister = document.getElementById('linkRegister');
    const closeRegister = document.getElementById('closeRegister');
    const registerModal = document.getElementById('registerModal');
    
    console.log('Login form found:', loginForm);
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener attached');
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

async function handleLogin(e) {
    e.preventDefault();
    console.log('handleLogin called');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    if (!email || !password) {
        if (errorMessage) {
            errorMessage.textContent = 'Mohon isi semua field!';
            errorMessage.style.display = 'block';
        } else {
            alert('Mohon isi semua field!');
        }
        return;
    }
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Loading...</span>';
    
    try {
        const result = await loginUserFirebase(email, password);
        console.log('Login result:', result);
        
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
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Masuk</span><svg class="button-icon" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
    } catch (error) {
        console.error('Login error:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
            errorMessage.style.display = 'block';
        } else {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = '<span>Masuk</span><svg class="button-icon" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const nama = document.getElementById('regNama').value.trim();
    const inisial = document.getElementById('regInisial').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
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
    
    // Disable button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Loading...</span>';
    
    try {
        const result = await registerUserFirebase(nama, inisial, email, password);
        
        if (result.success) {
            alert(result.message + '\nSilakan login dengan akun Anda.');
            document.getElementById('registerModal').classList.add('hidden');
            document.getElementById('registerForm').reset();
            
            // Auto-fill login form
            document.getElementById('email').value = email;
            document.getElementById('password').focus();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = '<span>Daftar Sekarang</span><svg class="button-icon" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
}

// ========================================
// CONSOLE INFO
// ========================================

console.log('%c🔐 Authentication System', 'color: #2a5298; font-size: 20px; font-weight: bold;');
console.log('Login page loaded successfully');
