// Personal Portfolio Interaction Scripts
document.addEventListener('DOMContentLoaded', () => {

    // Generate Twinkling Stars
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        const numberOfStars = 100;
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';

            // Random star sizes
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';

            starsContainer.appendChild(star);
        }
    }
    // 3D Carousel Logic with Damping (Smoothness)
    const carousel = document.querySelector('.carousel-container');
    const cards = document.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const angleStep = 360 / totalCards;

    let radius = window.innerWidth < 768 ? 400 : 700;
    let targetRotation = 0;
    let currentRotation = 0;
    let isDragging = false;
    let startX = 0;
    let rotationOnStart = 0;
    let lastX = 0;
    let velocity = 0;

    function updateCarousel() {
        // Smoothing: Current rotation follows target rotation with damping
        if (!isDragging) {
            currentRotation += (targetRotation - currentRotation) * 0.1;
        }

        cards.forEach((card, index) => {
            const angle = (index * angleStep) + currentRotation;
            const x = Math.sin(angle * Math.PI / 180) * radius;
            const z = Math.cos(angle * Math.PI / 180) * radius;

            // 3D Transform using translate3d for hardware acceleration
            card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`;

            // Calculate distance from front
            const normalizedAngle = ((angle % 360) + 360) % 360;
            const diff = Math.min(normalizedAngle, 360 - normalizedAngle);

            // Toggle active state for front card
            if (diff < 20) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.zIndex = '10';
            } else {
                card.classList.remove('active');
                card.style.opacity = Math.max(0.3, 1 - (diff / 180));
                card.style.zIndex = '1';
            }
        });

        requestAnimationFrame(updateCarousel);
    }

    // Handle Click to focus
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (isDragging && Math.abs(velocity) > 2) {
                e.preventDefault();
                return;
            }

            const cardRotation = - (index * angleStep);
            let diff = cardRotation - (targetRotation % 360);

            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;

            targetRotation += diff;
        });
    });

    // Unified Interaction Logic
    const startInteraction = (e) => {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        lastX = startX;
        rotationOnStart = targetRotation;
        velocity = 0;
    };

    const moveInteraction = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        const deltaX = currentX - startX;

        velocity = currentX - lastX;
        lastX = currentX;

        targetRotation = rotationOnStart + (deltaX * 0.15); // Sensitivity
        currentRotation = targetRotation; // Immediate follow while dragging
    };

    const endInteraction = () => {
        if (!isDragging) return;
        isDragging = false;

        // Add momentum
        targetRotation += velocity * 0.5;

        // Snap to nearest card
        targetRotation = Math.round(targetRotation / angleStep) * angleStep;
    };

    // Events
    window.addEventListener('mousedown', startInteraction);
    window.addEventListener('mousemove', moveInteraction);
    window.addEventListener('mouseup', endInteraction);

    window.addEventListener('touchstart', startInteraction, { passive: true });
    window.addEventListener('touchmove', moveInteraction, { passive: true });
    window.addEventListener('touchend', endInteraction);

    // Initial setup
    requestAnimationFrame(updateCarousel);

    // Dynamic resize
    window.addEventListener('resize', () => {
        radius = window.innerWidth < 768 ? 400 : 700;
    });

    // Typing Effect for Role
    const roleElement = document.getElementById('role');
    if (roleElement) {
        const text = roleElement.innerText;
        roleElement.innerText = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                roleElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Navbar Mobile Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('active');
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('header, section, main');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
