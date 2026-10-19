/**
 * ROADREADY RV SERVICE - MASTER JAVASCRIPT
 * Core functionality: Theme Switcher, RTL/LTR Switcher, Desktop Dropdowns,
 * Drawer Navigation with Submenus, Interactive Checklist, Modals, and Accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme (Dark / Light Mode) Controller
  // -------------------------------------------------------------------------
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const htmlElement = document.documentElement;

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('roadready_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      updateThemeIcons(true);
    } else {
      htmlElement.removeAttribute('data-theme');
      updateThemeIcons(false);
    }
    localStorage.setItem('roadready_theme', theme);
  };

  const updateThemeIcons = (isDark) => {
    themeToggles.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      const labelText = btn.querySelector('.theme-label-text');

      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
      if (labelText) {
        labelText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  // Initialize Theme
  applyTheme(getPreferredTheme());

  // Listen to toggle clicks
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  });

  // Listen to OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('roadready_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // -------------------------------------------------------------------------
  // 2. RTL / LTR Direction Controller
  // -------------------------------------------------------------------------
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');

  const getPreferredDir = () => {
    return localStorage.getItem('roadready_dir') || 'ltr';
  };

  const applyDir = (dir) => {
    htmlElement.setAttribute('dir', dir);
    localStorage.setItem('roadready_dir', dir);

    rtlToggles.forEach(btn => {
      const labelText = btn.querySelector('.rtl-label-text');
      if (labelText) {
        if (btn.classList.contains('drawer-control-item')) {
          labelText.textContent = dir === 'rtl' ? 'LTR Mode' : 'RTL Mode';
        } else {
          labelText.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
      } else if (!btn.querySelector('svg')) {
        btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  };

  // Initialize Direction
  applyDir(getPreferredDir());

  // Listen to RTL toggle clicks
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = htmlElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDir(nextDir);
      showToast(`Layout Direction: ${nextDir.toUpperCase()}`);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Desktop Dropdown Interaction (Home & Owner Portal)
  // -------------------------------------------------------------------------
  const desktopDropdownToggles = document.querySelectorAll('.navbar-nav-desktop .nav-dropdown-toggle');
  const desktopDropdownItems = document.querySelectorAll('.navbar-nav-desktop .nav-item');

  desktopDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = toggle.closest('.nav-item');
      const isCurrentlyOpen = parentItem.classList.contains('open');

      // Close other dropdowns
      desktopDropdownItems.forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('open');
          item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isCurrentlyOpen) {
        parentItem.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      desktopDropdownItems.forEach(item => {
        item.classList.remove('open');
        item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // -------------------------------------------------------------------------
  // 4. Mobile & Tablet Drawer Navigation with Accordions
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.mobile-drawer-backdrop');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link:not(.drawer-accordion-btn), .drawer-submenu-link');
  const drawerAccordionButtons = document.querySelectorAll('.drawer-accordion-btn');

  const openDrawer = () => {
    if (!drawer || !drawerBackdrop) return;
    drawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    drawerCloseBtn?.focus();
  };

  const closeDrawer = () => {
    if (!drawer || !drawerBackdrop) return;
    drawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    hamburgerBtn?.focus();
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Mobile Drawer Accordion Submenus
  drawerAccordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const submenuId = btn.getAttribute('data-submenu-target');
      const submenu = document.getElementById(submenuId);
      const isExpanded = btn.classList.contains('expanded');

      if (isExpanded) {
        btn.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        submenu?.classList.remove('open');
      } else {
        btn.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        submenu?.classList.add('open');
      }
    });
  });

  // Close dropdowns & drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer && drawer.classList.contains('active')) {
        closeDrawer();
      }
      desktopDropdownItems.forEach(item => {
        item.classList.remove('open');
        item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      closeAllModals();
    }
  });

  // -------------------------------------------------------------------------
  // 5. Sticky Header Blur State
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 6. Interactive Pre-Trip Readiness Checklist
  // -------------------------------------------------------------------------
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const isChecked = item.classList.contains('checked');
      const itemTitle = item.querySelector('.checklist-info h3')?.textContent || 'Item';
      
      if (isChecked) {
        showToast(`Checked: ${itemTitle}`);
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Modal System (Service Planner & Checklist)
  // -------------------------------------------------------------------------
  const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal-backdrop');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;
    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstFocusable = targetModal.querySelector('button, input, select, textarea');
    firstFocusable?.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const closeAllModals = () => {
    modals.forEach(modal => closeModal(modal));
  };

  modalOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      if (targetId) openModal(targetId);
    });
  });

  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Service Planner Form Submit
  const plannerForm = document.getElementById('service-planner-form');
  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
      showToast('Service Request Planned! Our bay coordinator will reach out.', 4000);
      plannerForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 9. Services Page - Interactive Tabbed Service Explorer
  // -------------------------------------------------------------------------
  const serviceTabs = document.querySelectorAll('.service-tab-btn');
  const servicePanels = document.querySelectorAll('.service-tab-panel');

  if (serviceTabs.length > 0) {
    const activateTab = (targetTab) => {
      const targetPanelId = targetTab.getAttribute('aria-controls');
      
      serviceTabs.forEach(tab => {
        const isTarget = tab === targetTab;
        tab.classList.toggle('active', isTarget);
        tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        tab.setAttribute('tabindex', isTarget ? '0' : '-1');
      });

      servicePanels.forEach(panel => {
        const isTarget = panel.id === targetPanelId;
        panel.classList.toggle('active', isTarget);
        panel.hidden = !isTarget;
      });
    };

    serviceTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activateTab(tab);
      });

      // Keyboard Accessibility for Tabs
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % serviceTabs.length;
          serviceTabs[newIndex].focus();
          activateTab(serviceTabs[newIndex]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + serviceTabs.length) % serviceTabs.length;
          serviceTabs[newIndex].focus();
          activateTab(serviceTabs[newIndex]);
        } else if (e.key === 'Home') {
          e.preventDefault();
          serviceTabs[0].focus();
          activateTab(serviceTabs[0]);
        } else if (e.key === 'End') {
          e.preventDefault();
          serviceTabs[serviceTabs.length - 1].focus();
          activateTab(serviceTabs[serviceTabs.length - 1]);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 10. Services Page - Decision Pathway Interactive Selector
  // -------------------------------------------------------------------------
  const pathwayCards = document.querySelectorAll('.pathway-item');
  const serviceSelectInput = document.getElementById('req-service-needed');

  pathwayCards.forEach(card => {
    card.addEventListener('click', () => {
      pathwayCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const targetService = card.getAttribute('data-service-val');
      if (targetService && serviceSelectInput) {
        serviceSelectInput.value = targetService;
      }
      
      const serviceName = card.querySelector('.pathway-target-title')?.textContent || 'Service';
      showToast(`Selected Pathway: ${serviceName}`);
    });
  });

  // Quick Select Service from Explorer Buttons
  const selectServiceButtons = document.querySelectorAll('[data-select-service]');
  selectServiceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceVal = btn.getAttribute('data-select-service');
      if (serviceVal && serviceSelectInput) {
        serviceSelectInput.value = serviceVal;
      }
      const requestSection = document.getElementById('service-request-section');
      if (requestSection) {
        requestSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 11. Services & Contact Page - Service Request Form Handler
  // -------------------------------------------------------------------------
  const serviceRequestForm = document.getElementById('service-request');
  const contactForm = document.getElementById('contact-intake-form');

  if (serviceRequestForm) {
    serviceRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Your request form is ready to connect to the service workflow.', 4500);
      serviceRequestForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Your request is prepared and ready to connect to the RoadReady service desk.', 4500);
      contactForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 12. Service Areas Page - Interactive Service Path Selector
  // -------------------------------------------------------------------------
  const coveragePathButtons = document.querySelectorAll('.coverage-path-btn');
  const coveragePreviewTitle = document.getElementById('coverage-preview-title');
  const coveragePreviewDesc = document.getElementById('coverage-preview-desc');
  const coveragePreviewLink = document.getElementById('coverage-preview-link');

  const servicePathData = {
    'maintenance': {
      title: 'ROUTINE MAINTENANCE',
      desc: 'Chassis lubrication, powertrain inspection, engine cooling, and brake pad wear evaluation.',
      href: 'maintenance.html',
      name: 'RV Maintenance'
    },
    'winterization': {
      title: 'SEASONAL PREPARATION',
      desc: 'Cold-season plumbing purge, non-toxic antifreeze line fill, and battery isolation staging.',
      href: 'winterization.html',
      name: 'Winterization'
    },
    'electrical-plumbing': {
      title: 'ELECTRICAL OR PLUMBING',
      desc: '12V battery bank diagnostics, pure sine inverters, shore power transfer switches, and PEX pressure checks.',
      href: 'electrical-plumbing.html',
      name: 'Electrical & Plumbing'
    },
    'hvac-appliances': {
      title: 'HVAC OR APPLIANCES',
      desc: 'Rooftop A/C temperature differential, furnace heat exchanger airflow, and absorption refrigeration cycles.',
      href: 'hvac-appliances.html',
      name: 'HVAC & Appliances'
    },
    'roof-exterior': {
      title: 'ROOF OR EXTERIOR',
      desc: 'Dicor self-leveling lap seal elasticity, slide-out wiper barriers, and window sealant audits.',
      href: 'roof-exterior.html',
      name: 'Roof & Exterior'
    },
    'pre-trip': {
      title: 'PRE-TRIP CHECK',
      desc: 'Comprehensive multi-point departure audit, tire torque & wear, 7-pin lighting, and hitch breakaway tests.',
      href: 'pre-trip-inspection.html',
      name: 'Pre-Trip Inspection'
    }
  };

  if (coveragePathButtons.length > 0) {
    coveragePathButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        coveragePathButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const pathKey = btn.getAttribute('data-path-key');
        const data = servicePathData[pathKey];

        if (data && coveragePreviewTitle && coveragePreviewDesc && coveragePreviewLink) {
          coveragePreviewTitle.textContent = data.title;
          coveragePreviewDesc.textContent = data.desc;
          coveragePreviewLink.setAttribute('href', data.href);
          coveragePreviewLink.querySelector('span').textContent = `VIEW ${data.title}`;
          showToast(`Selected Category: ${data.name}`);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 13. Service Areas Page - Availability Check Form Handler
  // -------------------------------------------------------------------------
  const availabilityForm = document.getElementById('availability-check');
  if (availabilityForm) {
    availabilityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Safe feedback message
      showToast('Your coverage details are ready to connect to the service-request workflow.', 4500);
      availabilityForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 14. Blog Page - Category Filtering & Article Preview Handlers
  // -------------------------------------------------------------------------
  const journalFilterBtns = document.querySelectorAll('.journal-filter-btn');
  const journalTopicItems = document.querySelectorAll('.journal-topic-item');
  const practicalNoteRows = document.querySelectorAll('.practical-note-row');

  function filterBlogCategory(category, label, shouldScroll = true) {
    if (!practicalNoteRows.length) return;

    let matchCount = 0;
    practicalNoteRows.forEach(row => {
      const rowCat = row.getAttribute('data-category');
      if (category === 'all' || rowCat === category) {
        row.style.display = 'grid';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    journalFilterBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-filter') === category;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    journalTopicItems.forEach(item => {
      const isTarget = item.getAttribute('data-topic-filter') === category;
      item.classList.toggle('active', isTarget);
    });

    if (shouldScroll) {
      const practicalSection = document.getElementById('practical-notes-section');
      if (practicalSection) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 72;
        const targetTop = practicalSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    }

    showToast(`Showing: ${label || 'All Topics'} (${matchCount} ${matchCount === 1 ? 'article' : 'articles'})`);
  }

  if (journalFilterBtns.length > 0) {
    journalFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filterKey = btn.getAttribute('data-filter');
        const filterLabel = btn.textContent.trim();
        filterBlogCategory(filterKey, filterLabel, true);
      });
    });
  }

  if (journalTopicItems.length > 0) {
    journalTopicItems.forEach(item => {
      item.addEventListener('click', () => {
        const topicKey = item.getAttribute('data-topic-filter');
        const topicTitle = item.querySelector('.journal-topic-title') ? item.querySelector('.journal-topic-title').textContent.trim() : topicKey;
        
        filterBlogCategory(topicKey, topicTitle, true);
      });
    });
  }

  // Article Reader Modal Logic
  const articleModal = document.getElementById('article-reader-modal');
  const articleModalTitle = document.getElementById('article-modal-title');
  const articleModalTag = document.getElementById('article-modal-tag');
  const articleModalBody = document.getElementById('article-modal-body');
  const articleTriggers = document.querySelectorAll('[data-article-id]');

  const articleDetailsData = {
    'article-pretrip': {
      title: 'WHAT TO CHECK BEFORE YOUR NEXT LONG RV TRIP',
      tag: 'PRE-TRIP PREPARATION • ROADREADY FIELD NOTE',
      content: `
        <p>A successful long-distance RV journey relies on proactive system verification before departure morning. Inspecting key chassis, plumbing, electrical, and weatherproofing components avoids roadside disruptions.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">1. Chassis &amp; Running Gear</h4>
        <p>Measure cold tire inflation using a calibrated gauge, verify DOT tire date codes (recommend replacement beyond 5–6 years), and check lug nut torque according to manufacturer specifications.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">2. 12V House Electrical &amp; Inverter</h4>
        <p>Test deep-cycle battery bank resting voltages, inspect terminal cleanliness, and confirm automatic transfer switch switching continuity under simulated shore/inverter load.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">3. Roof Lap Seal &amp; Slide-Out Wiper Audit</h4>
        <p>Walk the roof perimeter to inspect Dicor self-leveling sealant joints around vent fans and skylights. Ensure slide-out rubber wiper seals are conditioned and free of cracks.</p>
      `
    },
    'article-winterization': {
      title: 'WINTERIZATION WITHOUT THE GUESSWORK',
      tag: 'SEASONAL CARE • COLD-WEATHER GUIDE',
      content: `
        <p>Plumbing lines, water heaters, and water pumps are highly susceptible to freeze damage when temperatures dip below freezing. Proper winterization prevents burst PEX fittings and costly spring repairs.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Water Heater Bypass &amp; Tank Drain</h4>
        <p>Always isolate the water heater tank using the bypass valve before introducing non-toxic RV antifreeze. Drain the tank anode rod and freshwater holding reservoir thoroughly.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Pressurized Antifreeze Line Fill</h4>
        <p>Draw pink non-toxic propylene glycol antifreeze through all hot and cold faucets, low-point drains, exterior shower sprayers, and toilet valves until a solid stream emerges.</p>
      `
    },
    'article-electrical': {
      title: 'WHEN AN RV ELECTRICAL ISSUE STARTS SMALL',
      tag: 'ELECTRICAL SYSTEMS • DIAGNOSTIC NOTE',
      content: `
        <p>Intermittent 12V flicker, inverter error codes, or tripped converter breakers are often early indicators of loose ground bonding or degraded battery capacity.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Voltage Drop Under Load</h4>
        <p>Measuring resting battery voltage can be deceptive. A weak battery bank may show 12.6V at rest but plunge below 10.5V as soon as a furnace blower or slide-out motor engages.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Transfer Switch Continuity</h4>
        <p>Loose lugs in 50A shore power junction boxes can lead to excessive thermal resistance. Professional torque checks ensure clean alternating current delivery.</p>
      `
    },
    'article-roof': {
      title: 'A CLOSER LOOK AT ROOF & SEAL CONDITION',
      tag: 'EXTERIOR CARE • PREVENTATIVE MAINTENANCE',
      content: `
        <p>Water intrusion is the single most destructive hazard an RV owner faces. Because roof seams flex continuously during transit, annual sealant audits are crucial.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Identifying Seal Breakdown</h4>
        <p>Look for micro-fissures, peeling edges, or thinning Dicor sealant beads around rooftop A/C units, plumbing stink pipes, solar bracket feet, and front fiberglass caps.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Proper Sealant Application</h4>
        <p>Never apply silicone over Dicor or TPO roofing. Thoroughly clean the surface with non-petroleum cleaner before applying self-leveling lap sealant to create a permanent waterproof barrier.</p>
      `
    },
    'article-walkaround': {
      title: 'THE PRE-TRIP WALKAROUND',
      tag: 'TRAVEL PREPARATION • SYSTEM CHECKLIST',
      content: `
        <p>A systematic walkaround sequence transforms departure routines into a calm, repeatable checklist that leaves nothing to chance.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Top to Bottom Exterior Sweep</h4>
        <p>Check patio awnings for secure locking, inspect rooftop vent lids, ensure storage bay latches are fully clicked, and verify shore cords, water hoses, and sewer connections are stored.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">Tow Connection &amp; Lighting Verification</h4>
        <p>Confirm 7-pin electrical plug connectivity, test brake lamps and turn indicators, verify hitch locking pins and emergency breakaway cable attachments.</p>
      `
    },
    'article-maintenance': {
      title: 'CHASSIS & POWERTRAIN ROUTINE PROTOCOLS',
      tag: 'CHASSIS MAINTENANCE • ROADREADY TECHNICAL NOTE',
      content: `
        <p>Heavy motorcoach chassis endure substantial vibration, thermal cycling, and weight shifts across thousands of highway miles. Regular chassis maintenance preserves running gear longevity and ride stability.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">1. Fluid &amp; Filter Analysis</h4>
        <p>Analyze transmission fluid clarity, differential gear oil viscosity, and engine coolant SCA chemistry to prevent catastrophic overheating under uphill load.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">2. Generator Exercise &amp; Spark Assessment</h4>
        <p>Onan and Cummins commercial diesel/gas generators require monthly loaded runs to evaporate moisture from windings and clear carburetor varnish.</p>
      `
    },
    'article-hvac': {
      title: 'BALANCING CABIN CLIMATE & FURNACE EFFICIENCY',
      tag: 'HVAC & APPLIANCES • HABITATION PROTOCOL',
      content: `
        <p>Rooftop heat pumps, direct-expansion air conditioners, and LP furnaces must maintain proper airflow and thermostat calibration to preserve interior comfort in extreme weather.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">1. Condenser Coil &amp; Fin Cleaning</h4>
        <p>Road grime and cottonwood seeds accumulate rapidly in rooftop condenser coils, degrading thermal heat rejection by up to 35% and causing high-pressure compressor cutouts.</p>
        <h4 style="margin-top: 1.25rem; font-size: 1rem; color: var(--color-text-main);">2. Sail Switch &amp; Furnace Burner Inspection</h4>
        <p>Inspect the furnace blower airflow sail switch and burner ignition tube for soot accumulation, ensuring immediate, reliable heating during cold nights.</p>
      `
    }
  };

  if (articleTriggers.length > 0 && articleModal) {
    articleTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = trigger.getAttribute('data-article-id');
        const articleData = articleDetailsData[articleId];

        if (articleData && articleModalTitle && articleModalTag && articleModalBody) {
          articleModalTitle.textContent = articleData.title;
          articleModalTag.textContent = articleData.tag;
          articleModalBody.innerHTML = articleData.content;
          openModal('article-reader-modal');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 15. Toast Notification Utility
  // -------------------------------------------------------------------------
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showToast(message, duration = 3000) {
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

  // Global helper API
  window.RoadReady = {
    showToast,
    openModal,
    closeModal
  };
});
