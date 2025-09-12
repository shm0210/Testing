// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLinks = document.querySelectorAll('#mobileMenu a');

  // Real-time analytics tracking
function initAnalytics() {
  // Generate a unique session ID
  if (!localStorage.getItem('userSessionId')) {
    localStorage.setItem('userSessionId', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  }
  
  const sessionId = localStorage.getItem('userSessionId');
  const pageLoadTime = Date.now();
  
  // Track page view
  trackEvent('page_view', {
    url: window.location.href,
    referrer: document.referrer
  });
  
  // Track engagement time
  let lastActivityTime = Date.now();
  let totalEngagedTime = 0;
  
  const activityInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTime;
    
    if (timeSinceLastActivity < 10000) { // 10 seconds
      totalEngagedTime += 1;
    }
    
    // Send engaged time every 30 seconds
    if (totalEngagedTime % 30 === 0) {
      trackEvent('engagement_time', {
        time: totalEngagedTime,
        url: window.location.href
      });
    }
  }, 1000);
  
  // Track user interactions
  document.addEventListener('click', function(e) {
    lastActivityTime = Date.now();
    
    const target = e.target;
    const text = target.textContent.trim();
    const id = target.id || '';
    const className = target.className || '';
    
    trackEvent('click', {
      text: text.substring(0, 100),
      id: id,
      class: className.substring(0, 200),
      url: window.location.href
    });
  });
  
  // Track form interactions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      trackEvent('form_submit', {
        form_id: form.id || 'unknown',
        form_action: form.action || '',
        url: window.location.href
      });
    });
  });
  
  // Track scroll depth
  let maxScrollDepth = 0;
  window.addEventListener('scroll', function() {
    lastActivityTime = Date.now();
    
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      trackEvent('scroll_depth', {
        depth: maxScrollDepth,
        url: window.location.href
      });
    }
  });
  
  // Track when user leaves the page
  window.addEventListener('beforeunload', function() {
    const sessionDuration = Date.now() - pageLoadTime;
    
    trackEvent('session_end', {
      duration: sessionDuration,
      engaged_time: totalEngagedTime,
      max_scroll: maxScrollDepth,
      url: window.location.href
    });
    
    clearInterval(activityInterval);
  });
}

// Function to send tracking data
function trackEvent(type, data) {
  const eventData = {
    type: type,
    data: data,
    timestamp: Date.now(),
    session_id: localStorage.getItem('userSessionId'),
    url: window.location.href
  };
  
  // In a real implementation, you would send this to your analytics server
  console.log('Tracking event:', eventData);
  
  // For demo purposes, we'll store events in localStorage
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push(eventData);
  localStorage.setItem('analytics_events', JSON.stringify(events));
}

// Initialize analytics when the page loads
if (typeof localStorage !== 'undefined') {
  initAnalytics();
}
  
  // Open menu function
  function openMenu() {
    document.body.classList.add('no-scroll');
    menuOverlay.classList.remove('invisible');
    menuOverlay.classList.add('visible', 'opacity-100');
    mobileMenu.classList.remove('translate-x-full');
  }
  
  // Close menu function
  function closeMenu() {
    document.body.classList.remove('no-scroll');
    menuOverlay.classList.remove('visible', 'opacity-100');
    menuOverlay.classList.add('invisible');
    mobileMenu.classList.add('translate-x-full');
  }
  
  // Event listeners
  menuBtn.addEventListener('click', openMenu);
  closeMenuBtn.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking links
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
  
  // Handle resize events - close menu on large screens
  function handleResize() {
    if (window.innerWidth >= 768 && !mobileMenu.classList.contains('translate-x-full')) {
      closeMenu();
    }
  }
  
  // Throttled resize handler
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });

  // Prevent selecting old dates
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }
  
  // Form submission handling
  const bookingForm = document.getElementById('bookingForm');
  const formMsg = document.getElementById('formMsg');
  const formError = document.getElementById('formError');
  
  // Function to show thank you message
  function showThankYou() {
    document.getElementById('thankyou').classList.remove('hidden');
  }
  
  // Function to close thank you message
window.closeThankYou = function() {
  document.getElementById('thankyou').classList.add('hidden');
};
  
  // Handle URL hash (for formsubmit.co redirect)
  if (window.location.hash === '#thankyou') {
    showThankYou();
    // Remove the hash from URL without refreshing
    history.replaceState(null, null, ' ');
  }
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Basic validation
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;
      
      if (!name || !phone || !service || !message) {
        formError.textContent = 'Please fill all required fields';
        formError.classList.remove('hidden');
        formMsg.classList.add('hidden');
        return;
      }
      
      try {
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Use FormSubmit.co to send the form
        const formData = new FormData(bookingForm);
        
        const response = await fetch(bookingForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          formMsg.classList.remove('hidden');
          formError.classList.add('hidden');
          bookingForm.reset();
          
          // Also show the thank you modal
          showThankYou();
        } else {
          throw new Error('Form submission failed');
        }
        
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
      } catch (error) {
        console.error('Form submission error:', error);
        formError.textContent = 'There was an error submitting the form. Please try again or DM me on Instagram.';
        formError.classList.remove('hidden');
        formMsg.classList.add('hidden');
        
        // Restore button state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Booking Request';
        submitBtn.disabled = false;
      }
    });
  }

  // Portfolio filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-amber-500', 'text-white');
        btn.classList.add('bg-amber-100', 'text-amber-700', 'hover:bg-amber-500');
      });
      
      // Add active class to clicked button
      button.classList.add('bg-amber-500', 'text-white');
      button.classList.remove('bg-amber-100', 'text-amber-700', 'hover:bg-amber-500');
      
      const filterValue = button.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
