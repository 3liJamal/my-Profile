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
    // 3D Carousel Logic
    const carousel = document.querySelector('.carousel-container');
    const cards = document.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const angleStep = 360 / totalCards;

    // Adjust radius based on screen size
    let radius = window.innerWidth < 768 ? 300 : 500;

    let currentRotation = 0;
    let isDragging = false;
    let startX = 0;
    let rotationOnStart = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            const angle = (index * angleStep) + currentRotation;
            const x = Math.sin(angle * Math.PI / 180) * radius;
            const z = Math.cos(angle * Math.PI / 180) * radius;

            // 3D Transform
            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`;

            // Calculate focus (the card closest to the front at angle 0)
            const normalizedAngle = ((angle % 360) + 360) % 360; // 0 to 360
            const diff = Math.min(normalizedAngle, 360 - normalizedAngle);

            if (diff < 20) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.filter = 'none';
            } else {
                card.classList.remove('active');
                card.style.opacity = (1 - (diff / 200)).toString();
                card.style.filter = `blur(${diff / 20}px) grayscale(${diff / 100})`;
            }
        });
    }

    // Handle Click to focus
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            const targetRotation = - (index * angleStep);

            // Check if we need to wrap around for shorter rotation path
            let diff = targetRotation - (currentRotation % 360);
            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;

            currentRotation += diff;
            updateCarousel();
        });
    });

    // Interaction Support
    const startInteraction = (e) => {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        rotationOnStart = currentRotation;
        carousel.style.transition = 'none';
    };

    const moveInteraction = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        const deltaX = currentX - startX;
        currentRotation = rotationOnStart + (deltaX * 0.1);
        updateCarousel();
    };

    const endInteraction = () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)';

        // Snap to nearest card
        currentRotation = Math.round(currentRotation / angleStep) * angleStep;
        updateCarousel();
    };

    window.addEventListener('mousedown', startInteraction);
    window.addEventListener('mousemove', moveInteraction);
    window.addEventListener('mouseup', endInteraction);

    window.addEventListener('touchstart', startInteraction, { passive: true });
    window.addEventListener('touchmove', moveInteraction, { passive: true });
    window.addEventListener('touchend', endInteraction);

    // Dynamic resize
    window.addEventListener('resize', () => {
        radius = window.innerWidth < 768 ? 300 : 500;
        updateCarousel();
    });

    // Initial load
    updateCarousel();

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
});
