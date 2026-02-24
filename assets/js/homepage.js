/* ============================================
   VELARQUE — Homepage JS
   ============================================ */

(function () {
  'use strict';

  // --- STATS COUNTER ANIMATION ---
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const counters = statsSection.querySelectorAll('[data-count]');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(counter => {
            const target = counter.dataset.count;
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const isFloat = target.includes('.');
            const targetNum = parseFloat(target);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = isFloat
                ? (targetNum * eased).toFixed(1)
                : Math.floor(targetNum * eased);
              counter.textContent = prefix + current + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- TESTIMONIAL SLIDER ---
  const testimonialSlider = document.querySelector('.testimonials__slider');
  if (testimonialSlider) {
    const track = testimonialSlider.querySelector('.testimonials__track');
    const slides = testimonialSlider.querySelectorAll('.testimonials__slide');
    const dots = testimonialSlider.querySelectorAll('.testimonials__dot');
    let current = 0;
    let autoTimer;

    function goToSlide(index) {
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAuto();
      });
    });

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, 6000);
    }

    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    testimonialSlider.addEventListener('mouseleave', resetAuto);

    resetAuto();
  }

  // --- HORIZONTAL DRAG SLIDER (Work/Cases) ---
  const slider = document.getElementById('workSlider');
  if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.2;
      slider.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });

    slider.style.overflowX = 'auto';
    slider.style.scrollbarWidth = 'none';
    slider.style.msOverflowStyle = 'none';
  }

})();
