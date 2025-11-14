// js/auth.js - ঠিক করা কোড (URL চেক + লগইন)
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin');

  // URL চেক: ?admin=dashboard দিলে
  if (adminParam === 'dashboard') {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'admin.html';
    }
    return; // রিডাইরেক্ট করে বেরিয়ে যাও
  }

  // ?admin=login দিলে
  if (adminParam === 'login') {
    window.location.href = 'admin.html';
    return;
  }

  // admin.html এ লগইন ফর্ম
  if (location.pathname.includes('admin.html')) {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (username === 'admin@example.com' && password === 'admin123') {
          localStorage.setItem('adminLoggedIn', 'true');
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('error-message').textContent = 'ভুল তথ্য!';
        }
      });
    }
    return;
  }

  // dashboard.html এ লগআউট + চেক
  if (location.pathname.includes('dashboard.html')) {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      window.location.href = 'admin.html';
      return;
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin.html';
      });
    }
    return;
  }

  // index.html এ ইউজার লগইন (পুরনো কোড রাখো)
  const authStatus = document.getElementById('auth-status');
  if (authStatus) {
    // ইউজার লগইন UI + মডাল (তোমার পুরনো কোড এখানে পেস্ট করো)
    // ... (যেমন openModal, handleUserLogin, etc.)
  }
});
