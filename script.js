// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'light') {
    enableLightMode();
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    if (htmlElement.classList.contains('dark')) {
      enableLightMode();
    } else {
      enableDarkMode();
    }
  }

  function enableDarkMode() {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeIcon.setAttribute('d', 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z');
    if (mobileThemeToggle) mobileThemeToggle.checked = false;
  }

  function enableLightMode() {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeIcon.setAttribute('d', 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z');
    if (mobileThemeToggle) mobileThemeToggle.checked = true;
  }

  // Mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const menuIcon = document.getElementById('menu-icon');

  mobileMenuButton.addEventListener('click', function() {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.remove('transform', '-translate-y-5', 'opacity-0');
    mobileMenu.classList.add('transform', 'translate-y-0', 'opacity-100');
    menuIcon.style.transform = 'rotate(90deg)';
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('transform', 'translate-y-0', 'opacity-100');
    mobileMenu.classList.add('transform', '-translate-y-5', 'opacity-0');
    menuIcon.style.transform = 'rotate(0deg)';
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // User dropdown functionality
  const userDropdownButton = document.getElementById('user-dropdown-button');
  const userDropdown = document.getElementById('user-dropdown');
  const dropdownArrow = document.getElementById('dropdown-arrow');

  userDropdownButton.addEventListener('click', function() {
    const isExpanded = userDropdownButton.getAttribute('aria-expanded') === 'true';
    userDropdownButton.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      userDropdown.classList.add('hidden', 'opacity-0', 'scale-95');
      userDropdown.classList.remove('opacity-100', 'scale-100');
      dropdownArrow.style.transform = 'rotate(0deg)';
    } else {
      userDropdown.classList.remove('hidden', 'opacity-0', 'scale-95');
      userDropdown.classList.add('opacity-100', 'scale-100');
      dropdownArrow.style.transform = 'rotate(180deg)';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = userDropdownButton.contains(event.target) || userDropdown.contains(event.target);
    if (!isClickInside && userDropdownButton.getAttribute('aria-expanded') === 'true') {
      userDropdownButton.setAttribute('aria-expanded', 'false');
      userDropdown.classList.add('hidden', 'opacity-0', 'scale-95');
      userDropdown.classList.remove('opacity-100', 'scale-100');
      dropdownArrow.style.transform = 'rotate(0deg)';
    }
  });

  // Mobile search functionality
  const mobileSearchButton = document.getElementById('mobile-search-button');
  const mobileSearch = document.getElementById('mobile-search');
  const mobileSearchClose = document.getElementById('mobile-search-close');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const searchInput = document.getElementById('search-input');

  mobileSearchButton.addEventListener('click', function() {
    mobileSearch.classList.remove('hidden');
    setTimeout(() => {
      mobileSearchInput.focus();
    }, 100);
  });

  mobileSearchClose.addEventListener('click', function() {
    mobileSearch.classList.add('hidden');
  });

  // Search functionality
  const searchInputs = [searchInput, mobileSearchInput];
  const searchResults = document.getElementById('search-results');
  const mobileSearchResults = document.getElementById('mobile-search-results');
  
  const apps = [
    { name: 'YouTube Player', category: 'video', description: 'Watch YouTube videos ad-free' },
    { name: 'Geetory', category: 'music', description: 'Listen to your favorite music' },
    { name: 'Game Hub', category: 'gaming', description: 'Play your favorite games' },
    { name: 'Image Editor', category: 'photo', description: 'Edit your images with our tools' },
    { name: 'Code Editor', category: 'development', description: 'Write and edit code' },
    { name: 'Finance Tracker', category: 'finance', description: 'Track your finances' }
  ];

  searchInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const isMobile = this.id === 'mobile-search-input';
        const resultsContainer = isMobile ? mobileSearchResults : searchResults;
        
        if (searchTerm.length > 1) {
          const filteredApps = apps.filter(app => 
            app.name.toLowerCase().includes(searchTerm) || 
            app.description.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm)
          );
          
          displaySearchResults(filteredApps, resultsContainer, isMobile);
        } else {
          resultsContainer.classList.add('hidden');
        }
      });
      
      // Close search results when clicking outside
      document.addEventListener('click', function(event) {
        if (!input.contains(event.target) && !resultsContainer.contains(event.target)) {
          resultsContainer.classList.add('hidden');
        }
      });
    }
  });

  function displaySearchResults(results, container, isMobile) {
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = '<div class="p-4 text-center text-gray-400">No results found</div>';
      container.classList.remove('hidden');
      return;
    }
    
    results.forEach(app => {
      const resultItem = document.createElement('a');
      resultItem.href = '#';
      resultItem.className = 'block p-3 hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700 last:border-b-0';
      resultItem.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
            <i class="fas fa-${getAppIcon(app.category)} text-white text-xs"></i>
          </div>
          <div>
            <p class="font-medium">${app.name}</p>
            <p class="text-xs text-gray-400">${app.category} • ${app.description}</p>
          </div>
        </div>
      `;
      
      resultItem.addEventListener('click', function(e) {
        e.preventDefault();
        // Scroll to the app card
        const appCard = document.querySelector(`[data-app-name="${app.name}"]`);
        if (appCard) {
          appCard.scrollIntoView({ behavior: 'smooth' });
          // Add highlight effect
          appCard.classList.add('ring-2', 'ring-primary-500');
          setTimeout(() => {
            appCard.classList.remove('ring-2', 'ring-primary-500');
          }, 2000);
        }
        
        // Close search and clear input
        container.classList.add('hidden');
        searchInput.value = '';
        mobileSearchInput.value = '';
        if (isMobile) {
          mobileSearch.classList.add('hidden');
        }
      });
      
      container.appendChild(resultItem);
    });
    
    container.classList.remove('hidden');
  }

  function getAppIcon(category) {
    const icons = {
      video: 'video',
      music: 'music',
      gaming: 'gamepad',
      photo: 'image',
      development: 'code',
      finance: 'chart-line'
    };
    return icons[category] || 'cube';
  }

  // Category filtering
  const categoryFilters = document.querySelectorAll('.category-filter');
  const appCards = document.querySelectorAll('.app-card');

  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active state
      categoryFilters.forEach(btn => btn.classList.remove('bg-primary-500', 'text-white'));
      this.classList.add('bg-primary-500', 'text-white');
      
      // Filter cards
      appCards.forEach(card => {
        const cardCategory = card.getAttribute('data-app-category');
        if (category === 'all' || category === cardCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Scroll to top functionality
  const scrollToTopButton = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopButton.classList.remove('opacity-0', 'invisible');
      scrollToTopButton.classList.add('opacity-100', 'visible');
    } else {
      scrollToTopButton.classList.remove('opacity-100', 'visible');
      scrollToTopButton.classList.add('opacity-0', 'invisible');
    }
  });

  scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Form submission
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // In a real application, you would send this data to a server
      console.log('Form submitted:', formData);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }

  // Loading animation
  const loadingElement = document.getElementById('loading');

  window.addEventListener('load', function() {
    setTimeout(() => {
      loadingElement.style.opacity = '0';
      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 500);
    }, 1500);
  });

  // Lazy loading for images
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    // You could implement a lazy loading library here if needed
  }

  // Performance optimization: Preload critical resources
  function preloadCriticalResources() {
    const resources = [
      'https://cdn.tailwindcss.com',
      'https://unpkg.com/aos@2.3.4/dist/aos.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  preloadCriticalResources();

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    // Close dropdowns and modals with Escape key
    if (e.key === 'Escape') {
      if (userDropdownButton.getAttribute('aria-expanded') === 'true') {
        userDropdownButton.click();
      }
      
      if (!mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
      
      if (!mobileSearch.classList.contains('hidden')) {
        mobileSearch.classList.add('hidden');
      }
      
      searchResults.classList.add('hidden');
      mobileSearchResults.classList.add('hidden');
    }
  });

  // Focus trap for mobile menu
  function initFocusTrap() {
    const focusableElements = mobileMenu.querySelectorAll('a, button, input, textarea, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    mobileMenu.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  if (mobileMenu) {
    initFocusTrap();
  }
});