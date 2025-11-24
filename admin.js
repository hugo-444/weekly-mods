/**
 * Arabic Foundations — Admin Panel
 * Agent 7: Admin-Panel-Architect
 * 
 * Handles:
 * - Role-based access control (admin-only)
 * - Dashboard analytics
 * - User management
 * - Subscription tracking
 * - Course & module management
 * - Settings configuration
 */

const AdminPanel = (() => {
  'use strict';

  // ========== RBAC & AUTH HELPERS ==========
  
  /**
   * Check if user is logged in
   */
  function isLoggedIn() {
    try {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).loggedIn === true : false;
    } catch {
      return false;
    }
  }

  /**
   * Get current user role
   */
  function getRole() {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) return 'guest';
      const parsed = JSON.parse(auth);
      return parsed.role || 'guest';
    } catch {
      return 'guest';
    }
  }

  /**
   * Check if user is admin
   */
  function isAdmin() {
    return getRole() === 'admin';
  }

  /**
   * Redirect if unauthorized
   */
  function redirectIfUnauthorized() {
    if (!isLoggedIn() || !isAdmin()) {
      window.location.href = 'auth.html?redirect=admin';
      return false;
    }
    return true;
  }

  /**
   * Logout handler
   */
  function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'auth.html';
  }

  // ========== MOCK DATA MODELS ==========

  /**
   * Mock data structure (simulates backend)
   * 
   * DATA STORAGE LOCATION:
   * - Currently stored in browser localStorage under key 'admin_mock_data'
   * - Falls back to hardcoded default data if localStorage is empty
   * - In production, this would be replaced with API calls to backend
   * - To view/edit: Open browser DevTools > Application > Local Storage > admin_mock_data
   */
  
  /**
   * Load mock data from localStorage or use defaults
   */
  function loadMockData() {
    try {
      const stored = localStorage.getItem('admin_mock_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load mock data from localStorage:', e);
    }
    
    // Return default data
    return {
    users: [
      { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'premium', subscription_status: 'active', created_at: '2024-01-15' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'pro', subscription_status: 'active', created_at: '2024-02-20' },
      { id: 3, name: 'Mohammed Ali', email: 'mohammed@example.com', role: 'user', subscription_status: null, created_at: '2024-03-10' },
      { id: 4, name: 'Fatima Al-Rashid', email: 'fatima@example.com', role: 'premium', subscription_status: 'active', created_at: '2024-01-05' },
      { id: 5, name: 'John Smith', email: 'john@example.com', role: 'user', subscription_status: null, created_at: '2024-04-01' },
      { id: 6, name: 'Layla Ahmed', email: 'layla@example.com', role: 'pro', subscription_status: 'active', created_at: '2024-02-14' },
      { id: 7, name: 'Omar Khaled', email: 'omar@example.com', role: 'premium', subscription_status: 'canceled', created_at: '2024-03-22' },
      { id: 8, name: 'Aisha Malik', email: 'aisha@example.com', role: 'user', subscription_status: null, created_at: '2024-04-05' }
    ],
    subscriptions: [
      { id: 1, user_id: 1, user_name: 'Ahmed Hassan', plan: 'premium', status: 'active', started: '2024-01-15', next_billing: '2024-05-15', amount: 29 },
      { id: 2, user_id: 2, user_name: 'Sarah Johnson', plan: 'pro', status: 'active', started: '2024-02-20', next_billing: '2024-05-20', amount: 49 },
      { id: 3, user_id: 4, user_name: 'Fatima Al-Rashid', plan: 'premium', status: 'active', started: '2024-01-05', next_billing: '2024-05-05', amount: 29 },
      { id: 4, user_id: 6, user_name: 'Layla Ahmed', plan: 'pro', status: 'active', started: '2024-02-14', next_billing: '2024-05-14', amount: 49 },
      { id: 5, user_id: 7, user_name: 'Omar Khaled', plan: 'premium', status: 'canceled', started: '2024-03-22', next_billing: null, amount: 29 }
    ],
    courses: [
      { id: 1, title: 'Arabic Foundations I', modules: 15, status: 'active', created_at: '2024-01-01' },
      { id: 2, title: 'Arabic Foundations II', modules: 0, status: 'draft', created_at: '2024-03-15' }
    ],
    modules: [
      { id: 1, title: 'Week 1 — Alphabet & Script Foundations', course_id: 1, course_title: 'Arabic Foundations I', week: 1, status: 'active' },
      { id: 2, title: 'Week 2 — Vowels & Pronouns', course_id: 1, course_title: 'Arabic Foundations I', week: 2, status: 'active' },
      { id: 3, title: 'Week 3 — Introductions', course_id: 1, course_title: 'Arabic Foundations I', week: 3, status: 'active' },
      { id: 4, title: 'Week 4 — Present Tense', course_id: 1, course_title: 'Arabic Foundations I', week: 4, status: 'active' },
      { id: 5, title: 'Week 5 — Reading Basics', course_id: 1, course_title: 'Arabic Foundations I', week: 5, status: 'active' },
      { id: 6, title: 'Week 6 — Listening Skills', course_id: 1, course_title: 'Arabic Foundations I', week: 6, status: 'active' },
      { id: 7, title: 'Week 7 — Midterm Review', course_id: 1, course_title: 'Arabic Foundations I', week: 7, status: 'active' },
      { id: 8, title: 'Week 8 — Past Tense', course_id: 1, course_title: 'Arabic Foundations I', week: 8, status: 'active' },
      { id: 9, title: 'Week 9 — Travel Arabic', course_id: 1, course_title: 'Arabic Foundations I', week: 9, status: 'active' },
      { id: 10, title: 'Week 10 — Descriptions', course_id: 1, course_title: 'Arabic Foundations I', week: 10, status: 'active' },
      { id: 11, title: 'Week 11 — Future Tense', course_id: 1, course_title: 'Arabic Foundations I', week: 11, status: 'active' },
      { id: 12, title: 'Week 12 — Opinions', course_id: 1, course_title: 'Arabic Foundations I', week: 12, status: 'active' },
      { id: 13, title: 'Week 13 — Media Arabic', course_id: 1, course_title: 'Arabic Foundations I', week: 13, status: 'active' },
      { id: 14, title: 'Week 14 — Review', course_id: 1, course_title: 'Arabic Foundations I', week: 14, status: 'active' },
      { id: 15, title: 'Week 15 — Final Exam', course_id: 1, course_title: 'Arabic Foundations I', week: 15, status: 'active' }
    ],
    recentActivity: [
      { user: 'Ahmed Hassan', action: 'Completed Week 5', time: '2 hours ago', status: 'success' },
      { user: 'Sarah Johnson', action: 'Upgraded to Pro', time: '5 hours ago', status: 'success' },
      { user: 'Mohammed Ali', action: 'Started Week 3', time: '1 day ago', status: 'info' },
      { user: 'Fatima Al-Rashid', action: 'Downloaded PDF', time: '2 days ago', status: 'success' },
      { user: 'Layla Ahmed', action: 'Completed Week 10', time: '3 days ago', status: 'success' }
    ]
    };
  }

  /**
   * Save mock data to localStorage
   */
  function saveMockData(data) {
    try {
      localStorage.setItem('admin_mock_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save mock data to localStorage:', e);
    }
  }

  // Initialize mock data (load from storage or use defaults)
  let mockData = loadMockData();
  
  // Save defaults to localStorage on first load
  if (!localStorage.getItem('admin_mock_data')) {
    saveMockData(mockData);
  }

  // ========== STATE MANAGEMENT ==========

  const state = {
    currentPage: 'dashboard',
    currentUser: null,
    pagination: {
      users: { page: 1, perPage: 10, total: 0 },
      subscriptions: { page: 1, perPage: 10, total: 0 }
    },
    filters: {
      subscriptionStatus: 'all',
      courseFilter: 'all'
    },
    search: {
      users: ''
    }
  };

  // ========== DOM ELEMENTS ==========

  const elements = {
    sidebar: null,
    main: null,
    navLinks: [],
    pages: [],
    userDisplay: null,
    logoutBtn: null,
    modal: null
  };

  // ========== INITIALIZATION ==========

  function init() {
    // Check admin access first
    if (!redirectIfUnauthorized()) {
      return;
    }

    // Cache elements
    cacheElements();

    // Load current user info
    loadCurrentUser();

    // Bind event listeners
    bindEvents();

    // Load initial page
    showPage('dashboard');

    // Load dashboard data
    loadDashboardData();
  }

  function cacheElements() {
    elements.sidebar = document.querySelector('[data-admin-sidebar]');
    elements.main = document.querySelector('[data-admin-main]');
    elements.navLinks = Array.from(document.querySelectorAll('[data-admin-page]'));
    elements.pages = Array.from(document.querySelectorAll('[data-admin-page-content]'));
    elements.userDisplay = document.querySelector('[data-admin-user-display]');
    elements.logoutBtn = document.querySelector('[data-admin-logout]');
    elements.modal = document.querySelector('[data-admin-modal]');
  }

  function loadCurrentUser() {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      state.currentUser = {
        name: auth.name || 'Admin User',
        email: auth.email || 'admin@arabic.one',
        role: auth.role || 'admin'
      };
      if (elements.userDisplay) {
        elements.userDisplay.textContent = `${state.currentUser.name} (${state.currentUser.role})`;
      }
    } catch (e) {
      console.error('Failed to load user:', e);
    }
  }

  function bindEvents() {
    // Navigation links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.adminPage;
        if (page) {
          showPage(page);
        }
      });
    });

    // Logout button
    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener('click', logout);
    }

    // Modal close handlers
    const modalClose = document.querySelector('[data-modal-close]');
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (elements.modal) {
      elements.modal.addEventListener('click', (e) => {
        // Close if clicking the overlay itself (not the modal content)
        if (e.target === elements.modal) {
          closeModal();
        }
      });
      
      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal && !elements.modal.hidden) {
          closeModal();
        }
      });
    }
    
    // Ensure modal is hidden on init
    if (elements.modal) {
      elements.modal.hidden = true;
    }

    // Search inputs
    const searchInputs = document.querySelectorAll('[data-search]');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const type = e.target.dataset.search;
        state.search[type] = e.target.value;
        if (type === 'users') {
          renderUsersTable();
        }
      });
    });

    // Filter selects
    const filterSelects = document.querySelectorAll('[data-filter]');
    filterSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const type = e.target.dataset.filter;
        state.filters[type] = e.target.value;
        if (type === 'subscriptionStatus') {
          renderSubscriptionsTable();
        } else if (type === 'courseFilter') {
          renderModulesTable();
        }
      });
    });

    // Action buttons
    document.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (!action) return;

      const actionType = action.dataset.action;
      handleAction(actionType, action);
    });

    // Refresh buttons
    document.addEventListener('click', (e) => {
      const refresh = e.target.closest('[data-refresh]');
      if (!refresh) return;

      const type = refresh.dataset.refresh;
      if (type === 'roleChart') {
        // Future: refresh chart
      } else if (type === 'activity') {
        loadDashboardData();
      }
    });

    // Pagination
    document.addEventListener('click', (e) => {
      const pagBtn = e.target.closest('[data-page]');
      if (!pagBtn) return;

      const pagination = pagBtn.closest('[data-pagination]');
      if (!pagination) return;

      const type = pagination.dataset.pagination;
      const direction = pagBtn.dataset.page;
      
      if (direction === 'prev' && state.pagination[type].page > 1) {
        state.pagination[type].page--;
        if (type === 'users') renderUsersTable();
      } else if (direction === 'next') {
        state.pagination[type].page++;
        if (type === 'users') renderUsersTable();
      }
    });
  }

  // ========== PAGE NAVIGATION ==========

  function showPage(pageName) {
    state.currentPage = pageName;

    // Update nav links
    elements.navLinks.forEach(link => {
      link.classList.toggle('is-active', link.dataset.adminPage === pageName);
    });

    // Show/hide pages
    elements.pages.forEach(page => {
      page.classList.toggle('is-active', page.dataset.adminPageContent === pageName);
    });

    // Load page-specific data
    switch (pageName) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'users':
        renderUsersTable();
        break;
      case 'subscriptions':
        renderSubscriptionsTable();
        break;
      case 'courses':
        renderCoursesTable();
        break;
      case 'modules':
        renderModulesTable();
        break;
      case 'settings':
        loadSettings();
        break;
    }
  }

  // ========== DASHBOARD ==========

  function loadDashboardData() {
    const stats = calculateStats();
    updateStatCards(stats);
    renderRecentActivity();
  }

  function calculateStats() {
    const users = mockData.users;
    const subscriptions = mockData.subscriptions;
    const courses = mockData.courses;
    const modules = mockData.modules;

    return {
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.role === 'premium').length,
      proUsers: users.filter(u => u.role === 'pro').length,
      activeCourses: courses.filter(c => c.status === 'active').length,
      totalModules: modules.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length
    };
  }

  function updateStatCards(stats) {
    Object.keys(stats).forEach(key => {
      const element = document.querySelector(`[data-stat="${key}"]`);
      if (element) {
        element.textContent = stats[key];
      }
    });
  }

  function renderRecentActivity() {
    const tbody = document.querySelector('[data-table="recentActivity"]');
    if (!tbody) return;

    if (mockData.recentActivity.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="admin-table-empty">No recent activity</td></tr>';
      return;
    }

    tbody.innerHTML = mockData.recentActivity.map(activity => `
      <tr>
        <td>${activity.user}</td>
        <td>${activity.action}</td>
        <td>${activity.time}</td>
        <td><span class="admin-badge admin-badge--${activity.status}">${activity.status}</span></td>
      </tr>
    `).join('');
  }

  // ========== USERS TABLE ==========

  function renderUsersTable() {
    const tbody = document.querySelector('[data-table="users"]');
    if (!tbody) return;

    let users = [...mockData.users];

    // Apply search filter
    if (state.search.users) {
      const query = state.search.users.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    }

    // Pagination
    const pag = state.pagination.users;
    pag.total = Math.ceil(users.length / pag.perPage);
    const start = (pag.page - 1) * pag.perPage;
    const end = start + pag.perPage;
    const pageUsers = users.slice(start, end);

    // Update pagination UI
    const pagination = document.querySelector('[data-pagination="users"]');
    if (pagination) {
      const prevBtn = pagination.querySelector('[data-page="prev"]');
      const nextBtn = pagination.querySelector('[data-page="next"]');
      const info = pagination.querySelector('[data-page-info]');
      
      if (prevBtn) prevBtn.disabled = pag.page === 1;
      if (nextBtn) nextBtn.disabled = pag.page >= pag.total;
      if (info) info.textContent = `Page ${pag.page} of ${pag.total}`;
    }

    if (pageUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin-table-empty">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = pageUsers.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="admin-badge admin-badge--${user.role}">${user.role}</span></td>
        <td>${user.subscription_status || '<em>None</em>'}</td>
        <td>${formatDate(user.created_at)}</td>
        <td>
          <button class="admin-action-btn" data-action="editUser" data-user-id="${user.id}">Edit</button>
          <button class="admin-action-btn admin-action-btn--danger" data-action="deleteUser" data-user-id="${user.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // ========== SUBSCRIPTIONS TABLE ==========

  function renderSubscriptionsTable() {
    const tbody = document.querySelector('[data-table="subscriptions"]');
    if (!tbody) return;

    let subscriptions = [...mockData.subscriptions];

    // Apply status filter
    if (state.filters.subscriptionStatus !== 'all') {
      subscriptions = subscriptions.filter(s => s.status === state.filters.subscriptionStatus);
    }

    // Update stats
    const activeSubs = subscriptions.filter(s => s.status === 'active').length;
    const monthlyRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);
    
    const activeSubsEl = document.querySelector('[data-stat="activeSubs"]');
    const revenueEl = document.querySelector('[data-stat="monthlyRevenue"]');
    if (activeSubsEl) activeSubsEl.textContent = activeSubs;
    if (revenueEl) revenueEl.textContent = `$${monthlyRevenue}`;

    if (subscriptions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin-table-empty">No subscriptions found</td></tr>';
      return;
    }

    tbody.innerHTML = subscriptions.map(sub => `
      <tr>
        <td>${sub.user_name}</td>
        <td><span class="admin-badge admin-badge--${sub.plan}">${sub.plan}</span></td>
        <td><span class="admin-badge admin-badge--${sub.status}">${sub.status}</span></td>
        <td>${formatDate(sub.started)}</td>
        <td>${sub.next_billing ? formatDate(sub.next_billing) : '<em>N/A</em>'}</td>
        <td>$${sub.amount}/mo</td>
        <td>
          <button class="admin-action-btn" data-action="editSubscription" data-sub-id="${sub.id}">Edit</button>
        </td>
      </tr>
    `).join('');
  }

  // ========== COURSES TABLE ==========

  function renderCoursesTable() {
    const tbody = document.querySelector('[data-table="courses"]');
    if (!tbody) return;

    if (mockData.courses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-table-empty">No courses found</td></tr>';
      return;
    }

    tbody.innerHTML = mockData.courses.map(course => `
      <tr>
        <td>${course.id}</td>
        <td>${course.title}</td>
        <td>${course.modules}</td>
        <td><span class="admin-badge admin-badge--${course.status}">${course.status}</span></td>
        <td>${formatDate(course.created_at)}</td>
        <td>
          <button class="admin-action-btn" data-action="editCourse" data-course-id="${course.id}">Edit</button>
          <button class="admin-action-btn" data-action="viewCourse" data-course-id="${course.id}">View</button>
        </td>
      </tr>
    `).join('');
  }

  // ========== MODULES TABLE ==========

  function renderModulesTable() {
    const tbody = document.querySelector('[data-table="modules"]');
    if (!tbody) return;

    let modules = [...mockData.modules];

    // Apply course filter
    if (state.filters.courseFilter !== 'all') {
      const courseId = parseInt(state.filters.courseFilter);
      modules = modules.filter(m => m.course_id === courseId);
    }

    // Update course filter dropdown
    const courseFilter = document.querySelector('[data-filter="courseFilter"]');
    if (courseFilter) {
      const currentValue = courseFilter.value;
      courseFilter.innerHTML = '<option value="all">All Courses</option>' +
        mockData.courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
      courseFilter.value = currentValue;
    }

    if (modules.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-table-empty">No modules found</td></tr>';
      return;
    }

    tbody.innerHTML = modules.map(module => `
      <tr>
        <td>${module.id}</td>
        <td>${module.title}</td>
        <td>${module.course_title}</td>
        <td>Week ${module.week}</td>
        <td><span class="admin-badge admin-badge--${module.status}">${module.status}</span></td>
        <td>
          <button class="admin-action-btn" data-action="editModule" data-module-id="${module.id}">Edit</button>
          <button class="admin-action-btn" data-action="viewModule" data-module-id="${module.id}">View</button>
        </td>
      </tr>
    `).join('');
  }

  // ========== SETTINGS ==========

  function loadSettings() {
    // Load settings from localStorage or use defaults
    const settings = {
      platformName: localStorage.getItem('admin_setting_platformName') || 'Arabic Foundations',
      supportEmail: localStorage.getItem('admin_setting_supportEmail') || 'coach@arabic.one',
      maintenanceMode: localStorage.getItem('admin_setting_maintenanceMode') === 'true',
      premiumPrice: localStorage.getItem('admin_setting_premiumPrice') || '29',
      proPrice: localStorage.getItem('admin_setting_proPrice') || '49'
    };

    Object.keys(settings).forEach(key => {
      const input = document.querySelector(`[data-setting="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = settings[key];
        } else {
          input.value = settings[key];
        }
      }
    });
  }

  // ========== ACTION HANDLERS ==========

  function handleAction(actionType, element) {
    switch (actionType) {
      case 'createUser':
        alert('Create User modal would open here. Backend integration required.');
        break;
      case 'editUser':
        const userId = element.dataset.userId;
        alert(`Edit User ${userId} modal would open here. Backend integration required.`);
        break;
      case 'deleteUser':
        const delUserId = element.dataset.userId;
        if (confirm(`Delete user ${delUserId}? This action cannot be undone.`)) {
          // Remove from mock data
          mockData.users = mockData.users.filter(u => u.id !== parseInt(delUserId));
          saveMockData(mockData);
          renderUsersTable();
          alert('User deleted from mock data. (In production, this would call backend API)');
        }
        break;
      case 'createCourse':
        alert('Create Course modal would open here. Backend integration required.');
        break;
      case 'editCourse':
        const courseId = element.dataset.courseId;
        alert(`Edit Course ${courseId} modal would open here. Backend integration required.`);
        break;
      case 'viewCourse':
        const viewCourseId = element.dataset.courseId;
        window.location.href = `index.html?course=${viewCourseId}`;
        break;
      case 'createModule':
        alert('Create Module modal would open here. Backend integration required.');
        break;
      case 'editModule':
        const moduleId = element.dataset.moduleId;
        alert(`Edit Module ${moduleId} modal would open here. Backend integration required.`);
        break;
      case 'viewModule':
        const viewModuleId = element.dataset.moduleId;
        const module = mockData.modules.find(m => m.id === parseInt(viewModuleId));
        if (module) {
          window.location.href = `week${module.week}.html`;
        }
        break;
      case 'editSubscription':
        const subId = element.dataset.subId;
        alert(`Edit Subscription ${subId} modal would open here. Backend integration required.`);
        break;
      case 'clearMockData':
        if (confirm('Clear all mock data and reset to defaults? This cannot be undone.')) {
          localStorage.removeItem('admin_mock_data');
          mockData = loadMockData();
          saveMockData(mockData);
          // Refresh current page
          const currentPage = state.currentPage;
          showPage(currentPage);
          alert('Mock data cleared and reset to defaults.');
        }
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  }

  // ========== MODAL FUNCTIONS ==========

  function closeModal() {
    if (elements.modal) {
      elements.modal.hidden = true;
    }
  }

  function showModal(title, content) {
    if (!elements.modal) return;
    
    const titleEl = elements.modal.querySelector('[data-modal-title]');
    const bodyEl = elements.modal.querySelector('[data-modal-body]');
    
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = content;
    
    elements.modal.hidden = false;
  }

  // ========== UTILITY FUNCTIONS ==========

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  // ========== PUBLIC API ==========

  return {
    init
  };
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdminPanel.init());
} else {
  AdminPanel.init();
}

