// Admin Authentication System
const AdminAuth = {
    SESSION_KEY: 'admin_session',
    REMEMBER_KEY: 'admin_remember',
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    
    // Hardcoded credentials
    credentials: {
        email: 'ayyushnegi@gmail.com',  // FIX: was 'ayyushnegii.com' (missing @), login was always failing
        passwordHash: null // Will be computed on load
    },

    // Compute SHA-256 hash
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Initialize - compute the hash
    async init() {
        this.credentials.passwordHash = await this.hashPassword('FREEDOM139');
        this.setupInactivityMonitor();
        this.restoreRememberedEmail();
    },

    // Check if user is logged in
    isLoggedIn() {
        const session = sessionStorage.getItem(this.SESSION_KEY);
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            return sessionData && sessionData.authenticated === true;
        } catch (e) {
            return false;
        }
    },

    // Login function
    async login(email, password, remember = false) {
        const passwordHash = await this.hashPassword(password);
        
        // FIX: Compare email case-insensitively (trim whitespace too)
        const emailMatch = email.trim().toLowerCase() === this.credentials.email.toLowerCase();
        
        if (emailMatch && passwordHash === this.credentials.passwordHash) {
            // Set session
            const sessionData = {
                authenticated: true,
                loginTime: Date.now(),
                email: email
            };
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            
            // Remember email if checked
            if (remember) {
                localStorage.setItem(this.REMEMBER_KEY, email);
            } else {
                localStorage.removeItem(this.REMEMBER_KEY);
            }
            
            // Reset inactivity timer
            this.resetInactivityTimer();
            
            return { success: true };
        }
        
        return { success: false, error: 'Invalid email or password' };
    },

    // Logout function
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'admin.html';
    },

    // Setup inactivity monitor
    setupInactivityMonitor() {
        this.resetInactivityTimer();
        
        // Monitor user activity
        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            document.addEventListener(event, () => this.resetInactivityTimer());
        });
    },

    // Reset inactivity timer
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        if (this.isLoggedIn()) {
            this.inactivityTimer = setTimeout(() => {
                this.logout();
            }, this.INACTIVITY_TIMEOUT);
        }
    },

    // Restore remembered email
    restoreRememberedEmail() {
        const rememberedEmail = localStorage.getItem(this.REMEMBER_KEY);
        if (rememberedEmail) {
            const emailInput = document.getElementById('email');
            const rememberCheckbox = document.getElementById('remember');
            if (emailInput) emailInput.value = rememberedEmail;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    },

    // Require authentication (call on dashboard pages)
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'admin.html';
            return false;
        }
        this.resetInactivityTimer();
        return true;
    }
};

// Login form handler
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    const errorEl = document.getElementById('loginError');
    
    // Clear previous errors
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
    
    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.login-btn');
    if (btn) {
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Signing in...';
    }

    // Attempt login
    const result = await AdminAuth.login(email, password, remember);
    
    if (result.success) {
        window.location.href = 'dashboard.html';
    } else {
        showError(result.error);
        shakeForm();
        if (btn) {
            btn.disabled = false;
            btn.querySelector('span').textContent = 'Sign In';
        }
    }
}

function showError(message) {
    const errorEl = document.getElementById('loginError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function shakeForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await AdminAuth.init();
});
