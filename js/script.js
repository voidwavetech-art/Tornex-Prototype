document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // 1. Preloader
  // ========================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });
  // Fallback: hide preloader after 3 seconds max
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ========================
  // 2. AOS (Animate on Scroll)
  // ========================
  AOS.init({
    once: true,
    offset: 80,
    duration: 700,
    easing: 'ease-out-cubic',
  });

  // ========================
  // 3. Navbar scroll effect & active link tracking
  // ========================
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
    updateBackToTop();
  });

  // ========================
  // 4. Smooth scroll for nav links
  // ========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 10;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  // ========================
  // 5. Hero Particles
  // ========================
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  // ========================
  // 6. Product Filter
  // ========================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');
  const productsGrid = document.getElementById('products-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.display = '';
          // Re-trigger animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.add('hidden');
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ========================
  // 7. Stats Counter Animation
  // ========================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      countersAnimated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          counter.textContent = current.toLocaleString('en-US');

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  // Check on load too
  animateCounters();

  // ========================
  // 8. Contact Form Validation & Submission
  // ========================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Add validation class
      this.classList.add('was-validated');

      if (!this.checkValidity()) {
        // Find first invalid field and focus it
        const firstInvalid = this.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Show loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      btnText.classList.add('d-none');
      btnLoading.classList.remove('d-none');
      submitBtn.disabled = true;

      // Simulate form submission (replace with real API call)
      setTimeout(() => {
        contactForm.classList.add('d-none');
        formSuccess.classList.remove('d-none');

        // Reset button state
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        submitBtn.disabled = false;
      }, 2000);
    });

    // Real-time validation feedback
    const inputs = contactForm.querySelectorAll('.custom-input');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required')) {
          if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
          }
        }
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') && this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        }
      });
    });
  }

  // ========================
  // 9. Back to Top Button
  // ========================
  const backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================
  // 10. Spec Modal Data
  // ========================
  window.specData = {
    jabbar250: {
      title: 'جبار 250 — JABBAR 250',
      image: './image/jabbar-250.png',
      description: 'طائرة مسيرة عالية السرعة تعمل بمحرك توربيني صغير. صُممت كهدف جوي لمحاكاة التهديدات الجوية وتدريب منظومات الدفاع الجوي. يمكن استخدامها كذخيرة متسكعة بفضل قدرتها على حمل رأس حربي بوزن 50 كجم.',
      specs: [
        ['النوع', 'هدف جوي / ذخيرة متسكعة'],
        ['المحرك', 'محرك توربيني صغير (Turbojet)'],
        ['السرعة القصوى', '576 كم/س'],
        ['الوزن الأقصى للإقلاع', '250 كجم'],
        ['حمولة الرأس الحربي', '50 كجم'],
        ['المدى العملياتي', '1,500 كم'],
        ['مدة التحليق', '2.5 ساعة'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    jabbar200: {
      title: 'جبار 200 — JABBAR 200',
      image: './image/jabbar-200.png',
      description: 'طائرة ذات قدرة تحمل طويلة مصممة لمهام المراقبة والاستطلاع (ISR) ومهام الأهداف الجوية الطويلة المدى.',
      specs: [
        ['النوع', 'هدف جوي / استطلاع طويل المدى'],
        ['مدة التحليق', 'حتى 14 ساعة'],
        ['نظام التوجيه', 'GPS + بصري + INS'],
        ['البصمة الرادارية', 'منخفضة'],
        ['الهيكل', 'ألياف كربون خفيفة الوزن'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    jabbar150: {
      title: 'جبار 150 — JABBAR 150',
      image: './image/jabbar-150.png',
      description: 'طائرة هجومية أحادية الاتجاه ومرنة. قادرة على الوصول لسرعة 200 كم/س مع بقاء جوي يصل إلى 10 ساعات للقيام بمهام التدريب والدعم التكتيكي.',
      specs: [
        ['النوع', 'هدف جوي / هجومية'],
        ['التصميم', 'جناح دلتا مقصوص'],
        ['مدة التحليق', '10 ساعات'],
        ['السرعة القصوى', '200 كم/س'],
        ['نظام التوجيه', 'GPS + بصري'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    vortex5: {
      title: 'فورتكس-5 — VORTEX-5',
      image: './image/vortex-5.png',
      description: 'ذخيرة متسكعة تكتيكية خفيفة ومدمجة. توفر 60 دقيقة من وقت الطيران وتعمل بسرعة 180 كم/س. مثالية لمهام التدريب ومحاكاة الأسراب السريعة.',
      specs: [
        ['النوع', 'ذخيرة متسكعة تكتيكية'],
        ['السرعة القصوى', '180 كم/س'],
        ['مدة التحليق', '60 دقيقة'],
        ['المدى العملياتي', 'مرن'],
        ['طرق الإطلاق', 'أنبوبي / مركبة'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    vortex10: {
      title: 'فورتكس-10 — VORTEX-10',
      image: './image/vortex-10.png',
      description: 'نسخة أكبر وأكثر قدرة من فورتكس-5. تجمع بين الأداء العالي وقابلية النقل السريع للعمليات طويلة المدى ومحاكاة التهديدات الجوية المعقدة.',
      specs: [
        ['النوع', 'ذخيرة متسكعة عملياتية ممتدة'],
        ['السرعة القصوى', '200 كم/س'],
        ['مدة التحليق', '120 دقيقة'],
        ['المهام', 'محاكاة تهديدات / دعم ناري'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    tx10: {
      title: 'تي إكس-10 — TX-10 FPV',
      image: './image/tx-10-fpv.png',
      description: 'طائرة مسيرة تكتيكية من منظور الشخص الأول (FPV). مصممة للمناورة العالية في المساحات الضيقة وتقديم قدرات استطلاع هجومية متميزة.',
      specs: [
        ['النوع', 'طائرة مسيرة FPV'],
        ['المناورة', 'عالية جداً'],
        ['المهام', 'تكتيكية ودعم دقيق'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    quanta: {
      title: 'كوانتا فايتول-5 — QUANTA VTOL-5',
      image: './image/quanta-vtol-5.png',
      description: 'منظومة استطلاع ومراقبة (ISR) هجينة تدمج بين كفاءة الإقلاع والهبوط العمودي (VTOL) مع قدرة تحمل طائرات الأجنحة الثابتة لمدة تصل إلى 10 ساعات متواصلة.',
      specs: [
        ['النوع', 'طائرة استطلاع VTOL'],
        ['الإقلاع', 'عمودي (بدون مدرج)'],
        ['مدة التحليق', '10 ساعات'],
        ['المهام', 'مراقبة، استطلاع، نقل بيانات'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    cargo: {
      title: 'طائرة الشحن G1-CARGO',
      image: './image/g1-cargo.png',
      description: 'طائرة شحن بدون طيار هجينة للعمليات اللوجستية ونقل الإمدادات. تجمع بين الإقلاع العمودي وكفاءة الأجنحة الثابتة في التضاريس الصعبة.',
      specs: [
        ['النوع', 'طائرة شحن VTOL هجينة'],
        ['نظام الإقلاع', 'VTOL (إقلاع وهبوط عمودي)'],
        ['التضاريس', 'جميع الأنواع'],
        ['المهمة الرئيسية', 'نقل إمدادات لوجستية'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    },
    gk10: {
      title: 'نظام التوجيه GK-10',
      image: './image/gk-1000.png',
      description: 'مجموعة توجيه متطورة تُستخدم لتحويل الذخائر غير الموجهة إلى ذخائر ذكية دقيقة الإصابة. تتميز بسرعة انقضاض عالية ودقة توجيه فائقة لضمان تدمير الأهداف الاستراتيجية.',
      specs: [
        ['النوع', 'مجموعة توجيه (Guidance Kit)'],
        ['دقة الإصابة (CEP)', 'أقل من 30 متراً'],
        ['سرعة الانقضاض', 'حتى 700 كم/س'],
        ['المهام', 'تحويل الذخائر لذكية دقيقة'],
        ['التصنيع', 'مصري بالكامل'],
      ]
    }
  };

  // ========================
  // 11. Open Spec Modal Function
  // ========================
  window.openSpecModal = function(droneId) {
    const data = window.specData[droneId];
    if (!data) return;

    document.getElementById('specModalLabel').textContent = data.title;

    let specsHtml = `
      <img src="${data.image}" alt="${data.title}" class="spec-img">
      <div class="spec-description">${data.description}</div>
      <table class="spec-table">
    `;

    data.specs.forEach(([label, value]) => {
      specsHtml += `
        <tr>
          <td>${label}</td>
          <td>${value}</td>
        </tr>
      `;
    });

    specsHtml += '</table>';

    document.getElementById('specModalBody').innerHTML = specsHtml;

    const modal = new bootstrap.Modal(document.getElementById('specModal'));
    modal.show();
  };

  // ========================
  // 12. Reset Form Function
  // ========================
  window.resetForm = function() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

    form.reset();
    form.classList.remove('was-validated');
    form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    success.classList.add('d-none');
    form.classList.remove('d-none');
  };

  // ========================
  // 13. Intersection Observer for animations
  // ========================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .stat-card').forEach(card => {
    observer.observe(card);
  });

  // ========================
  // 14. Keyboard accessibility
  // ========================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        const bsModal = bootstrap.Modal.getInstance(openModal);
        if (bsModal) bsModal.hide();
      }
    }
  });

});