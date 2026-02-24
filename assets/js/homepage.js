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

  // --- SELECT has-value class ---
  document.querySelectorAll('.contact-form__group select').forEach(sel => {
    sel.addEventListener('change', () => {
      sel.classList.toggle('has-value', sel.value !== '');
    });
  });

  // --- CONTACT FORM (Formspree) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('span');
      const originalText = btnText.textContent;

      // Validate required fields
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      if (!valid) return;

      // Loading state
      btnText.textContent = 'Enviando...';
      btn.disabled = true;

      try {
        const data = new FormData(contactForm);
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          btnText.textContent = 'Mensaje enviado';
          contactForm.reset();
          setTimeout(() => {
            btnText.textContent = originalText;
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Error en el envío');
        }
      } catch (err) {
        btnText.textContent = 'Error, inténtalo de nuevo';
        btn.disabled = false;
        setTimeout(() => { btnText.textContent = originalText; }, 3000);
      }
    });
  }

})();
