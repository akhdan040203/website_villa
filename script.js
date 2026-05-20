/* ===== Villa Gunung — Interactive JS + GSAP ===== */
document.addEventListener('DOMContentLoaded', () => {
  const videoSources = {
    about: new URL('./assets/video/video2.mp4', import.meta.url).href,
  };

  // ===== LOADER =====
  const loader = document.createElement('div');
  loader.className = 'loading-screen';
  loader.innerHTML = '<div class="loader-ring"></div>';
  document.body.prepend(loader);

  let loaderDone = false;
  function finishLoading() {
    if (loaderDone) return;
    loaderDone = true;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
    initAnimations();
  }

  const heroVideoForLoader = document.querySelector('#hero video');
  if (heroVideoForLoader && heroVideoForLoader.readyState < 2) {
    heroVideoForLoader.addEventListener('loadeddata', () => setTimeout(finishLoading, 250), { once: true });
    heroVideoForLoader.addEventListener('error', finishLoading, { once: true });
    setTimeout(finishLoading, 1600);
  } else {
    setTimeout(finishLoading, 500);
  }

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
  });

  // ===== MOBILE MENU =====
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => { menu.style.opacity='1'; menu.style.pointerEvents='all'; });
    close.addEventListener('click', () => { menu.style.opacity='0'; menu.style.pointerEvents='none'; });
    menu.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => { menu.style.opacity='0'; menu.style.pointerEvents='none'; }));
  }

  // ===== HERO PARALLAX =====
  const heroMedia = document.querySelector('#hero video, #hero img');
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroMedia.style.transform = `scale(1.05) translateY(${window.scrollY * 0.12}px)`;
      }
    });
  }

  document.querySelectorAll('video[autoplay]').forEach(video => {
    video.muted = true;
    video.playsInline = true;
    const playVideo = () => video.play().catch(() => {});
    const lazySource = video.querySelector('source[data-src]') || video.dataset.videoSrc;
    if (lazySource) return;
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
  });

  const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
  const loadLazyVideo = video => {
    const source = video.querySelector('source');
    if (!source) return;
    source.src = source.dataset.src || videoSources[video.dataset.videoSrc];
    if (!source.src) return;
    source.removeAttribute('data-src');
    video.load();
    video.play().catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        loadLazyVideo(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '600px 0px' });
    lazyVideos.forEach(video => videoObserver.observe(video));
  } else {
    lazyVideos.forEach(loadLazyVideo);
  }

  // ===== CENTERING TESTIMONIAL CAROUSEL WITH ZOOM EFFECT & AUTOPLAY =====
  const track = document.getElementById('testimonial-track');
  const prevT = document.getElementById('testi-prev');
  const nextT = document.getElementById('testi-next');
  const pagination = document.getElementById('testi-pagination');

  if (track && prevT && nextT && pagination) {
    const container = track.parentElement;
    const cards = Array.from(track.children);
    let activeIdx = Math.floor(cards.length / 2); // Start at the middle card (index 4)
    let autoplayTimer = null;

    function updateSlider() {
      if (!container || cards.length === 0) return;
      
      const containerWidth = container.offsetWidth;
      const activeCard = cards[activeIdx];
      
      // Math centering: translate = (containerCenter) - (cardCenterRelativeToTrack)
      const activeCardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
      const translateValue = (containerWidth / 2) - activeCardCenter;

      track.style.transform = `translateX(${translateValue}px)`;

      // Apply zoom & opacity styles to cards
      cards.forEach((card, i) => {
        const innerCard = card.querySelector('.testi-inner-card');
        if (i === activeIdx) {
          // Centered & Active (Zoomed-In)
          card.classList.remove('opacity-40', 'scale-90', 'grayscale');
          card.classList.add('opacity-100', 'scale-100', 'md:scale-105');
          if (innerCard) {
            innerCard.classList.add('shadow-lg', 'border-[#906b3e]/30');
            innerCard.classList.remove('shadow-sm');
          }
        } else {
          // Off-center & Inactive (Faded & Scaled down)
          card.classList.remove('opacity-100', 'scale-100', 'md:scale-105');
          card.classList.add('opacity-40', 'scale-90', 'grayscale');
          if (innerCard) {
            innerCard.classList.remove('shadow-lg', 'border-[#906b3e]/30');
            innerCard.classList.add('shadow-sm');
          }
        }
      });

      // Update Pagination Dots
      const dots = pagination.children;
      Array.from(dots).forEach((dot, i) => {
        if (i === activeIdx) {
          dot.className = 'w-6 h-2 rounded-full bg-[#906b3e] transition-all duration-300';
        } else {
          dot.className = 'w-2 h-2 rounded-full bg-[#261607]/20 transition-all duration-300 hover:bg-[#261607]/40';
        }
      });
    }

    // Generate Pagination Dots
    pagination.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'w-2 h-2 rounded-full bg-[#261607]/20 transition-all duration-300 hover:bg-[#261607]/40';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        activeIdx = i;
        updateSlider();
        resetAutoplay();
      });
      pagination.appendChild(dot);
    });

    // Next/Prev Buttons
    nextT.addEventListener('click', () => {
      activeIdx = (activeIdx + 1) % cards.length;
      updateSlider();
      resetAutoplay();
    });

    prevT.addEventListener('click', () => {
      activeIdx = (activeIdx - 1 + cards.length) % cards.length;
      updateSlider();
      resetAutoplay();
    });

    // Click on individual card to center & select it
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (activeIdx !== i) {
          activeIdx = i;
          updateSlider();
          resetAutoplay();
        }
      });
    });

    // Autoplay Loop
    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        activeIdx = (activeIdx + 1) % cards.length;
        updateSlider();
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    // Resize Event
    window.addEventListener('resize', updateSlider);
    
    // Initial execution with small timeout to allow layout offsets to compute
    setTimeout(updateSlider, 100);
    startAutoplay();
  }

  // ===== WHY BOOK WITH US INTERACTIVE =====
  const tabs = document.querySelectorAll('.why-tab');
  const panels = document.querySelectorAll('.why-panel');
  const desc = document.getElementById('why-desc');
  const whyHeadline = document.getElementById('why-headline');
  
  const descriptions = [
    "Rancang liburan Lembang impian Anda. Pesan langsung bersama kami untuk mendapatkan harga terbaik, keuntungan eksklusif, dan rencana perjalanan kustom. Nikmati aktivitas pilihan mulai dari tur off-road hingga makan malam privat.",
    "Mulailah liburan pegunungan Anda dengan relaksasi total. Dilengkapi layanan antar-jemput privat gratis dari stasiun atau bandara Bandung, perjalanan mewah Anda dimulai sejak pertama kali tiba.",
    "Sambut pagi hari yang sejuk dengan sarapan hangat gratis yang lezat, disiapkan khusus sesuai selera Anda: nikmati hidangan tradisional Sunda yang otentik, teh hangat pegunungan, atau menu barat klasik."
  ];

  const whyHeadlines = [
    "Garansi Harga Terbaik",
    "Services 24 Jam",
    "Fasilitas Sarapan Gratis"
  ];

  function setActiveTab(index) {
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
        tab.style.opacity = '1';
        const line = tab.querySelector('.why-tab-line');
        if (line) {
          line.style.opacity = '1';
          line.style.transform = 'scaleX(1)';
        }
      } else {
        tab.classList.remove('active');
        tab.style.opacity = '0.4';
        const line = tab.querySelector('.why-tab-line');
        if (line) {
          line.style.opacity = '0';
          line.style.transform = 'scaleX(0)';
        }
      }
    });

    panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
        panel.classList.remove('grayscale', 'opacity-50');
        panel.style.flex = '4.5';
      } else {
        panel.classList.remove('active');
        panel.classList.add('grayscale', 'opacity-50');
        panel.style.flex = '0.7';
      }
    });

    if (whyHeadline) {
      whyHeadline.style.opacity = '0';
      whyHeadline.style.transform = 'translateY(5px)';
    }

    if (desc) {
      desc.style.opacity = '0';
      desc.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (whyHeadline) {
          whyHeadline.textContent = whyHeadlines[index];
          whyHeadline.style.opacity = '1';
          whyHeadline.style.transform = 'translateY(0)';
        }
        desc.textContent = descriptions[index];
        desc.style.opacity = '1';
        desc.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index);
      setActiveTab(idx);
    });
  });

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      const idx = parseInt(panel.dataset.index);
      setActiveTab(idx);
    });
  });

  // ===== LIGHTBOX =====
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img src="" alt="">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.villa-card img, .gallery-img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.classList.add('active'); document.body.style.overflow = 'hidden';
    });
  });
  lb.addEventListener('click', () => { lb.classList.remove('active'); document.body.style.overflow = ''; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { lb.classList.remove('active'); document.body.style.overflow = ''; } });

  // ===== CURSOR GLOW =====
  if (window.innerWidth > 768) {
    const g = document.createElement('div');
    g.className = 'cursor-glow';
    document.body.appendChild(g);
    document.addEventListener('mousemove', e => { g.style.left = e.clientX+'px'; g.style.top = e.clientY+'px'; });
  }

  // ===== GSAP =====
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const heroTitle = document.querySelector('#hero-title');
    const heroSub = document.querySelector('#hero-sub');
    const heroBtns = document.querySelector('#hero-btns');

    if (heroTitle) tl.from(heroTitle, { y: 60, opacity: 0, duration: 1 });
    if (heroSub) tl.from(heroSub, { y: 30, opacity: 0, duration: 0.8 }, '-=0.6');
    if (heroBtns) tl.from(heroBtns, { y: 20, opacity: 0, duration: 0.7 }, '-=0.4');

    // Reveals
    document.querySelectorAll('.reveal-left').forEach(el => {
      gsap.from(el, { x: -50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
    });
    document.querySelectorAll('.reveal-right').forEach(el => {
      gsap.from(el, { x: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
    });
    document.querySelectorAll('.reveal-up').forEach(el => {
      gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
    });

    // Villa cards
    if (document.querySelector('.villa-card')) {
      gsap.from('.villa-card', { y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.villa-card', start: 'top 85%', toggleActions: 'play none none none' } });
    }

    // Service cards
    if (document.querySelector('.service-card')) {
      gsap.from('.service-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#services', start: 'top 95%', toggleActions: 'play none none none' } });
    }

    // Footer
    if (document.querySelector('footer')) {
      gsap.from('footer > div > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none none' } });
    }
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ===== FORM =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sent Successfully ✓';
      btn.style.background = '#166534';
      setTimeout(() => { btn.textContent = 'SEND ENQUIRY'; btn.style.background = ''; form.reset(); }, 3000);
    });
  }
});
