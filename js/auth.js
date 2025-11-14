// js/auth.js
class AuthManager {
  constructor() {
    this.userKey = 'userLoggedIn';
    this.adminKey = 'adminLoggedIn';
    this.init();
  }

  init() {
    if (this.isMainPage()) {
      this.setupUserLogin();
      this.checkURLForAdminAccess();
    }

    if (this.isAdminPage()) {
      this.setupAdminLoginForm();
      this.checkAdminAccess();
    }
  }

  // === পেজ চেক ===
  isMainPage() {
    return location.pathname === '/' || location.pathname.includes('index.html');
  }

  isAdminPage() {
    return location.pathname.includes('admin.html') || location.pathname.includes('dashboard.html');
  }

  // === URL দিয়ে Admin Access ===
  checkURLForAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'admin') {
      window.location.href = 'admin.html';
    }

    if (mode === 'dashboard') {
      if (localStorage.getItem(this.adminKey) === 'true') {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'admin.html';
      }
    }
  }

  // === ইউজার লগইন (index.html) ===
  setupUserLogin() {
    this.updateUserUI();

    const form = document.getElementById('user-login-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleUserLogin(e));
    }

    document.querySelectorAll('.close').forEach(btn => {
      btn.onclick = () => this.closeModal();
    });

    window.onclick = (e) => {
      const modal = document.getElementById('login-modal');
      if (e.target === modal) this.closeModal();
    };
  }

  openModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
    const error = document.getElementById('login-error');
    if (error) error.textContent = '';
  }

  handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('user-email').value.trim();
    const pass = document.getElementById('user-pass').value;

    const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem(this.userKey, 'true');
      this.updateUserUI();
      this.closeModal();
      this.showPrivateProjects();
    } else {
      const error = document.getElementById('login-error');
      if (error) error.textContent = 'ভুল ইমেইল বা পাসওয়ার্ড!';
    }
  }

  logoutUser() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('currentUser');
    this.updateUserUI();
    this.hidePrivateProjects();
  }

  showPrivateProjects() {
    document.querySelectorAll('.project-card.private').forEach(card => {
      card.classList.add('unlocked');
    });
  }

  hidePrivateProjects() {
    document.querySelectorAll('.project-card.private').forEach(card => {
      card.classList.remove('unlocked');
    });
  }

  updateUserUI() {
    const status = document.getElementById('auth-status');
    if (!status) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (localStorage.getItem(this.userKey) === 'true' && currentUser) {
      status.innerHTML = `
        <span style="color:#00d4ff; font-weight:600;">${this.escapeHtml(currentUser.name)}</span>
        <button class="logout-btn" style="margin-left:8px; background:#ff006e; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:12px;">লগআউট</button>
      `;
      status.querySelector('.logout-btn').onclick = () => this.logoutUser();
      this.showPrivateProjects();
    } else {
      status.innerHTML = `<span class="login-btn" style="color:#00d4ff; cursor:pointer; text-decoration:underline; font-weight:500;">লগইন</span>`;
      status.querySelector('.login-btn').onclick = () => this.openModal();
      this.hidePrivateProjects();
    }
  }

  // === অ্যাডমিন লগইন (admin.html) ===
  setupAdminLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
        const admin = users.find(u => u.email === username && u.password === password && u.role === 'admin');

        if (admin) {
          localStorage.setItem(this.adminKey, 'true');
          window.location.href = 'dashboard.html';
        } else {
          const error = document.getElementById('error-message');
          if (error) error.textContent = 'ভুল তথ্য!';
        }
      });
    }
  }

  checkAdminAccess() {
    const isLoggedIn = localStorage.getItem(this.adminKey) === 'true';

    if (!isLoggedIn && location.pathname.includes('dashboard.html')) {
      window.location.href = 'admin.html';
    }

    if (isLoggedIn && location.pathname.includes('admin.html')) {
      window.location.href = 'dashboard.html';
    }
  }

  setupLogout() {
    const btn = document.getElementById('logout-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        localStorage.removeItem(this.adminKey);
        window.location.href = 'admin.html';
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// চালু করা
document.addEventListener('DOMContentLoaded', () => {
  window.auth = new AuthManager();

  if (document.getElementById('logout-btn')) {
    window.auth.setupLogout();
  }
});
