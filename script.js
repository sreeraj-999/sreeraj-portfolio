document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // MOBILE MENU NAVIGATION
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // THEME SWITCHER (LIGHT/DARK MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    // Check localStorage for preferred theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const moonIcon = themeToggleBtn.querySelector('.fa-moon');
        const sunIcon = themeToggleBtn.querySelector('.fa-sun');
        
        if (theme === 'light') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    // ==========================================================================
    // TYPING ANIMATION (HERO SECTION)
    // ==========================================================================
    const typedTextElement = document.querySelector('.typed-text');
    const phrases = ["MCA Student", "Tech Enthusiast", "MERN Stack Learner"];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typedTextElement) return;

        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typedTextElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Typing text
            typedTextElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 100; // Standard speed
        }

        // Handle typing logic flags
        if (!isDeleting && characterIndex === currentPhrase.length) {
            // Completed typing word, pause
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
            // Completed deleting word, move to next
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause briefly before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect
    if (typedTextElement) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS ON SCROLL (SCROLL SPY)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header.header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        // Sticky Navbar styling on scroll
        if (header) {
            if (scrollPosition > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Show Back to Top Button
        if (backToTop) {
            if (scrollPosition > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        // Detect which section is in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active class to navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });



    // ==========================================================================
    // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.fade-in-up');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it is the about/skills section, trigger progress bar animation
                if (entry.target.id === 'about' || entry.target.contains(document.querySelector('.skills-grid'))) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        sectionObserver.observe(element);
    });

    // Animate skill bars specifically
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }

    // Fallback if IntersectionObserver is not supported
    if (!window.IntersectionObserver) {
        animatedElements.forEach(el => el.classList.add('appear'));
        animateSkillBars();
    }

    // ==========================================================================
    // CONTACT FORM INTERACTION (MOCK SUBMIT)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            // Get form values (read before reset)
            const name = document.getElementById('name').value;

            // Submit Button loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

            // We let the natural form submission happen to the iframe.
            // Display success message and reset after a short timeout to mimic network latency.
            setTimeout(() => {
                // Success feedback
                formStatus.classList.remove('error');
                formStatus.classList.add('success');
                formStatus.querySelector('span').textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                formStatus.style.display = 'flex';
                
                // Reset form fields
                contactForm.reset();

                // Reset Submit Button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);

            }, 1000);
        });
    }

    // ==========================================================================
    // FOOTER DYNAMIC YEAR
    // ==========================================================================
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
