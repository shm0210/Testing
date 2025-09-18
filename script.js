// script.js - Enhanced version (extracted from inline script)
document.addEventListener('DOMContentLoaded', function() {
  // Performance optimization - disable animations on low-end devices
  const isLowEndDevice = () => {
    return window.matchMedia('(max-width: 640px)').matches || 
           (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
           (navigator.deviceMemory && navigator.deviceMemory < 4);
  };

  // Initialize AOS with error handling
  const initAOS = () => {
    try {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          once: true,
          offset: 100,
          easing: 'ease-in-out-quart',
          disable: isLowEndDevice() // Disable on low-end devices
        });
      }
    } catch (e) {
      console.error("AOS initialization failed:", e);
    }
  };

  // Mobile Menu Functionality
  const setupMobileMenu = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const menuIcon = document.getElementById('menu-icon');
    const menuNotification = document.getElementById('menu-notification');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    // Check for notifications (simulated)
    const hasNotifications = true;
    if (hasNotifications && menuNotification) {
      menuNotification.classList.remove('hidden');
    }
    
    // Toggle mobile menu with animation
    const toggleMobileMenu = () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      
      if (isOpen) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.classList.remove('opacity-0');
          mobileMenu.classList.remove('-translate-y-5');
        }, 10);
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
      } else {
        mobileMenu.classList.add('opacity-0');
        mobileMenu.classList.add('-translate-y-5');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
      
      document.body.classList.toggle('overflow-hidden', isOpen);
      if (menuIcon) menuIcon.classList.toggle('rotate-90');
    };
    
    // Event listeners for mobile menu
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          if (!link.querySelector('input')) {
            toggleMobileMenu();
          }
        });
      });
    }
  };

  // Search Functionality
  const setupSearch = () => {
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const mobileSearch = document.getElementById('mobile-search');
    const mobileSearchClose = document.getElementById('mobile-search-close');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchResults = document.getElementById('search-results');
    const mobileSearchResults = document.getElementById('mobile-search-results');
    
    // Toggle mobile search
    if (mobileSearchButton && mobileSearch) {
      mobileSearchButton.addEventListener('click', () => {
        mobileSearch.classList.toggle('hidden');
        if (!mobileSearch.classList.contains('hidden') && mobileSearchInput) {
          mobileSearchInput.focus();
          mobileSearch.setAttribute('aria-hidden', 'false');
        } else {
          mobileSearch.setAttribute('aria-hidden', 'true');
        }
      });
    }
    
    if (mobileSearchClose) {
      mobileSearchClose.addEventListener('click', () => {
        if (mobileSearch) {
          mobileSearch.classList.add('hidden');
          mobileSearch.setAttribute('aria-hidden', 'true');
        }
      });
    }
    
    // Get real app data from the DOM
    const getAppData = () => {
      const apps = [];
      document.querySelectorAll('.app-card').forEach(card => {
        const linkElement = card.querySelector('a');
        apps.push({
          name: card.dataset.appName || 'Unknown App',
          category: card.dataset.appCategory || 'Other',
          link: linkElement?.href || '#',
          description: card.querySelector('p')?.textContent || ''
        });
      });
      return apps;
    };

    // Debounce function for search input
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    };

    // Handle search input with debounce
    const handleSearch = (inputElement, resultsElement) => {
      if (!inputElement || !resultsElement) return;
      
      const allApps = getAppData();
      let debouncedSearch;
      
      const performSearch = (query) => {
        if (query.length > 0) {
          const filteredApps = allApps.filter(app => 
            app.name.toLowerCase().includes(query.toLowerCase()) || 
            app.category.toLowerCase().includes(query.toLowerCase()) ||
            app.description.toLowerCase().includes(query.toLowerCase())
          );
          
          // Display results
          if (filteredApps.length > 0) {
            resultsElement.innerHTML = filteredApps.map(app => `
              <a href="${app.link}" class="block px-4 py-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-0">
                <div class="font-medium">${app.name}</div>
                <div class="text-xs text-gray-400">${app.category}</div>
                <div class="text-xs text-gray-500 truncate">${app.description}</div>
              </a>
            `).join('');
            resultsElement.classList.remove('hidden');
          } else {
            resultsElement.innerHTML = `
              <div class="px-4 py-3 text-gray-400">
                <div class="text-center mb-2">No results found for "${query}"</div>
                <a href="#apps" class="block text-center text-primary-400 hover:text-primary-300">
                  Browse all apps
                </a>
              </div>
            `;
            resultsElement.classList.remove('hidden');
          }
        } else {
          resultsElement.classList.add('hidden');
        }
      };
      
      debouncedSearch = debounce((e) => {
        performSearch(e.target.value.trim());
      }, 300);
      
      inputElement.addEventListener('input', debouncedSearch);
      
      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (!inputElement.contains(e.target) && !resultsElement.contains(e.target)) {
          resultsElement.classList.add('hidden');
        }
      });
    };
    
    handleSearch(searchInput, searchResults);
    handleSearch(mobileSearchInput, mobileSearchResults);
  };

  // User Dropdown
  const setupUserDropdown = () => {
    const userDropdownButton = document.getElementById('user-dropdown-button');
    const userDropdown = document.getElementById('user-dropdown');
    const dropdownArrow = document.getElementById('dropdown-arrow');
    
    if (userDropdownButton && userDropdown) {
      userDropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = userDropdown.classList.contains('hidden');
        userDropdown.classList.toggle('hidden');
        userDropdown.classList.toggle('scale-95');
        userDropdown.classList.toggle('opacity-0');
        userDropdownButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        
        if (dropdownArrow) {
          dropdownArrow.classList.toggle('rotate-180');
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        if (!userDropdown.classList.contains('hidden')) {
          userDropdown.classList.add('hidden');
          userDropdown.classList.add('scale-95');
          userDropdown.classList.add('opacity-0');
          userDropdownButton.setAttribute('aria-expanded', 'false');
          
          if (dropdownArrow) {
            dropdownArrow.classList.remove('rotate-180');
          }
        }
      });
    }
  };

  // Theme Toggle Functionality
  const setupThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const html = document.documentElement;
    
    // Check for saved user preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    const applyTheme = (theme) => {
      if (theme === 'light') {
        html.classList.remove('dark');
        if (themeIcon) {
          themeIcon.setAttribute('d', 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z');
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8fafc');
        if (mobileThemeToggle) mobileThemeToggle.checked = false;
      } else {
        html.classList.add('dark');
        if (themeIcon) {
          themeIcon.setAttribute('d', 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z');
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0f172a');
        if (mobileThemeToggle) mobileThemeToggle.checked = true;
      }
    };

    applyTheme(savedTheme);

    // Toggle theme
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeToggle.classList.add('animate-spin');
        setTimeout(() => {
          themeToggle.classList.remove('animate-spin');
        }, 500);
        
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark ? 'dark' : 'light');
      });
    }

    // Mobile theme toggle
    if (mobileThemeToggle) {
      mobileThemeToggle.checked = localStorage.getItem('theme') === 'dark';
      
      mobileThemeToggle.addEventListener('change', () => {
        const isDark = mobileThemeToggle.checked;
        html.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark ? 'dark' : 'light');
      });
    }
  };

  // Smooth scrolling (if you had it defined)
  const setupSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        // allow links with data attribute to skip smooth scroll
        if (this.getAttribute('data-no-smooth') === 'true') return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  // Image loading states
  const setupImageLoading = () => {
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        img.classList.add('opacity-0');
        img.style.transition = 'opacity 0.3s ease';
      }
      
      img.addEventListener('load', () => {
        img.classList.remove('opacity-0');
      });
      
      img.addEventListener('error', () => {
        img.classList.remove('opacity-0');
        img.classList.add('img-error');
        img.alt = img.alt || 'Failed to load image';
      });
    });
  };

  // Back to top button
  const setupBackToTop = () => {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.remove('opacity-0', 'invisible');
          backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          backToTopButton.classList.remove('opacity-100', 'visible');
          backToTopButton.classList.add('opacity-0', 'invisible');
        }
      });
      
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // Enhanced Category filtering
  const setupCategoryFiltering = () => {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const appCards = document.querySelectorAll('.app-card');
    const appCountElement = document.getElementById('app-count');
    
    // Set "All Apps" as active by default
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) allButton.classList.add('active-filter');
    
    // Update app count
    const updateAppCount = (count) => {
      if (appCountElement) {
        appCountElement.textContent = count;
      }
    };
    
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.getAttribute('data-category');
        
        // Update active state
        categoryFilters.forEach(f => f.classList.remove('active-filter'));
        filter.classList.add('active-filter');
        
        let visibleCount = 0;
        
        // Filter apps with animation
        appCards.forEach(card => {
          const cardCategory = card.getAttribute('data-app-category');
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 10);
            visibleCount++;
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
        
        updateAppCount(visibleCount);
      });
    });
    
    // Initialize count
    updateAppCount(appCards.length);
  };

  // Policy popup functionality
  const setupPolicyPopup = () => {
    const policyLinks = document.querySelectorAll('.policy-link');
    const policyPopup = document.getElementById('policy-popup');
    const policyTitle = document.getElementById('policy-title');
    const policyContent = document.getElementById('policy-content');
    const policyClose = document.getElementById('policy-close');
    
    const policies = {
      privacy: {
        title: 'Privacy Policy',
        content: `<p class="mb-4">Your privacy is important to us. This Privacy Policy explains how SHM Infinity collects, uses, and protects your personal information.</p>
        <h4 class="font-semibold mt-4 mb-2">Information We Collect</h4>
        <p class="mb-4">We may collect personal information such as your name, email address, and usage data when you interact with our services.</p>
        <h4 class="font-semibold mt-4 mb-2">How We Use Your Information</h4>
        <p class="mb-4">We use your information to provide and improve our services, communicate with you, and ensure the security of our platform.</p>`
      },
      terms: {
        title: 'Terms of Service',
        content: `<p class="mb-4">By using SHM Infinity services, you agree to the following terms and conditions:</p>
        <h4 class="font-semibold mt-4 mb-2">User Responsibilities</h4>
        <p class="mb-4">You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
        <h4 class="font-semibold mt-4 mb-2">Content Guidelines</h4>
        <p class="mb-4">You agree not to post content that is illegal, offensive, or infringes on the rights of others.</p>`
      },
      cookies: {
        title: 'Cookies Policy',
        content: `<p class="mb-4">We use cookies and similar technologies to enhance your experience on our website.</p>
        <h4 class="font-semibold mt-4 mb-2">What Are Cookies</h4>
        <p class="mb-4">Cookies are small text files stored on your device that help us remember your preferences and improve site functionality.</p>
        <h4 class="font-semibold mt-4 mb-2">Managing Cookies</h4>
        <p class="mb-4">You can control cookies through your browser settings. However, disabling cookies may limit your ability to use some features of our site.</p>`
      },
      license: {
        title: 'License Information',
        content: `<p class="mb-4">All content and applications on SHM Infinity are protected by copyright and other intellectual property laws.</p>
        <h4 class="font-semibold mt-4 mb-2">Usage Rights</h4>
        <p class="mb-4">You are granted a limited, non-exclusive license to use our services for personal, non-commercial purposes.</p>
        <h4 class="font-semibold mt-4 mb-2">Restrictions</h4>
        <p class="mb-4">You may not redistribute, modify, or commercially exploit any content from SHM Infinity without explicit permission.</p>`
      }
    };
    
    // Open policy popup
    policyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const policyType = link.getAttribute('data-policy');
        
        if (policies[policyType]) {
          policyTitle.textContent = policies[policyType].title;
          policyContent.innerHTML = policies[policyType].content;
          policyPopup.classList.remove('hidden');
          document.body.classList.add('overflow-hidden');
        }
      });
    });
    
    // Close policy popup
    if (policyClose) {
      policyClose.addEventListener('click', () => {
        policyPopup.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    }
    
    // Close popup when clicking outside
    if (policyPopup) {
      policyPopup.addEventListener('click', (e) => {
        if (e.target === policyPopup) {
          policyPopup.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      });
    }
  };

  // Initialize all functionality
  const init = () => {
    initAOS();
    setupMobileMenu();
    setupSearch();
    setupUserDropdown();
    setupThemeToggle();
    setupSmoothScrolling();
    setupImageLoading();
    setupBackToTop();
    setupCategoryFiltering();
    setupPolicyPopup();
  };

  init();
});
