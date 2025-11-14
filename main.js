// js/main.js
class Portfolio {
  constructor() {
    this.projects = this.loadProjects();
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadProjects();
    this.setupContactForm();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    // যদি ইউজার লগইন থাকে
if (window.auth && window.auth.isUserLoggedIn()) {
  window.auth.unlockPrivateProjects();
}
  }
  

  setupNavigation() {
    // Active navigation
    const currentPage = window.location.hash || '#home';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });

    // Update on hash change
    window.addEventListener('hashchange', () => {
      const page = window.location.hash || '#home';
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === page);
      });
    });
  }

  loadProjects() {
    const container = document.getElementById('projects-grid');
    const noProjects = document.getElementById('no-projects');

    if (this.projects.length === 0) {
      noProjects.style.display = 'block';
      return;
    }

    noProjects.style.display = 'none';

    container.innerHTML = this.projects.map(project => `
      <div class="project-card">
        <div class="project-thumb">
          <img src="${project.thumbnail}" alt="${this.escapeHtml(project.title)}" 
               onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />
        </div>
        <div class="project-info">
          <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
          <p class="project-desc">${this.escapeHtml(project.description)}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="project-link" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  loadProjects() {
    const data = localStorage.getItem('portfolioProjects');
    this.projects = data ? JSON.parse(data) : [];
    
    const container = document.getElementById('projects-grid');
    const noProjects = document.getElementById('no-projects');

    if (this.projects.length === 0) {
      noProjects.style.display = 'block';
      container.innerHTML = '';
      return;
    }

    noProjects.style.display = 'none';

    container.innerHTML = this.projects.map(project => `
      <div class="project-card">
        <div class="project-thumb">
          <img src="${project.thumbnail}" alt="${this.escapeHtml(project.title)}" 
               onerror="this.src='https://via.placeholder.com/400x300/0a0a1a/00d4ff?text=No+Image'" />
        </div>
        <div class="project-info">
          <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
          <p class="project-desc">${this.escapeHtml(project.description)}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="project-link" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent! (Demo - no backend)');
        form.reset();
      });
    }
  }




  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
    // ——————————————————————————————————————
  // MOBILE TOUCH GESTURES
  // ——————————————————————————————————————
 /* setupTouchGestures() {
    if (window.innerWidth > 768) return; // Desktop: skip

    const threshold = 80; // px to trigger swipe
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0, touchEndY = 0;
    let startTime = 0;
    let longPressTimer = null;
    let currentProjectIndex = 0;

    const projectsGrid = document.getElementById('projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const sections = ['#home', '#about', '#projects', '#contact'];
    let currentSectionIndex = 0;

    // === 1. Project Card Long Press (Quick Actions) ===
    projectCards.forEach((card, i) => {
      let overlay = null;

      const showQuickActions = () => {
        if (overlay) return;
        const live = card.querySelector('a[title="Live Demo"]')?.href;
        const github = card.querySelector('a[title="GitHub"]')?.href;

        overlay = document.createElement('div');
        overlay.className = 'project-quick-actions';
        overlay.innerHTML = `
          ${live ? `<a href="${live}" target="_blank" class="quick-btn"><i class="fas fa-external-link-alt"></i></a>` : ''}
          ${github ? `<a href="${github}" target="_blank" class="quick-btn"><i class="fab fa-github"></i></a>` : ''}
        `;
        card.style.position = 'relative';
        card.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));
      };

      const hideQuickActions = () => {
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
        overlay = null;
      };

      card.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
          e.preventDefault();
          showQuickActions();
        }, 600);
      }, { passive: true });

      card.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
        setTimeout(hideQuickActions, 100);
      });

      card.addEventListener('touchmove', () => {
        clearTimeout(longPressTimer);
      }, { passive: true });
    });

    // === 2. Global Swipe (Sections & Projects) ===
    document.body.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      startTime = Date.now();
    }, { passive: true });

    document.body.addEventListener('touchend', (e) => {
      if (!touchStartX || !touchStartY) return;

      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const elapsed = Date.now() - startTime;

      // Fast swipe or slow drag
      if (elapsed > 800) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Horizontal swipe → Projects
      if (absX > absY && absX > threshold && projectsGrid && projectCards.length > 1) {
        if (deltaX > 0) {
          // Swipe right → previous
          currentProjectIndex = Math.max(0, currentProjectIndex - 1);
        } else {
          // Swipe left → next
          currentProjectIndex = Math.min(projectCards.length - 1, currentProjectIndex + 1);
        }
        this.swipeToProject(currentProjectIndex, projectCards, projectsGrid);
      }

      // Vertical swipe → Sections
      else if (absY > threshold) {
        if (deltaY > 0) {
          // Swipe down → next section
          currentSectionIndex = Math.min(sections.length - 1, currentSectionIndex + 1);
        } else {
          // Swipe up → previous section
          currentSectionIndex = Math.max(0, currentSectionIndex - 1);
        }
        this.scrollToSection(sections[currentSectionIndex]);
      }
    }, { passive: true });

    // === 3. Double Tap on Hero Globe ===
    let lastTap = 0;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
          document.querySelector('.globe-glow')?.classList.add('double-tap');
          setTimeout(() => {
            document.querySelector('.globe-glow')?.classList.remove('double-tap');
          }, 600);
        }
        lastTap = now;
      }, { passive: false });
    }

    // === 4. Show swipe hint on first visit ===
    const hint = document.createElement('div');
    hint.className = 'section-swipe-hint';
    hint.textContent = '↑↓ Swipe to navigate';
    document.body.appendChild(hint);
    setTimeout(() => hint.classList.add('show'), 1000);
    setTimeout(() => hint.classList.remove('show'), 5000);
  }

  swipeToProject(index, cards, container) {
    cards.forEach((card, i) => {
      card.style.transform = `translateX(${(i - index) * 110}%)`;
      card.style.opacity = i === index ? '1' : '0.3';
    });
  }

  scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Update active nav
      setTimeout(() => {
        window.location.hash = hash;
      }, 300);
    }
  }*/
/*  init() {
  this.setupNavigation();
  this.loadProjects();
  this.setupContactForm();
  this.setupMobileMenu();
  this.setupSmoothScroll();
  this.setupTouchGestures(); // ← ADD THIS
}*/
  

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize portfolio
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});
// ---- MOBILE ANIMATION TRIGGER ----
if (window.innerWidth <= 768) {
  // Force reflow so the CSS animations start after DOM is ready
  requestAnimationFrame(() => {
    document.body.classList.add('mobile-anim-ready');
  });
}