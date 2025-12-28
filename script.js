document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);

    if (menuToggle && navLinks) {
        function toggleMenu() {
            const isActive = navLinks.classList.contains('active');
            
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate Icon
            const icon = menuToggle.querySelector('svg');
            if (!isActive) {
                icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                document.body.style.position = 'fixed'; // Extra lock
                document.body.style.width = '100%'; // Prevent layout shift
            } else {
                icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        }

        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu); // Close when clicking outside
        
        // Close menu when clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = menuToggle.querySelector('svg');
                    icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
                }

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) i.classList.remove('faq-open');
            });

            item.classList.toggle('faq-open');
        });
    });

    // Scroll Reveal Animation with Intersection Observer
    const revealElements = document.querySelectorAll('.service-card, .hero-content, .booking-card, .section-header, .feature-card, .step-card, .testimonial-card, .project-card, .faq-item');
    
    // Add reveal class initially
    revealElements.forEach(el => el.classList.add('reveal'));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => sectionObserver.observe(el));

    // Scroll To Top Button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.classList.add('scroll-top');
    scrollTopBtn.innerHTML = '↑';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // 3D Tilt Effect for Service Cards (Desktop Only)
    if (window.matchMedia("(min-width: 769px)").matches) {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                 card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Animated Statistics Counter
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // Animation duration in ms
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                statsObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.achievements-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Typewriter Effect
    const typingElement = document.querySelector('.typing-text');
    const phrases = ["Fixing Homes.", "Crafting Spaces.", "Building Trust.", "Elevating Living."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deleting
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    if (typingElement) {
        type();
    }
    
    // Form Submission Handling (Demo)
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.onsubmit = (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Simulate success or failure
                const success = Math.random() > 0.2; // 80% chance of success for demo

                if (success) {
                    const successMessage = document.createElement('p');
                    successMessage.textContent = 'Thank you! Your request has been submitted. We will get back to you shortly.';
                    successMessage.style.color = 'green';
                    successMessage.style.marginTop = '1rem';
                    successMessage.style.textAlign = 'center';
                    bookingForm.appendChild(successMessage);
                    bookingForm.reset(); // Clear the form
                } else {
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'Oops! Something went wrong. Please try again later.';
                    errorMessage.style.color = 'red';
                    errorMessage.style.marginTop = '1rem';
                    errorMessage.style.textAlign = 'center';
                    bookingForm.appendChild(errorMessage);
                }

                btn.innerText = originalText;
                btn.disabled = false;

                // Remove messages after a few seconds
                setTimeout(() => {
                    const messages = bookingForm.querySelectorAll('p[style*="color"]');
                    messages.forEach(msg => msg.remove());
                }, 5000);
            }, 1500);

        };
    }
    // Content Protection (Disable Right Click, Copy, Cut, Paste)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
        }
    });

    // Disable Selection
    document.addEventListener('selectstart', (e) => e.preventDefault());
});
