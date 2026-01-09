document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on reload
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

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
        chatFormInput.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                userInput.value = '';

                showTypingIndicator();

                try {
                    // We call the async function and WAIT for the real response
                    const response = await getAIResponse(message);
                    removeTypingIndicator();
                    addMessage(response, 'ai');
                } catch (error) {
                    removeTypingIndicator();
                    addMessage("I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!", 'ai');
                }
            }
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = sender === 'ai' ? `<div class="message-avatar"><i class="fas fa-sparkles" style="color: white; font-size: 0.8rem;"></i></div>` : '';

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
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-sparkles" style="color: white; font-size: 0.8rem;"></i></div>
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

    // --- SMART LOCAL AI ENGINE (Offline-Ready) ---
    async function getAIResponse(input) {
        const query = input.toLowerCase();

        // Simulating processing delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        // Knowledge Base Actions & Responses
        const knowledgeBase = [
            {
                keywords: ['hello', 'hi', 'hey', 'ahlan', 'مرحبا', 'هلا'],
                response: "Hello! I'm **Aura**, Ali's AI assistant. How can I help you today? I can tell you about Ali's skills, projects, or how to contact him."
            },
            {
                keywords: ['skill', 'tech', 'stack', 'know', 'مهارات', 'تقنيات'],
                response: "Ali is a **Full Stack Developer** specializing in:<br>• **Frontend:** React.js, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS.<br>• **Backend:** Node.js, Python (Django/Flask).<br>• **Databases:** MongoDB, SQL.<br>He also has strong skills in UI/UX design and problem-solving!"
            },
            {
                keywords: ['project', 'work', 'build', 'مشاريع', 'اعمال'],
                response: "Ali has worked on several impressive projects:<br>1. **Lab Data Project:** A collaborative data-focused platform.<br>2. **my-Profile:** This stunning portfolio website!<br>3. **Algorithm-as:** A deep dive into data structures and patterns.<br>You can check the **Featured Projects** section right below for more details."
            },
            {
                keywords: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'تواصل', 'ايميل', 'واتس'],
                response: "You can reach Ali directly via:<br>• **WhatsApp:** [+972595498848](https://wa.me/972595498848)<br>• **Email:** [alialjamal647@gmail.com](mailto:alialjamal647@gmail.com)<br>He is currently **Available** for new opportunities!"
            },
            {
                keywords: ['cv', 'resume', 'experience', 'سيرة', 'خبرة'],
                response: "You can view and download Ali's full **Resume/CV** in the 'Resume' section of this page. It contains detailed information about his education and professional journey."
            },
            {
                keywords: ['location', 'from', 'where', 'live', 'اين', 'منين'],
                response: "Ali is based in **Jenin, Palestine 🇵🇸**, and he is open to remote opportunities worldwide!"
            },
            {
                keywords: ['who', 'ali', 'name', 'مين', 'علي'],
                response: "Ali Aljamal is a passionate Full Stack Developer who loves building elegant and scalable digital solutions. He's a creative thinker and a dedicated problem solver."
            }
        ];

        // Find match
        for (const item of knowledgeBase) {
            if (item.keywords.some(key => query.includes(key))) {
                return item.response;
            }
        }

        // Default response if no keyword matches
        return "That's an interesting question! While I'm specialized in Ali's portfolio, I can tell you he's highly skilled in coding. For specific inquiries, you might want to check his **Projects** or **Contact him** directly via WhatsApp!";
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
