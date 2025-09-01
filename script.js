// JavaScript for Suku Mehndi Art Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('menu-closed');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu && !mobileMenu.classList.contains('menu-closed') && 
        !mobileMenu.contains(event.target) && 
        event.target !== menuBtn && 
        !menuBtn.contains(event.target)) {
      mobileMenu.classList.add('menu-closed');
    }
  });
  
  // Set minimum date for appointment form to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const todayStr = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', todayStr);
  }
  
  // Form submission handling
  const bookingForm = document.getElementById('bookingForm');
  const formMsg = document.getElementById('formMsg');
  const formError = document.getElementById('formError');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;
      
      if (!name || !phone || !service || !message) {
        showError('Please fill all required fields');
        return;
      }
      
      // If using FormSubmit, let it handle the submission
      // This is just for demonstration
      this.submit();
      
      // For demo purposes, show success message
      // In a real implementation, you would handle the form submission response
      showSuccess('Thanks — your message was sent. I\'ll contact you soon!');
      
      // Reset form after submission
      this.reset();
    });
  }
  
  // Helper functions for form messages
  function showSuccess(message) {
    if (formMsg) {
      formMsg.textContent = message;
      formMsg.classList.remove('hidden');
      if (formError) formError.classList.add('hidden');
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMsg.classList.add('hidden');
      }, 5000);
    }
  }
  
  function showError(message) {
    if (formError) {
      formError.textContent = message;
      formError.classList.remove('hidden');
      if (formMsg) formMsg.classList.add('hidden');
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formError.classList.add('hidden');
      }, 5000);
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('menu-closed')) {
          mobileMenu.classList.add('menu-closed');
        }
        
        // Scroll to element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});