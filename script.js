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

    // --- ADVANCED AI CONNECTIVITY (Real API Integration) ---
    async function getAIResponse(input) {
        // --- CONFIGURATION ---
        // To use a real AI (like ChatGPT/Copilot), you need an API Key.
        // Replace 'YOUR_API_KEY' with your actual key from OpenAI or a similar provider.
        // ⚠️ SECURITY: Never commit real API keys to public repos!
        // To enable live AI, set your key securely (e.g., environment variable or backend proxy)
        const API_KEY = "YOUR_API_KEY_HERE";
        const API_URL = "https://api.openai.com/v1/chat/completions";

        // System Prompt: This defines the AI's identity and knowledge about you.
        const system_instruction = `
            You are "Portfolio Copilot", Ali Aljamal's highly intelligent AI assistant. 
            CONTEXT:
            - Ali is a Full Stack Developer from Jenin, Palestine 🇵🇸.
            - Tech Stack: React.js, Node.js, Python (Django/Flask), SQL, NoSQL (MongoDB), Tailwind CSS, UI/UX Design.
            - Soft Skills: Problem-solving, clean code, agile mindset.
            - Contact: WhatsApp (+972595498848), Email (alialjamal647@gmail.com).
            - CV: Available in the 'Resume' section of this page.
            
            RULES:
            1. Be professional, helpful, and creative.
            2. Match the user's language (Arabic or English).
            3. Answer specialized coding questions if asked, showcasing Ali's expertise.
            4. Keep responses medium-length (not too short, not too long).
            5. If asked about salary or personal stuff, redirect them to contact Ali directly.
        `;

        if (API_KEY === "YOUR_API_KEY_HERE" || !API_KEY) {
            return "As your **Portfolio Copilot**, I'm currently in 'Static Mode'. Ali is in the process of linking my brain to the live Cloud AI! In the meantime, I can tell you he is a brilliant Full Stack Developer specialized in React and Node.js. Check his projects below!";
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY.trim()}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: system_instruction },
                        { role: "user", content: input }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("OpenAI API Error Details:", errorData);
                // We will return the specific error to the user for debugging
                return `OpenAI Error: ${errorData.error ? errorData.error.message : "Internal Server Error"}`;
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("AI Connection Error:", error.message);
            return `Connection Error: ${error.message}. Please check your internet or API balance.`;
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
