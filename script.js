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