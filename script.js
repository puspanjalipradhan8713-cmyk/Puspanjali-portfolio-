
// =====================
// Detect Mobile / Touch Device
// =====================
const isTouchDevice = ('ontouchstart' in window) || 
                      (navigator.maxTouchPoints > 0) || 
                      (navigator.msMaxTouchPoints > 0);

// =====================
// Particle System (Lighter for Mobile)
// =====================
const canvas = document.createElement('canvas');
document.getElementById('particles').appendChild(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function initCanvas() {
    // Lower DPR for mobile performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    w = window.innerWidth;
    h = window.innerHeight;
}

initCanvas();

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * h;
    }
    reset() {
        this.x = Math.random() * w;
        this.y = h + 10;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedY = Math.random() * 0.6 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = ['#7c3aed', '#ec4899', '#06b6d4', '#a5b4fc'][Math.floor(Math.random() * 4)];
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    // Fewer particles on mobile
    const baseCount = isTouchDevice ? 40 : 90;
    const count = Math.min(baseCount, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

let lastTime = 0;
function animateParticles(time) {
    // Throttle to ~40fps on mobile for battery
    if (time - lastTime < (isTouchDevice ? 25 : 16)) {
        requestAnimationFrame(animateParticles);
        return;
    }
    lastTime = time;
    
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

// Debounced resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initCanvas();
        initParticles();
    }, 250);
});

// =====================
// Typewriter Effect
// =====================
const words = [
    'BCA Student 🎓',
    'Future Developer 💻',
    'Creative Designer 🎨',
    'Problem Solver 🧠',
    'Fast Learner ⚡'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }
    
    setTimeout(type, typeSpeed);
}
type();

// =====================
// Mobile Menu Toggle
// =====================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu open
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

// =====================
// 3D Card - Touch/Drag Tilt
// =====================
const card3d = document.getElementById('card3d');
const cardWrapper = document.querySelector('.card-3d-wrapper');

function handleCardMove(clientX, clientY) {
    const rect = cardWrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;
    
    card3d.style.animation = 'none';
    card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
}

function resetCard() {
    card3d.style.transform = '';
    card3d.style.animation = 'cardFloat 5s infinite ease-in-out';
}

// Mouse (desktop)
cardWrapper.addEventListener('mousemove', (e) => {
    handleCardMove(e.clientX, e.clientY);
});
cardWrapper.addEventListener('mouseleave', resetCard);

// Touch (mobile)
cardWrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        handleCardMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

cardWrapper.addEventListener('touchend', resetCard);

// =====================
// Tilt on Cards (About & Skills)
// =====================
if (!isTouchDevice) {
    // Only for desktop with mouse
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// =====================
// Scroll Reveal Animation
// =====================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Animate progress bars
            if (entry.target.classList.contains('skills-container')) {
                document.querySelectorAll('.progress-bar').forEach(bar => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width;
                    }, 200);
                });
            }
            // Stop observing after reveal
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add reveal class setup
document.querySelectorAll('.about-card, .skill-item, .contact-info, .contact-form, .section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
});

// Add .revealed styles via JS (since we're setting inline)
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Observe skills container separately for progress bars
const skillsContainer = document.querySelector('.skills-container');
if (skillsContainer) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.progress-bar').forEach(bar => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width;
                    }, 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsContainer);
}

// Stagger animation
document.querySelectorAll('.about-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
});
document.querySelectorAll('.skill-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
});

// =====================
// Navbar Scroll Effect
// =====================
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.getElementById('scrollTop');

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const y = window.scrollY;
            
            if (y > 40) {
                navbar.style.background = 'rgba(5, 5, 16, 0.92)';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            } else {
                navbar.style.background = 'rgba(5, 5, 16, 0.75)';
                navbar.style.boxShadow = 'none';
            }
            
            if (y > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================
// Smooth Anchor Scroll
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// =====================
// Form Submit
// =====================
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending... ⏳';
    btn.disabled = true;
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    setTimeout(() => {
        btn.textContent = 'Message Sent! ✅';
        btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
        
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 2000);
    }, 1200);
});

// =====================
// Parallax on Scroll (Lightweight)
// =====================
const shapes = document.querySelectorAll('.shape');
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking && !isTouchDevice) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.1;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
}, { passive: true });

// =====================
// Prevent zoom on double-tap (iOS)
// =====================
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// =====================
// Hide address bar on mobile scroll (optional bonus)
// =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 100);
    }, 200);
});

console.log('%c✨ Portfolio by Pushpanjali Pradhan ✨', 
    'background: linear-gradient(90deg, #7c3aed, #ec4899); color: white; padding: 10px 20px; font-size: 14px; border-radius: 8px; font-weight: bold;');
