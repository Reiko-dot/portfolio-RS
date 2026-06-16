document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementen
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const scrollProgress = document.querySelector('.scroll-progress');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('.footer');
    const magneticBtns = document.querySelectorAll('.magnetic');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    /* ═══════════════════════════════════════════
       1. CUSTOM CURSOR WITH HOVER EFFECTS
    ═══════════════════════════════════════════ */
    // Controleer of het apparaat geen touch-omgeving is (zoals gedefinieerd in CSS @media)
    if (window.innerWidth > 900) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Directe positionering voor de dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // De ring volgt met een minuscule vertraging via CSS transitions
            cursorRing.style.left = `${posX}px`;
            cursorRing.style.top = `${posY}px`;
        });

        // Voeg hover-klasse toe op interactieve elementen
        const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            target.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }

    /* ═══════════════════════════════════════════
       2. SCROLL PROGRESS & STICKY NAVBAR
    ═══════════════════════════════════════════ */
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Bereken scroll percentage
        if (docHeight > 0) {
            const scrolled = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        }

        // Sticky Navbar styling toevoegen bij scrollen
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        /* ═══════════════════════════════════════════
           3. SMOOTH SCROLL NAV INTERACTION (ACTIVE STATE)
        ═══════════════════════════════════════════ */
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // marge voor scroll-snapping look
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ═══════════════════════════════════════════
       4. SCROLL-REVEAL SYSTEM (INTERSECTION OBSERVER)
    ═══════════════════════════════════════════ */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop met observeren na onthulling
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ═══════════════════════════════════════════
       5. ADVANCED FOOTER SLIDE-UP EFFECT
    ═══════════════════════════════════════════ */
    // Zorgt ervoor dat de footer pas "onthuld" wordt zodra de gebruiker de bodem bereikt
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
            } else {
                // Schuift subtiel weg naar beneden als je weer omhoog scrolt
                footer.style.transform = 'translateY(40px)';
                footer.style.opacity = '0.7';
            }
        });
    }, { threshold: 0.1 });

    // Initialiseren van inline CSS voor de footer transitie
    footer.style.transform = 'translateY(40px)';
    footer.style.opacity = '0.7';
    footer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
    footerObserver.observe(footer);

    /* ═══════════════════════════════════════════
       6. OPTIONAL: SUBTLE MAGNETIC BUTTON EFFECT
    ═══════════════════════════════════════════ */
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 900) {
                const boundBox = btn.getBoundingClientRect();
                const mouseX = e.clientX - boundBox.left - (boundBox.width / 2);
                const mouseY = e.clientY - boundBox.top - (boundBox.height / 2);

                // Beweeg de knop lichtjes richting de muis (krachtfactor 0.3)
                btn.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
});