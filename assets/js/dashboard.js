/**
 * ROADREADY RV SERVICE — OWNER DASHBOARD JAVASCRIPT
 * Brand: RoadReady RV Service | Tagline: Keep the Journey Moving.
 * Core Features:
 * - Sidebar Drawer & Accessibility (Mobile/Tablet/Desktop)
 * - Live Search & Keyboard Shortcuts (Cmd+K / Ctrl+K)
 * - Topbar Notification & User Profile Dropdowns
 * - Interactive Modals (Update RV Details, Book Service, Work Order Inspector, Message Composer)
 * - Service Category Activity Table Filters
 * - Demo Data vs Safe Empty State Live Switcher
 * - Dark Mode & RTL Compatibility Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme (Dark / Light) & RTL Layout Controllers
  // -------------------------------------------------------------------------
  const htmlElement = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');

  // Initialize saved theme
  const savedTheme = localStorage.getItem('roadready_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.removeAttribute('data-theme');
  }

  // Initialize saved direction
  const savedDir = localStorage.getItem('roadready_dir') || 'ltr';
  htmlElement.setAttribute('dir', savedDir);

  const updateThemeUI = (isDark) => {
    themeToggles.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  updateThemeUI(savedTheme === 'dark');

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.removeAttribute('data-theme');
      }
      localStorage.setItem('roadready_theme', nextTheme);
      updateThemeUI(nextTheme === 'dark');
      showDashboardToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  });

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = htmlElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      htmlElement.setAttribute('dir', nextDir);
      localStorage.setItem('roadready_dir', nextDir);
      showDashboardToast(`Layout Direction: ${nextDir.toUpperCase()}`);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Off-Canvas Sidebar Drawer (Tablet <=1024px & Mobile)
  // -------------------------------------------------------------------------
  const drawerToggleBtns = document.querySelectorAll('.dashboard-drawer-toggle, .sidebar-toggle-btn, #sidebar-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link, .sidebar-footer-link');

  const openSidebarDrawer = () => {
    if (!sidebar || !backdrop) return;
    sidebar.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    drawerToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    sidebarCloseBtn?.focus();
  };

  const closeSidebarDrawer = () => {
    if (!sidebar || !backdrop) return;
    sidebar.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    drawerToggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  };

  drawerToggleBtns.forEach(btn => btn.addEventListener('click', openSidebarDrawer));
  sidebarCloseBtn?.addEventListener('click', closeSidebarDrawer);
  backdrop?.addEventListener('click', closeSidebarDrawer);

  sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1280) {
        closeSidebarDrawer();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2.1 Messages Mobile Conversation Switcher & Back Navigation
  // -------------------------------------------------------------------------
  const messagesContainer = document.querySelector('.messages-app-container');
  const convoItemBtns = document.querySelectorAll('.convo-item-btn');
  const backToConvosBtn = document.querySelector('.btn-back-to-convos');

  convoItemBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      convoItemBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (messagesContainer) {
        messagesContainer.classList.add('chat-open');
      }
    });
  });

  backToConvosBtn?.addEventListener('click', () => {
    if (messagesContainer) {
      messagesContainer.classList.remove('chat-open');
    }
  });

  // -------------------------------------------------------------------------
  // 3. Topbar Dropdowns (Notifications & Profile)
  // -------------------------------------------------------------------------
  const notificationToggle = document.querySelector('.notification-toggle-btn');
  const notificationMenu = document.querySelector('.notification-dropdown-menu');
  const profileToggle = document.querySelector('.profile-dropdown-trigger');
  const profileMenu = document.querySelector('.profile-dropdown-menu');

  const closeAllDropdowns = () => {
    notificationMenu?.classList.remove('active');
    profileMenu?.classList.remove('active');
    notificationToggle?.setAttribute('aria-expanded', 'false');
    profileToggle?.setAttribute('aria-expanded', 'false');
  };

  notificationToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = notificationMenu?.classList.contains('active');
    closeAllDropdowns();
    if (!isActive) {
      notificationMenu?.classList.add('active');
      notificationToggle.setAttribute('aria-expanded', 'true');
    }
  });

  profileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = profileMenu?.classList.contains('active');
    closeAllDropdowns();
    if (!isActive) {
      profileMenu?.classList.add('active');
      profileToggle.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-menu-wrapper')) {
      closeAllDropdowns();
    }
  });

  // -------------------------------------------------------------------------
  // 4. Live Search & Keyboard Shortcuts (Cmd+K / Ctrl+K / /)
  // -------------------------------------------------------------------------
  const searchInput = document.querySelector('.topbar-search-input');
  const searchDropdown = document.querySelector('.search-results-dropdown');

  const searchIndex = [
    { title: 'Next Service Appointment', category: 'Appointments', target: '#section-appointment' },
    { title: '2024 Grand Tourer RV Details', category: 'My RV', target: '#section-rv-status' },
    { title: 'Rooftop Dicor Lap Seal Audit', category: 'Reminders', target: '#section-reminders' },
    { title: 'Service Request #RR-8842 Status', category: 'Service Tracker', target: '#section-tracker' },
    { title: 'Generator 100-Hr Service Record', category: 'History', target: '#section-activity' },
    { title: 'Annual Inspection Certificate PDF', category: 'Documents', target: '#section-documents' },
    { title: 'Auxiliary House Battery Voltage', category: 'Diagnostics', target: '#section-rv-status' },
    { title: 'RoadReady Service Advisor Messages', category: 'Messages', target: '#section-messages' }
  ];

  const handleSearch = (query) => {
    if (!query || query.trim() === '') {
      if (searchDropdown) searchDropdown.classList.remove('active');
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const matches = searchIndex.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) || 
      item.category.toLowerCase().includes(cleanQuery)
    );

    if (matches.length > 0 && searchDropdown) {
      searchDropdown.innerHTML = matches.map(match => `
        <a href="${match.target}" class="search-result-item" data-search-target="${match.target}">
          <span>${match.title}</span>
          <span class="search-result-category">${match.category}</span>
        </a>
      `).join('');
      searchDropdown.classList.add('active');

      searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = item.getAttribute('data-search-target');
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            searchDropdown.classList.remove('active');
            searchInput.value = '';
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.style.transition = 'outline 0.3s ease';
            targetEl.style.outline = '2px solid var(--color-accent)';
            setTimeout(() => { targetEl.style.outline = ''; }, 2000);
          }
        });
      });
    } else if (searchDropdown) {
      searchDropdown.innerHTML = `
        <div style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">
          No matching RV records or sections found for "${query}".
        </div>
      `;
      searchDropdown.classList.add('active');
    }
  };

  searchInput?.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape') {
      closeSidebarDrawer();
      closeAllDropdowns();
      searchDropdown?.classList.remove('active');
      closeAllDashboardModals();
    }
  });

  // -------------------------------------------------------------------------
  // 5. Interactive Modals System
  // -------------------------------------------------------------------------
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  window.openDashboardModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea, button:not([data-modal-close])');
    firstInput?.focus();
  };

  window.closeDashboardModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const closeAllDashboardModals = () => {
    modalBackdrops.forEach(modal => window.closeDashboardModal(modal));
  };

  document.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-modal-target');
      if (target) window.openDashboardModal(target);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) window.closeDashboardModal(modal);
    });
  });

  modalBackdrops.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeDashboardModal(modal);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. RV Details Live Editor Modal
  // -------------------------------------------------------------------------
  const rvEditForm = document.getElementById('rv-details-form');
  const rvNameEl = document.getElementById('display-rv-name');
  const rvTypeEl = document.getElementById('display-rv-type');
  const rvYearEl = document.getElementById('display-rv-year');
  const rvMileageEl = document.getElementById('display-rv-mileage');
  const rvChassisEl = document.getElementById('display-rv-chassis');

  // Load saved RV details if available
  const loadSavedRVDetails = () => {
    const savedRV = JSON.parse(localStorage.getItem('roadready_rv_data') || 'null');
    if (savedRV) {
      if (rvNameEl) rvNameEl.textContent = savedRV.name || '2024 Grand Tourer Elite';
      if (rvTypeEl) rvTypeEl.textContent = savedRV.type || 'Class A Diesel Pusher (40ft)';
      if (rvYearEl) rvYearEl.textContent = savedRV.year || '2024';
      if (rvMileageEl) rvMileageEl.textContent = savedRV.mileage || '14,820 mi • 312 hrs';
      if (rvChassisEl) rvChassisEl.textContent = savedRV.chassis || 'Freightliner XC-R • Cummins L9';
    }
  };

  loadSavedRVDetails();

  if (rvEditForm) {
    rvEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(rvEditForm);
      const rvData = {
        name: formData.get('rvName') || '2024 Grand Tourer Elite',
        type: formData.get('rvType') || 'Class A Diesel Pusher (40ft)',
        year: formData.get('rvYear') || '2024',
        mileage: formData.get('rvMileage') || '14,820 mi',
        chassis: formData.get('rvChassis') || 'Freightliner XC-R'
      };

      localStorage.setItem('roadready_rv_data', JSON.stringify(rvData));
      loadSavedRVDetails();
      closeAllDashboardModals();
      showDashboardToast('RV profile details saved and synced.');
    });
  }

  // -------------------------------------------------------------------------
  // 7. Service Planner / Booking Modal
  // -------------------------------------------------------------------------
  const serviceBookingForm = document.getElementById('dashboard-service-booking-form');
  if (serviceBookingForm) {
    serviceBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllDashboardModals();
      showDashboardToast('Service request received! Bay advisor will confirm schedule shortly.', 4000);
      serviceBookingForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 8. Service Activity Table Category Filtering
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.activity-filter-btn');
  const activityRows = document.querySelectorAll('.dashboard-table tbody tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      activityRows.forEach(row => {
        const category = row.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 9. Work Order Reader Modal
  // -------------------------------------------------------------------------
  const workOrderData = {
    'WO-9921': {
      title: 'Generator 100-Hr Service & Fuel Filter Replacement',
      date: 'October 14, 2024',
      status: 'Completed & Certified',
      technician: 'Lead Master Tech #12 (Bay 4)',
      summary: 'Completed scheduled 100-hour Cummins Onan QD8000 diesel generator service. Replaced fuel filter, oil filter (15W-40 synthetic blend), and cleaned spark arrestor. Voltage output verified under full heat pump and microwave load at 120.4V / 60.1 Hz.',
      checklist: [
        'Oil and filter drained and replaced with OEM spec fluid',
        'Fuel line continuity and primer bulb pressure verified',
        'Air intake filter inspected and housing sealed',
        'Exhaust mounting brackets torqued to 35 ft-lbs'
      ]
    },
    'WO-8402': {
      title: 'Dicor Lap Seal Reseal & Skylight Integrity Check',
      date: 'August 28, 2024',
      status: 'Completed & Certified',
      technician: 'Roof & Seal Specialist #08 (Bay 2)',
      summary: 'Full rooftop inspection of front fiberglass cap joint, skylights, plumbing vent boots, and dual Dometic A/C gaskets. Cleaned degraded lap sealant and applied self-leveling Dicor sealant bead. Water intrusion test completed with zero moisture penetration.',
      checklist: [
        'Front and rear cap transition seams cleaned and resealed',
        'Shower skylight dome inspected for UV stress cracks (passed)',
        'Plumbing vent pipes sealed and cap hoods secured',
        'Side gutter channel drip rails cleared and re-adhered'
      ]
    },
    'WO-7719': {
      title: 'Aqua-Hot Hydronic Heating Flush & Testing',
      date: 'June 12, 2024',
      status: 'Completed & Certified',
      technician: 'Hydronic Climate Tech #04 (Bay 3)',
      summary: 'Drained and replaced boiler fluid in Aqua-Hot 400D system using Century Chemical transfer fluid. Tested diesel burner nozzle spray pattern, igniter electrode gap, and electric element operation. Domestic continuous hot water temperature verified at 122°F.',
      checklist: [
        'Boiler antifreeze refractometer check completed (50/50 ratio)',
        'Fuel filter replaced and diesel nozzle cleaned',
        'Zone 1 and Zone 2 circulation pumps operation verified',
        'Exhaust pipe carbon clearance checked'
      ]
    },
    'WO-6540': {
      title: 'Pre-Season De-Winterization & Sanitization',
      date: 'April 05, 2024',
      status: 'Completed & Certified',
      technician: 'General Service Tech #19 (Bay 1)',
      summary: 'System de-winterization protocol completed. Flushed non-toxic antifreeze from freshwater lines, sanitized tank with sodium hypochlorite solution, tested 12V Shurflo water pump pressure cutoff, and verified all city water check valves.',
      checklist: [
        'Freshwater tank drained, sanitized and rinsed',
        'Water heater bypass reconfigured for operational mode',
        'Low-point drains pressure tested at 50 PSI',
        'P-traps and gray/black waste dump valves lubricated'
      ]
    }
  };

  document.querySelectorAll('[data-work-order]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const woId = btn.getAttribute('data-work-order');
      const data = workOrderData[woId];

      if (data) {
        document.getElementById('wo-modal-code').textContent = woId;
        document.getElementById('wo-modal-title').textContent = data.title;
        document.getElementById('wo-modal-date').textContent = data.date;
        document.getElementById('wo-modal-status').textContent = data.status;
        document.getElementById('wo-modal-tech').textContent = data.technician;
        document.getElementById('wo-modal-summary').textContent = data.summary;
        
        const checklistEl = document.getElementById('wo-modal-checklist');
        if (checklistEl) {
          checklistEl.innerHTML = data.checklist.map(item => `
            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--color-text-main); margin-bottom: 6px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success); flex-shrink: 0;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${item}</span>
            </li>
          `).join('');
        }

        window.openDashboardModal('work-order-modal');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 10. Message Composer Modal
  // -------------------------------------------------------------------------
  const messageForm = document.getElementById('quick-message-form');
  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllDashboardModals();
      showDashboardToast('Message sent to RoadReady Service Advisor.', 3500);
      messageForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 11. Profile, Settings, & Service Request Form Handlers
  // -------------------------------------------------------------------------
  const profileForms = document.querySelectorAll('#profile-form, form[action*="profile"], .profile-form');
  profileForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showDashboardToast('Profile contact details saved and synchronized.');
    });
  });

  const settingsForms = document.querySelectorAll('#security-form, #preferences-form, #settings-form, .settings-form');
  settingsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showDashboardToast('Security preferences & notification channels updated.');
    });
  });

  const requestForms = document.querySelectorAll('#service-request-form, #new-request-form');
  requestForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllDashboardModals();
      showDashboardToast('Service request submitted to RoadReady Bay Advisor.');
      form.reset();
    });
  });

  // Document download action feedback
  const docDownloadBtns = document.querySelectorAll('.btn-doc-download, [data-doc-download], .doc-item-action');
  docDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      showDashboardToast('Downloading certified compliance PDF...');
    });
  });

  // -------------------------------------------------------------------------
  // 12. Live Toggle for Demo Data vs Safe Empty States
  // -------------------------------------------------------------------------
  const stateToggleBtn = document.getElementById('toggle-dashboard-state-btn');
  let isDemoState = true;

  if (stateToggleBtn) {
    stateToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isDemoState = !isDemoState;

      // Toggle cards & empty states
      document.querySelectorAll('.populated-content').forEach(el => {
        el.style.display = isDemoState ? '' : 'none';
      });

      document.querySelectorAll('.dashboard-empty-state').forEach(el => {
        el.classList.toggle('active', !isDemoState);
      });

      stateToggleBtn.textContent = isDemoState ? 'Switch to Safe Empty State' : 'Switch to Populated Demo';
      closeAllDropdowns();
      showDashboardToast(isDemoState ? 'Viewing Populated Demo Data' : 'Viewing Safe Empty States');
    });
  }

  // -------------------------------------------------------------------------
  // 12. Toast Notification Utility
  // -------------------------------------------------------------------------
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showDashboardToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-item toast-success';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success); flex-shrink: 0;">
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

  window.showDashboardToast = showDashboardToast;
});
