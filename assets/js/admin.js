/**
 * ROADREADY RV SERVICE - ADMIN OPERATIONS CENTER JAVASCRIPT
 * Handles theme toggles, RTL/LTR direction, off-canvas navigation drawer,
 * live search, notification flyouts, admin modals, table filters, settings tabs,
 * interactive action responses, and live toast notifications.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility System
  // --------------------------------------------------------------------------
  let toastContainer = document.querySelector('.admin-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'admin-toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showAdminToast(message, duration = 3200) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast-item';
    toast.innerHTML = `
      <svg class="admin-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  window.showAdminToast = showAdminToast;

  // --------------------------------------------------------------------------
  // 2. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('roadready_theme') || 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roadready_theme', theme);
    themeToggleBtns.forEach(btn => {
      const moon = btn.querySelector('.icon-moon');
      const sun = btn.querySelector('.icon-sun');
      if (moon && sun) {
        if (theme === 'dark') {
          moon.style.display = 'none';
          sun.style.display = 'block';
        } else {
          moon.style.display = 'block';
          sun.style.display = 'none';
        }
      }
    });
  }

  applyTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target);
      showAdminToast(`Switched to ${target === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  });

  // --------------------------------------------------------------------------
  // 3. RTL / LTR Direction Management
  // --------------------------------------------------------------------------
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('roadready_dir') || 'ltr';

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('roadready_dir', dir);
  }

  applyDirection(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const target = current === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(target);
      showAdminToast(`Layout Direction: ${target.toUpperCase()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Admin Off-Canvas Drawer Navigation
  // --------------------------------------------------------------------------
  const drawerToggleBtns = document.querySelectorAll('.admin-drawer-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const backdrop = document.querySelector('.admin-sidebar-backdrop');
  const sidebarClose = document.querySelector('.admin-sidebar-close');

  function openDrawer() {
    if (sidebar) sidebar.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    drawerToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  }

  function closeDrawer() {
    if (sidebar) sidebar.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    drawerToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }

  drawerToggleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openDrawer();
    });
  });

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeAllDropdowns();
      closeAllModals();
    }
  });

  // Auto-close drawer on link click in mobile view
  const navLinks = document.querySelectorAll('.admin-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 1280) {
        closeDrawer();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Dropdowns (Notifications & Admin Profile)
  // --------------------------------------------------------------------------
  const dropdownTriggers = document.querySelectorAll('.admin-dropdown-trigger, .notification-toggle-btn, .admin-profile-trigger');
  const dropdownMenus = document.querySelectorAll('.admin-dropdown-menu');

  function closeAllDropdowns() {
    dropdownMenus.forEach(menu => menu.classList.remove('active'));
    dropdownTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }

  dropdownTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const parent = btn.closest('.admin-dropdown-wrapper');
      const menu = parent ? parent.querySelector('.admin-dropdown-menu') : null;
      if (menu) {
        const isOpen = menu.classList.contains('active');
        closeAllDropdowns();
        if (!isOpen) {
          menu.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.admin-dropdown-wrapper')) {
      closeAllDropdowns();
    }
  });

  // --------------------------------------------------------------------------
  // 6. Live Search & Shortcut Handler (⌘K / Ctrl+K)
  // --------------------------------------------------------------------------
  const searchInput = document.querySelector('.admin-search-input');
  
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 7. Modals Management
  // --------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');
  const allModals = document.querySelectorAll('.admin-modal-backdrop');

  function closeAllModals() {
    allModals.forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  allModals.forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. Table Filter Pill Buttons
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.admin-pill-btn');
  filterPills.forEach(pill => {
    pill.addEventListener('click', function () {
      const group = pill.closest('.admin-filter-group');
      if (group) {
        group.querySelectorAll('.admin-pill-btn').forEach(p => p.classList.remove('active'));
      }
      pill.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // 9. Settings Navigation Tabs
  // --------------------------------------------------------------------------
  const settingsTabs = document.querySelectorAll('.admin-settings-tab');
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      settingsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showAdminToast(`Loaded settings tab: ${tab.textContent.trim()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 10. Quick Table & List Search Filter
  // --------------------------------------------------------------------------
  const quickFilterInputs = document.querySelectorAll('.admin-filter-bar input[type="search"], .admin-search-input');
  quickFilterInputs.forEach(input => {
    input.addEventListener('input', function () {
      const query = input.value.toLowerCase().trim();
      const table = document.querySelector('.admin-table tbody');
      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. Interactive Modal Action Triggers & Toast Responses
  // --------------------------------------------------------------------------
  const modalActionButtons = [
    { target: 'add-owner-modal', msg: 'New coach owner registered into directory' },
    { target: 'add-rv-modal', msg: 'New RV coach profile added to fleet registry' },
    { target: 'schedule-appointment-modal', msg: 'Service bay slot scheduled successfully' },
    { target: 'assign-bay-modal', msg: 'Service request assigned to Bay 2 (Marcus Vance)' },
    { target: 'new-request-modal', msg: 'Internal Work Order created and queued' },
    { target: 'add-log-modal', msg: 'Maintenance event logged & parts deducted from inventory' },
    { target: 'log-details-modal', msg: 'Supervisor road-clearance certificate approved & issued' },
    { target: 'add-service-modal', msg: 'Service package rates & standard bay hours updated' },
    { target: 'add-tech-modal', msg: 'Technician credentials & bay assignment updated' },
    { target: 'add-claim-modal', msg: 'Warranty claim transmitted to OEM division' },
    { target: 'claim-details-modal', msg: 'OEM warranty adjudication packet downloaded' },
    { target: 'new-msg-modal', msg: 'Direct message sent to coach owner portal' },
    { target: 'triage-modal', msg: 'Inbound inquiry converted to Active Work Order' },
    { target: 'new-lead-modal', msg: 'Inbound service call logged into triage queue' },
    { target: 'upload-doc-modal', msg: 'File encrypted and uploaded to compliance vault' },
    { target: 'doc-view-modal', msg: 'Verified PDF downloaded with SHA-256 seal' },
    { target: 'edit-zone-modal', msg: 'Mobile dispatch coverage zone updated' },
    { target: 'export-modal', msg: 'Facility operations audit report generated' },
    { target: 'saved-modal', msg: 'Facility settings saved successfully' }
  ];

  modalActionButtons.forEach(action => {
    const modal = document.getElementById(action.target);
    if (modal) {
      const confirmBtn = modal.querySelector('.admin-modal-footer .btn-admin-primary');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
          closeAllModals();
          showAdminToast(action.msg);
        });
      }
    }
  });

  // --------------------------------------------------------------------------
  // 12. Chat Composer Real-time Interaction (messages.html)
  // --------------------------------------------------------------------------
  const chatComposer = document.querySelector('.admin-chat-composer');
  if (chatComposer) {
    const composerInput = chatComposer.querySelector('input');
    const sendBtn = chatComposer.querySelector('.btn-admin-primary');
    const bayNoteBtn = chatComposer.querySelector('.btn-admin-secondary');
    const messagesStream = document.querySelector('.admin-chat-messages');

    function sendChatMessage(isInternalNote = false) {
      if (!composerInput || !messagesStream) return;
      const text = composerInput.value.trim();
      if (!text) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const bubble = document.createElement('div');
      
      if (isInternalNote) {
        bubble.className = 'admin-msg-bubble admin-msg-internal';
        bubble.innerHTML = `
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--color-accent); margin-bottom: 2px;">INTERNAL BAY NOTE — ROADREADY SUPERVISOR</div>
          <div>${text}</div>
          <span class="admin-msg-time" style="color: var(--color-text-muted);">${time}</span>
        `;
      } else {
        bubble.className = 'admin-msg-bubble admin-msg-outgoing';
        bubble.innerHTML = `
          <div>${text}</div>
          <span class="admin-msg-time">${time} • RoadReady Operations</span>
        `;
      }

      messagesStream.appendChild(bubble);
      messagesStream.scrollTop = messagesStream.scrollHeight;
      composerInput.value = '';
      showAdminToast(isInternalNote ? 'Internal bay note logged' : 'Message sent to coach owner');
    }

    sendBtn?.addEventListener('click', () => sendChatMessage(false));
    bayNoteBtn?.addEventListener('click', () => sendChatMessage(true));
    composerInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. Chat List Item Switching & Mobile Navigation (messages.html)
  // --------------------------------------------------------------------------
  const adminChatContainer = document.querySelector('.admin-chat-container');
  const chatListItems = document.querySelectorAll('.admin-chat-item');
  const backToAdminConvosBtn = document.querySelector('.btn-back-to-admin-convos');

  chatListItems.forEach(item => {
    item.addEventListener('click', function () {
      chatListItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const name = item.querySelector('.admin-chat-item-name')?.textContent || 'Coach Owner';
      const headerName = document.querySelector('.admin-chat-header strong');
      const headerMeta = document.querySelector('.admin-chat-header span');
      const headerAvatar = document.querySelector('.admin-chat-header .admin-avatar');
      const itemAvatar = item.querySelector('.admin-avatar');

      if (headerName) headerName.textContent = name;
      if (headerAvatar && itemAvatar) {
        headerAvatar.textContent = itemAvatar.textContent;
        headerAvatar.style.background = itemAvatar.style.background || 'var(--color-primary)';
      }

      if (adminChatContainer) {
        adminChatContainer.classList.add('chat-open');
      }
      showAdminToast(`Opened conversation with ${name}`);
    });
  });

  backToAdminConvosBtn?.addEventListener('click', function () {
    if (adminChatContainer) {
      adminChatContainer.classList.remove('chat-open');
    }
  });

});
