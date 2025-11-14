// js/admin.js
class ProjectManager {
  constructor() {
    this.projects = this.loadProjects();
    this.modal = document.getElementById('project-modal');
    this.form = document.getElementById('project-form');
    this.container = document.getElementById('projects-container');
    this.noMsg = document.getElementById('no-projects-msg');
    this.init();
  }

  init() {
    this.renderProjects();
    this.bindEvents();
  }

  bindEvents() {
    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) addBtn.addEventListener('click', () => this.openModal());

    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    window.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  loadProjects() {
    const data = localStorage.getItem('portfolioProjects');
    return data ? JSON.parse(data) : [];
  }

  saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(this.projects));
  }

  renderProjects() {
    if (!this.container || !this.noMsg) return;

    if (this.projects.length === 0) {
      this.container.innerHTML = '';
      this.noMsg.style.display = 'block';
      return;
    }

    this.noMsg.style.display = 'none';

    this.container.innerHTML = this.projects.map((project, index) => `
      <div class="project-card ${project.private ? 'private' : ''}">
        <div class="project-thumb">
          <img src="${project.thumbnail}" 
               alt="${this.escapeHtml(project.title)}" 
               onerror="this.src='https://via.placeholder.com/300x150/16213e/00d4ff?text=No+Image'" />
          ${project.private ? '<div class="private-badge">Private</div>' : ''}
        </div>
        <div class="project-info">
          <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
          <p class="project-desc">${this.escapeHtml(project.description)}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
          <div class="project-actions">
            <button class="action-btn edit-btn" data-index="${index}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-index="${index}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('button').dataset.index);
        this.editProject(index);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('button').dataset.index);
        this.deleteProject(index);
      });
    });
  }

  openModal(project = null) {
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = project ? 'Edit Project' : 'Add New Project';

    this.form.reset();

    if (project) {
      document.getElementById('project-id').value = project.id;
      document.getElementById('project-title').value = project.title;
      document.getElementById('project-desc').value = project.description;
      document.getElementById('project-thumb').value = project.thumbnail;
      document.getElementById('project-live').value = project.liveLink || '';
      document.getElementById('project-github').value = project.githubLink || '';
      document.getElementById('project-tags').value = project.tags.join(', ');
      const privateChk = document.getElementById('project-private');
      if (privateChk) privateChk.checked = project.private || false;
    } else {
      document.getElementById('project-id').value = '';
      const privateChk = document.getElementById('project-private');
      if (privateChk) privateChk.checked = false;
    }

    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('project-id').value;
    const privateChk = document.getElementById('project-private');

    const project = {
      id: id || Date.now().toString(),
      title: document.getElementById('project-title').value.trim(),
      description: document.getElementById('project-desc').value.trim(),
      thumbnail: document.getElementById('project-thumb').value.trim(),
      liveLink: document.getElementById('project-live').value.trim(),
      githubLink: document.getElementById('project-github').value.trim(),
      tags: document.getElementById('project-tags').value.split(',').map(t => t.trim()).filter(t => t),
      private: privateChk ? privateChk.checked : false
    };

    if (id) {
      const index = this.projects.findIndex(p => p.id === id);
      if (index !== -1) this.projects[index] = project;
    } else {
      this.projects.push(project);
    }

    this.saveProjects();
    this.renderProjects();
    this.closeModal();
  }

  editProject(index) {
    this.openModal(this.projects[index]);
  }

  deleteProject(index) {
    if (confirm('এই প্রজেক্টটি মুছে ফেলবেন?')) {
      this.projects.splice(index, 1);
      this.saveProjects();
      this.renderProjects();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize only on dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('projects-container')) {
    new ProjectManager();
  }
});
