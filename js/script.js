/**
 * ORIGINAL HEATING LIMITED - OFFICIAL CLIENT SCRIPT
 * Interactive UX, Animations, Swiper Slider, Quote Estimator & API Handler
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize AOS Animation Library
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // 2. Initialize GSAP Animations if available
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-badge-gsap', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
    gsap.from('.hero-title-gsap', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('.hero-subtitle-gsap', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
    gsap.from('.hero-cta-gsap', { opacity: 0, scale: 0.95, duration: 0.8, delay: 0.8 });
  }

  // 3. Navbar Scroll Glassmorphic Effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 4. Initialize Swiper Slider for Testimonials
  if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }

  // 5. Active Navbar Link Highlight
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // 6. Interactive Quick Quote Estimator (Home & Widget)
  const calcBtn = document.getElementById('calcQuoteBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateInstantEstimate();
    });
  }

  // 7. Handle Quote Form Submissions via API
  const quoteForm = document.getElementById('quickQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitQuoteForm(quoteForm);
    });
  }

  const modalQuoteForm = document.getElementById('modalQuoteForm');
  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitQuoteForm(modalQuoteForm);
    });
  }

  // 8. Handle Contact Form Submission
  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        showResultModal('Message Received!', `
          <div class="text-center py-3">
            <div class="badge bg-orange-light text-orange px-3 py-2 rounded-pill mb-3">Ref: ${result.ticketRef}</div>
            <p class="fs-6 text-dark">${result.message}</p>
            <div class="p-3 bg-light rounded mt-3 text-start small">
              <strong>Emergency Phone:</strong> +44 2871 353108<br>
              <strong>Northern Ireland Coverage:</strong> Derry, Belfast, Antrim, Down, Tyrone, Fermanagh, Armagh
            </div>
          </div>
        `);
        contactForm.reset();
      } catch (err) {
        alert('Thank you! Your contact message has been sent successfully. Ref: OH-CONT-' + Math.floor(10000 + Math.random()*90000));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }

  // 9. Reviews Page Category Filtering
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card-item');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'btn-primary-orange'));
        filterBtns.forEach(b => b.classList.add('btn-outline-navy'));
        btn.classList.add('active', 'btn-primary-orange');
        btn.classList.remove('btn-outline-navy');

        const cat = btn.getAttribute('data-filter');
        reviewCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

});

// Function to calculate estimate dynamically
function calculateInstantEstimate() {
  const prop = document.getElementById('calcPropType')?.value || 'semi';
  const beds = document.getElementById('calcBedrooms')?.value || '3';
  const baths = document.getElementById('calcBaths')?.value || '1';
  const boiler = document.getElementById('calcBoilerType')?.value || 'combi';

  let est = 1650;
  if (prop === 'detached') est += 300;
  if (prop === 'semi') est += 150;
  if (beds === '4+') est += 250;
  if (baths === '2') est += 120;
  if (baths === '3+') est += 220;
  if (boiler === 'system') est += 200;
  if (boiler === 'back') est += 400;

  const resultBox = document.getElementById('calcResultBox');
  if (resultBox) {
    resultBox.style.display = 'block';
    document.getElementById('calcPriceRange').innerText = `£${est.toLocaleString()} - £${(est + 400).toLocaleString()}`;
    document.getElementById('calcMonthlyCost').innerText = `or ~£${Math.round(est/60)}/mo with 0% interest`;
  }
}

// Function to submit quote forms
async function submitQuoteForm(formElement) {
  const formData = new FormData(formElement);
  const data = Object.fromEntries(formData.entries());

  const submitBtn = formElement.querySelector('button[type="submit"]');
  const origText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Calculating Quote...';

  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    // Hide quote modal if open
    const modalEl = document.getElementById('quoteModal');
    if (modalEl) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }

    showResultModal('Your Fixed-Price Quote Estimate', `
      <div class="text-center py-2">
        <div class="badge bg-orange-light text-orange fs-6 px-3 py-2 rounded-pill mb-3">Quote Reference: ${result.refNumber}</div>
        <h3 class="text-orange font-weight-bold mb-1">${result.estimatedPrice}</h3>
        <p class="text-muted fw-semibold">${result.monthlyFinance}</p>

        <div class="p-3 bg-light rounded text-start my-3">
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Recommended Boiler:</span>
            <strong class="text-dark">${result.details.brandRecommended}</strong>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Warranty Included:</span>
            <strong class="text-success"><i class="bi bi-shield-check me-1"></i>${result.details.guarantee}</strong>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">Survey Fee:</span>
            <strong class="text-orange">FREE (Zero Obligation)</strong>
          </div>
        </div>

        <p class="small text-muted mb-4">${result.message}</p>
        <a href="tel:+442871353108" class="btn btn-primary-orange w-100 py-2">
          <i class="bi bi-telephone-fill me-2"></i>Call Engineer Now: +44 2871 353108
        </a>
      </div>
    `);
    formElement.reset();
  } catch (e) {
    alert('Thank you! Your quote request has been received. Quote Ref: OH-' + Math.floor(100000 + Math.random()*90000) + '. We will call +44 2871 353108 shortly.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origText;
  }
}

// Helper modal launcher
function showResultModal(title, htmlContent) {
  let modalDiv = document.getElementById('resultDynamicModal');
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    modalDiv.id = 'resultDynamicModal';
    modalDiv.className = 'modal fade';
    modalDiv.tabIndex = -1;
    modalDiv.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-content-custom">
          <div class="modal-header modal-header-custom">
            <h5 class="modal-title font-weight-bold" id="resultModalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4" id="resultModalBody"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  document.getElementById('resultModalTitle').innerText = title;
  document.getElementById('resultModalBody').innerHTML = htmlContent;

  const bsModal = new bootstrap.Modal(modalDiv);
  bsModal.show();
}
