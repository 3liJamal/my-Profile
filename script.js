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
    // AI Chat Handler
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatFormInput = document.getElementById('chatFormInput');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.add('active');
            chatToggle.style.display = 'none';
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            chatToggle.style.display = 'flex';
        });
    }

    if (chatFormInput) {
        chatFormInput.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                userInput.value = '';

                showTypingIndicator();

                setTimeout(() => {
                    removeTypingIndicator();
                    const response = getAIResponse(message);
                    addMessage(response, 'ai');
                }, 1500);
            }
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarImg = 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=100&h=100';
        const avatar = sender === 'ai' ? `<div class="message-avatar"><img src="${avatarImg}" alt="Aura"></div>` : '';

        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">${text}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        const avatarImg = 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=100&h=100';
        typingDiv.innerHTML = `
            <div class="message-avatar"><img src="${avatarImg}" alt="Aura"></div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function getAIResponse(input) {
        const msg = input.toLowerCase();

        // --- ARABIC RESPONSES ---
        if (msg.match(/[أ-ي]/)) {
            if (msg.includes('مين') || msg.includes('اسم') || msg.includes('من انت') || msg.includes('مين انت')) {
                return "أنا Aura، المساعد الذكي الخاص بعلي! أنا هنا لمساعدتك في التعرف على مهاراته ومشاريعه.";
            } else if (msg.includes('مهار') || msg.includes('شو بشتغل') || msg.includes('اللغات') || msg.includes('تقنيات')) {
                return "علي مطور Full Stack محترف، يتقن React.js, Node.js, Python (Django), وتصميم واجهات UI/UX عصرية.";
            } else if (msg.includes('مشروع') || msg.includes('اعمال') || msg.includes('شغل')) {
                return "قام علي بالعمل على العديد من المشاريع المميزة مثل منصات التجارة الإلكترونية وأنظمة الإدارة. يمكنك رؤيتها في قسم المشاريع!";
            } else if (msg.includes('سيرة') || msg.includes('cv') || msg.includes('سي في') || msg.includes('رزومي')) {
                return "يمكنك عرض وتحميل السيرة الذاتية لعلي من قسم Resume الموجود في منتصف الصفحة.";
            } else if (msg.includes('هلا') || msg.includes('مرحبا') || msg.includes('كيفك') || msg.includes('سلام') || msg.includes('هاي')) {
                return "أهلاً بك! أنا Aura. كيف يمكنني مساعدتك اليوم؟ يمكنني إخبارك عن مهارات علي، مشاريع، أو كيف تتواصل معه.";
            } else {
                return "هذا مدهش! أنا لا أزال أتعلم، ولكن يمكنني إخبارك كل شيء عن مهارات علي ومشاريعه. جرب سؤالي عن 'مهاراته'!";
            }
        }

        // --- ENGLISH RESPONSES ---
        if (msg.includes('name') || msg.includes('who are you')) {
            return "I am Aura, Ali's personal AI assistant! I'm here to help you navigate his portfolio and answer any questions you have.";
        } else if (msg.includes('skill') || msg.includes('know') || msg.includes('techno') || msg.includes('language')) {
            return "Ali is a Full Stack Developer skilled in React.js, Node.js, Python (Django/Flask), and modern CSS. He's also great at UI/UX design!";
        } else if (msg.includes('project') || msg.includes('work') || msg.includes('portfolio')) {
            return "Ali has worked on several featured projects like E-commerce platforms, and management systems. You can explore them in the Projects section!";
        } else if (msg.includes('cv') || msg.includes('resume')) {
            return "You can view and download Ali's professional CV in the Resume section right above the projects!";
        } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('hola')) {
            return "Hey there! I am Aura. How can I help you today? I can tell you about Ali's skills, projects, or how to contact him.";
        } else if (msg.includes('how are you')) {
            return "I'm doing great! Just hanging out here in Ali's portfolio. How can I assist you?";
        } else {
            return "That's interesting! I'm still learning, but I can tell you all about Ali's professional background, skills, and projects. Try asking about his 'skills'!";
        }
    }

    // --- Tech Galaxy Core Interaction ---
    const galaxyCore = document.querySelector('.galaxy-core');
    const galaxyContainer = document.querySelector('.galaxy-container');

    if (galaxyCore && galaxyContainer) {
        galaxyCore.addEventListener('click', () => {
            galaxyContainer.classList.toggle('super-spin');
            galaxyCore.classList.toggle('active');

            // Create a small feedback effect
            if (galaxyContainer.classList.contains('super-spin')) {
                console.log("Super Spin Mode: Activated 🚀");
            } else {
                console.log("Super Spin Mode: Deactivated 🌌");
            }
        });
    }
});
