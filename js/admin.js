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

// User Manager Class
class UserManager {
  constructor() {
    this.users = this.loadUsers();
    this.modal = document.getElementById('project-modal');
    this.form = document.getElementById('project-form');
    this.container = document.getElementById('users-container');
    this.noMsg = document.getElementById('no-users-msg');
    this.init();
  }

  init() {
    this.renderUsers();
    this.bindEvents();
  }

  bindEvents() {
    const addBtn = document.getElementById('add-user-btn');
    if (addBtn) addBtn.addEventListener('click', () => this.openModal());
  }

  loadUsers() {
    const data = localStorage.getItem('portfolioUsers');
    if (!data) {
      return [
        {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
    }
    return JSON.parse(data);
  }

  saveUsers() {
    localStorage.setItem('portfolioUsers', JSON.stringify(this.users));
  }

  renderUsers() {
    if (!this.container || !this.noMsg) return;

    if (this.users.length === 0) {
      this.container.innerHTML = '';
      this.noMsg.style.display = 'block';
      return;
    }

    this.noMsg.style.display = 'none';

    this.container.innerHTML = this.users.map((user, index) => `
      <div class="user-card">
        <div class="user-info">
          <h4>${this.escapeHtml(user.name)}</h4>
          <p>${this.escapeHtml(user.email)}</p>
          <span class="role-badge">${user.role.toUpperCase()}</span>
        </div>
        <div class="user-actions">
          <button class="action-btn edit-btn" data-index="${index}" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-index="${index}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('#users-container .edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('button').dataset.index);
        this.editUser(index);
      });
    });

    document.querySelectorAll('#users-container .delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('button').dataset.index);
        this.deleteUser(index);
      });
    });
  }

  openModal(user = null) {
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = user ? 'Edit User' : 'Add New User';

    this.form.innerHTML = `
      <input type="hidden" id="user-id" value="${user ? user.id : ''}" />
      <div class="form-group">
        <label>Name *</label>
        <input type="text" id="user-name" value="${user ? this.escapeHtml(user.name) : ''}" required />
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="user-email" value="${user ? this.escapeHtml(user.email) : ''}" required />
      </div>
      <div class="form-group">
        <label>Password ${user ? '(Leave blank to keep)' : '*'} </label>
        <input type="password" id="user-password" ${!user ? 'required' : ''} />
      </div>
      <div class="form-group">
        <label>Role</label>
        <select id="user-role">
          <option value="user" ${user && user.role === 'user' ? 'selected' : ''}>User</option>
          <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn-primary">Save User</button>
        <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
      </div>
    `;

    this.modal.style.display = 'block';

    this.form.onsubmit = (e) => this.handleSubmit(e, user);
    document.getElementById('cancel-btn').onclick = () => this.closeModal();
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  handleSubmit(e, existingUser = null) {
    e.preventDefault();

    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;

    const emailExists = this.users.some(u => u.email === email && u.id !== id);
    if (emailExists) {
      alert('This email is already registered!');
      return;
    }

    const user = {
      id: id || Date.now().toString(),
      name,
      email,
      password: password || existingUser.password,
      role,
      createdAt: existingUser ? existingUser.createdAt : new Date().toISOString()
    };

    if (id) {
      const index = this.users.findIndex(u => u.id === id);
      if (index !== -1) this.users[index] = user;
    } else {
      this.users.push(user);
    }

    this.saveUsers();
    this.renderUsers();
    this.closeModal();
  }

  editUser(index) {
    this.openModal(this.users[index]);
  }

  deleteUser(index) {
    if (this.users[index].role === 'admin' && this.users.filter(u => u.role === 'admin').length === 1) {
      alert('Cannot delete the last admin!');
      return;
    }
    if (confirm('Delete this user?')) {
      this.users.splice(index, 1);
      this.saveUsers();
      this.renderUsers();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ProjectManager();

  if (document.getElementById('users-container')) {
    new UserManager();
  }
});