// ============================================
// AUTHENTICATION SYSTEM
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initLogin();
    initRegister();
});

// ============================================
// CHECK AUTH
// ============================================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Login/Register pages (no login needed)
    const authPages = ['index.html', 'register.html'];
    
    // Main website pages (require login)
    const protectedPages = ['main-site.html', 'about.html', 'projects.html', 'contact.html'];
    
    // If logged in and on login/register, go to main site
    if (isLoggedIn === 'true' && authPages.includes(currentPage)) {
        window.location.href = 'main-site.html';
    }
    
    // If NOT logged in and trying to access main site, go to login
    if (isLoggedIn !== 'true' && protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
    }
}

// ============================================
// LOGIN
// ============================================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            window.location.href = 'main-site.html';
        } else {
            errorDiv.classList.add('show');
            setTimeout(() => errorDiv.classList.remove('show'), 3000);
        }
    });
}

// ============================================
// REGISTER
// ============================================
function initRegister() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim().toLowerCase();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        const errorDiv = document.getElementById('registerError');
        const successDiv = document.getElementById('registerSuccess');
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Validation
        if (username.length < 3) { showError('Username must be at least 3 characters'); return; }
        if (users.find(u => u.username === username)) { showError('Username already taken'); return; }
        if (users.find(u => u.email === email)) { showError('Email already registered'); return; }
        if (password.length < 4) { showError('Password must be at least 4 characters'); return; }
        if (password !== confirmPassword) { showError('Passwords do not match'); return; }
        if (!agreeTerms) { showError('Please agree to the Terms'); return; }
        
        // Create new user
        users.push({ username, email, password, createdAt: new Date().toISOString() });
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success
        successDiv.classList.add('show');
        
        // Auto login and redirect to MAIN SITE
        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            window.location.href = 'main-site.html';
        }, 1500);
        
        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            setTimeout(() => errorDiv.classList.remove('show'), 3000);
        }
    });
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============================================
// GET CURRENT USER
// ============================================
function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.username === username);
}