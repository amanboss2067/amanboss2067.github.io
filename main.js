const TOTAL_FRAMES = 229;
const images = [];
let loadedCount = 0;

let currentFrame = 0;
let targetFrame = 0;
let lastRenderedFrame = -1;

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');
const themeToggleBtn = document.getElementById('theme-toggle');

function pad3(num) {
  return String(num).padStart(3, '0');
}

// Day / Night Mode Theme Toggle Initialization
function initTheme() {
  const savedTheme = localStorage.getItem('aman_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeToggleBtn.title = 'Switch to Night Mode';
    }
  } else {
    document.body.classList.remove('light-mode');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.title = 'Switch to Day Mode';
    }
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    const currentTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('aman_theme', currentTheme);

    themeToggleBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    themeToggleBtn.title = isLight ? 'Switch to Night Mode' : 'Switch to Day Mode';
  });
}

// Mobile Menu Drawer Handler
function initMobileDrawer() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });
}

// Thumbnail Image Lightbox Handler
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.thumbnail-image-wrapper').forEach((wrapper) => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('.thumbnail-img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }
}

// CV Lightbox Modal Handler
function initCvModal() {
  const cvModal = document.getElementById('cv-modal');
  const cvModalClose = document.getElementById('cv-modal-close');
  const openCvBtn1 = document.getElementById('open-cv-modal-btn');
  const openCvBtn2 = document.getElementById('open-cv-modal-btn-2');

  function openModal() {
    if (cvModal) cvModal.classList.add('active');
  }

  function closeModal() {
    if (cvModal) cvModal.classList.remove('active');
  }

  if (openCvBtn1) openCvBtn1.addEventListener('click', openModal);
  if (openCvBtn2) openCvBtn2.addEventListener('click', openModal);
  if (cvModalClose) cvModalClose.addEventListener('click', closeModal);

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeModal();
    });
  }
}

// WhatsApp Contact Form Submission Handler
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('client-name');
  const emailInput = document.getElementById('client-email');
  const messageInput = document.getElementById('client-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        alert('Please fill in your name and project details.');
        return;
      }

      const formattedText = 
`📥 *NEW WORK INQUIRY - AMAN VISHWAKARMA PORTFOLIO*

👤 *Client Name:* ${name}
✉️ *Email Address:* ${email || 'Not Provided'}

📝 *Project Details / Message:*
${message}

---
Sent from Aman Portfolio Website`;

      const whatsappUrl = `https://wa.me/919125924224?text=${encodeURIComponent(formattedText)}`;

      // Redirect client directly to WhatsApp with pre-filled organized message
      window.open(whatsappUrl, '_blank');
    });
  }
}

// Preload all 229 image frames
function preloadImages() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const src = `public/frames/ezgif-frame-${pad3(i)}.jpg`;
    img.src = src;

    img.onload = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      if (loaderText) loaderText.textContent = `Loading ${percent}%`;

      if (i === 1 || lastRenderedFrame === -1) {
        render();
      }

      if (loadedCount === TOTAL_FRAMES && loader) {
        loader.classList.add('hidden');
      }
    };

    img.onerror = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES && loader) {
        loader.classList.add('hidden');
      }
    };

    images.push(img);
  }
}

// Resize canvas to match display size & device pixel ratio
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  lastRenderedFrame = -1;
  render();
}

// Update scroll-driven target frame & active nav link
function updateScrollState() {
  const scrollTop = Math.max(
    0,
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  );
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  const maxScroll = Math.max(1, scrollHeight - window.innerHeight);

  const fraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
  targetFrame = fraction * (TOTAL_FRAMES - 1);

  // Update active nav link based on section in view
  const sections = document.querySelectorAll('section[id]');
  let currentSectionId = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  if (currentSectionId) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }
}

// Render the target frame to canvas with aspect cover scaling
function render() {
  const frameIndex = Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.round(currentFrame))
  );

  const img = images[frameIndex];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const canvasAspect = canvasWidth / canvasHeight;
  const imgAspect = imgWidth / imgHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasAspect > imgAspect) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgAspect;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgAspect;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  lastRenderedFrame = frameIndex;
}

// Smooth requestAnimationFrame animation loop with lerping
function animationLoop() {
  updateScrollState();

  const diff = targetFrame - currentFrame;
  if (Math.abs(diff) > 0.001) {
    currentFrame += diff * 0.15; // Smooth lerping
  } else {
    currentFrame = targetFrame;
  }

  if (Math.round(currentFrame) !== lastRenderedFrame) {
    render();
  }

  requestAnimationFrame(animationLoop);
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('wheel', updateScrollState, { passive: true });
window.addEventListener('touchmove', updateScrollState, { passive: true });

// Initialize
initTheme();
initMobileDrawer();
initLightbox();
initCvModal();
initContactForm();
resizeCanvas();
preloadImages();
requestAnimationFrame(animationLoop);
