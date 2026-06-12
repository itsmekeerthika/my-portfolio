document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback: in case window load event already fired or delayed
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 2000);
  }

  // ==========================================
  // 2. STICKY HEADER & BACK-TO-TOP
  // ==========================================
  const header = document.querySelector('header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 3. DARK / LIGHT MODE TOGGLE
  // ==========================================
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('portfolio-theme');

  // Load saved theme preference
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-moon'; // Switch icon to Moon for toggle back to dark
    }
  } else {
    document.body.classList.remove('light-theme');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-sun'; // Switch icon to Sun for toggle to light
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      let theme = 'dark';
      if (document.body.classList.contains('light-theme')) {
        theme = 'light';
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
      } else {
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
      }
      
      localStorage.setItem('portfolio-theme', theme);
    });
  }

  // ==========================================
  // 4. MOBILE HAMBURGER MENU
  // ==========================================
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when link is clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 5. ANIMATED TYPING EFFECT
  // ==========================================
  const typedTextSpan = document.querySelector('.typed-text');
  const textArray = [
    "Aspiring IT Professional",
    "B.Sc. Computer Science Graduate",
    "Web Designer & Developer",
    "Database Enthusiast"
  ];
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const newTextDelay = 2000; // Delay between word changes
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (typedTextSpan) {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }
  }

  function erase() {
    if (typedTextSpan) {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingSpeed + 500);
      }
    }
  }

  // Initial call to start typing animation
  if (typedTextSpan) {
    setTimeout(type, newTextDelay);
  }

  // ==========================================
  // 6. SCROLL REVEAL & ANIMATIONS (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const skillProgressBars = document.querySelectorAll('.progress-line span');
  const statNumbers = document.querySelectorAll('.stat-number');

  // Options for observer
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  // General reveal observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Skills progressive fill animation observer
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillProgressBars.forEach(bar => {
    skillsObserver.observe(bar);
  });

  // Statistics Counter Animation
  function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const isFloat = element.getAttribute('data-type') === 'float';
    const isPercentage = element.getAttribute('data-type') === 'percent';
    const duration = 1500; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      
      let currentValue = easeProgress * target;
      
      if (isFloat) {
        element.textContent = currentValue.toFixed(1) + '+';
      } else if (isPercentage) {
        element.textContent = Math.floor(currentValue) + '%';
      } else {
        element.textContent = Math.floor(currentValue) + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure exact final number is reached
        if (isFloat) {
          element.textContent = target.toFixed(1) + '+';
        } else if (isPercentage) {
          element.textContent = target + '%';
        } else {
          element.textContent = target + '+';
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });

  // ==========================================
  // 7. SCROLL SPY (Active Navigation Link Update)
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    let currentActiveSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset for nav bar
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      const hrefValue = link.getAttribute('href');
      if (hrefValue === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);
  // Initial call in case loading page at specific section scroll position
  scrollSpy();

  // ==========================================
  // 8. CONTACT FORM VALIDATION & INTERACTIVES
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Inputs
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      
      // Feedback labels
      const formFeedback = document.getElementById('form-status');
      
      // Basic reset
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      // Validation
      let isValid = true;
      let errorMsg = '';

      if (!nameInput.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your name.';
        nameInput.focus();
      } else if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
        emailInput.focus();
      } else if (!subjectInput.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter a subject.';
        subjectInput.focus();
      } else if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        isValid = false;
        errorMsg = 'Please enter a message (at least 10 characters).';
        messageInput.focus();
      }

      if (!isValid) {
        formFeedback.textContent = errorMsg;
        formFeedback.classList.add('error');
        return;
      }

      // If valid, submit to Web3Forms via AJAX Fetch
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200 || result.success) {
          // Reset form and show success
          contactForm.reset();
          formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
          formFeedback.classList.add('success');
        } else {
          // Show error from Web3Forms
          formFeedback.textContent = result.message || 'Something went wrong. Please try again.';
          formFeedback.classList.add('error');
        }
      })
      .catch((error) => {
        // Show network error
        formFeedback.textContent = 'Network error. Please check your connection and try again.';
        formFeedback.classList.add('error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Clear feedback after 5 seconds
        setTimeout(() => {
          formFeedback.style.opacity = '0';
          setTimeout(() => {
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = '';
            formFeedback.style.opacity = '1';
          }, 300);
        }, 5000);
      });
    });
  }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});
