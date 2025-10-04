// Basic interactivity for the BGMI-like demo

document.addEventListener('DOMContentLoaded', function(){

  // mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');

  if(menuBtn){
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });
  }
  if(menuClose){
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }

  // VIEW MORE for news
  const loadMore = document.getElementById('loadMoreNews');
  if(loadMore){
    loadMore.addEventListener('click', function(){
      // reveal hidden items (very small demo)
      const hidden = document.querySelectorAll('.news-card.hidden');
      hidden.forEach(h => h.classList.remove('hidden'));
      // change button into link to /news
      loadMore.textContent = "NEWS";
      loadMore.classList.add('disabled');
      loadMore.disabled = true;
      setTimeout(()=> {
        loadMore.classList.remove('disabled');
        loadMore.disabled = false;
      }, 800);
    });
  }

  // cookie bar
  const cookieClose = document.getElementById('cookieClose');
  const cookieBar = document.getElementById('cookieBar');
  if(localStorage.getItem('bgmi_cookie_accepted') === '1'){
    cookieBar.style.display = 'none';
  }
  if(cookieClose){
    cookieClose.addEventListener('click', function(){
      localStorage.setItem('bgmi_cookie_accepted','1');
      cookieBar.style.display = 'none';
    });
  }

  // Video popup logic
  const videoPopup = document.getElementById('videoPopup');
  const videoContainer = document.getElementById('videoContainer');
  const closeVideo = document.getElementById('closeVideo');

  document.querySelectorAll('.video-trigger').forEach(el => {
    el.addEventListener('click', function(e){
      e.preventDefault();
      const youtube = el.getAttribute('data-youtube');
      if(!youtube) return;
      videoContainer.innerHTML = '<iframe src="'+youtube+'?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      videoPopup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  if(closeVideo){
    closeVideo.addEventListener('click', function(){
      videoPopup.style.display = 'none';
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    });
  }
  // clicking outside video closes
  videoPopup.addEventListener('click', function(ev){
    if(ev.target === videoPopup){
      videoPopup.style.display = 'none';
      videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

  // initialize Swiper slider if present
  if(window.Swiper){
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1.6,
      spaceBetween: 12,
      centeredSlides: true,
      loop: true,
      breakpoints: {
        640: { slidesPerView: 2.2, spaceBetween: 14 },
        1000: { slidesPerView: 3.6, spaceBetween: 18 }
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    });
  }

});
