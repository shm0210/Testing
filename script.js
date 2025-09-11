<script>
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('menu-closed');
      mobileMenu.classList.toggle('menu-open');
    });
    
    // Close menu when clicking links
    document.querySelectorAll('#mobileMenu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('menu-closed');
        mobileMenu.classList.remove('menu-open');
      });
    });

    // Prevent selecting old dates
    document.addEventListener("DOMContentLoaded", function() {
      const dateInput = document.getElementById("date");
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    });
    
    // Form submission handling
    const bookingForm = document.getElementById('bookingForm');
    const formMsg = document.getElementById('formMsg');
    const formError = document.getElementById('formError');
    
    // Function to show thank you message
    function showThankYou() {
      document.getElementById('thankyou').classList.remove('hidden');
    }
    
    // Function to close thank you message
    function closeThankYou() {
      document.getElementById('thankyou').classList.add('hidden');
    }
    
    // Handle URL hash (for formsubmit.co redirect)
    if (window.location.hash === '#thankyou') {
      showThankYou();
      // Remove the hash from URL without refreshing
      history.replaceState(null, null, ' ');
    }
    
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

     // Portfolio filtering functionality
  document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active', 'bg-amber-500', 'text-white'));
        
        // Add active class to clicked button
        button.classList.add('active', 'bg-amber-500', 'text-white');
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

    // Optimized mobile menu functionality
  document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('#mobileMenu a');
    
    // Open menu function
    function openMenu() {
      // Prevent animation frame conflicts
      requestAnimationFrame(() => {
        document.body.classList.add('no-scroll');
        menuOverlay.classList.add('active');
        mobileMenu.classList.add('menu-open');
        mobileMenu.classList.remove('translate-x-full');
      });
    }
    
    // Close menu function
    function closeMenu() {
      // Prevent animation frame conflicts
      requestAnimationFrame(() => {
        document.body.classList.remove('no-scroll');
        menuOverlay.classList.remove('active');
        mobileMenu.classList.remove('menu-open');
        mobileMenu.classList.add('translate-x-full');
      });
    }
    
    // Event listeners with passive option for better performance
    menuBtn.addEventListener('click', openMenu, { passive: true });
    closeMenuBtn.addEventListener('click', closeMenu, { passive: true });
    menuOverlay.addEventListener('click', closeMenu, { passive: true });
    
    // Close menu when clicking links
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu, { passive: true });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('menu-open')) {
        closeMenu();
      }
    }, { passive: true });
    
    // Handle resize events - close menu on large screens
    function handleResize() {
      if (window.innerWidth >= 768 && mobileMenu.classList.contains('menu-open')) {
        closeMenu();
      }
    }
    
    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    }, { passive: true });
  });
  </script>