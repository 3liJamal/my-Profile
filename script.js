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
    const carousel = document.getElementById('carousel');
    const cards = document.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const radius = Math.round((300 / 2) / Math.tan(Math.PI / totalCards)) + 150; // Calculate radius based on card width

    let currentRotation = 0;
    let isDragging = false;
    let startX = 0;
    let rotationOnStart = 0;

    // Initialize 3D positions
    function updateCarousel() {
        cards.forEach((card, index) => {
            const angle = (index * (360 / totalCards));
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

            // Adjust opacity based on front/back position
            const normalizedRotation = (currentRotation + angle) % 360;
            const diff = Math.abs(normalizedRotation > 180 ? normalizedRotation - 360 : normalizedRotation);
            card.style.opacity = diff > 90 ? '0.3' : '1';

            // Toggle active class for the one in front
            if (Math.abs(diff) < 10) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        carousel.style.transform = `rotateY(${-currentRotation}deg)`;
    }

    // Handle Click to bring to front and Scale
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Prevent link from opening if it's not in front
            if (!card.classList.contains('active')) {
                e.preventDefault();
                currentRotation = index * (360 / totalCards);
                updateCarousel();
            } else {
                // If already front, toggle extra zoom
                card.classList.toggle('zoomed');
            }
        });
    });

    // Dragging Logic
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        rotationOnStart = currentRotation;
        carousel.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.pageX - startX;
        currentRotation = rotationOnStart - (deltaX * 0.2); // Sensitivity
        updateCarousel();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';

        // Snap to nearest card
        const step = 360 / totalCards;
        currentRotation = Math.round(currentRotation / step) * step;
        updateCarousel();
    });

    // Touch Support for Mobile
    carousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        rotationOnStart = currentRotation;
        carousel.style.transition = 'none';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].pageX - startX;
        currentRotation = rotationOnStart - (deltaX * 0.3);
        updateCarousel();
    });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        const step = 360 / totalCards;
        currentRotation = Math.round(currentRotation / step) * step;
        updateCarousel();
    });

    // Initial setup
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
