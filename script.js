/* ================================
   Valentine Week 2026 - Cat Themed
   Enhanced JavaScript with Date Locking & Music
   ================================ */

// Music Control with Background Music
let musicPlaying = false;
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = new Audio('assets/bgmusic.mp4');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Set volume to 50%

musicToggle.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    musicToggle.classList.toggle('playing', musicPlaying);
    
    if (musicPlaying) {
        backgroundMusic.play().catch(err => {
            console.log('Audio playback failed:', err);
            musicPlaying = false;
            musicToggle.classList.remove('playing');
        });
    } else {
        backgroundMusic.pause();
    }
});

// Progress Tracking
function updateProgress(day) {
    const currentDaySpan = document.getElementById('currentDay');
    const progressFill = document.getElementById('progressFill');
    
    currentDaySpan.textContent = day;
    const percentage = (day / 8) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function goToTimeline() {
    showPage('timeline');
    updateProgress(0);
}

function nextDay(dayNumber) {
    showPage(`day${dayNumber}`);
    updateProgress(dayNumber);
}

function previousDay(dayNumber) {
    showPage(`day${dayNumber}`);
    updateProgress(dayNumber);
}

// Landing Page Particles - IMPROVED ANIMATION
function createFloatingParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    const emojis = ['🐱', '💕', '🐾', '💖', '✨', '💝', '🌹', '😻'];
    const particleCount = 15;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random horizontal position
        const startX = Math.random() * 100;
        particle.style.left = `${startX}%`;
        
        // Random animation duration
        const duration = 6 + Math.random() * 4; // 6-10 seconds
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        particles.appendChild(particle);
        
        // Remove and recreate after animation
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + delay) * 1000);
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 400);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFloatingParticles();
    checkUnlockedDays();
    initializeSlideshowDots();
});

// Begin Journey Button
const beginButton = document.getElementById('beginJourney');
if (beginButton) {
    beginButton.addEventListener('click', () => {
        showPage('timeline');
    });
}

// Back to Landing Button
const backButton = document.getElementById('backToLanding');
if (backButton) {
    backButton.addEventListener('click', () => {
        showPage('landing');
        updateProgress(0);
    });
}

// Day Unlocking System - REAL DATE-BASED LOCKING
function checkUnlockedDays() {
    const today = new Date();
    // Reset time to midnight for accurate date comparison
    today.setHours(0, 0, 0, 0);
    
    const cards = document.querySelectorAll('.day-card');
    
    cards.forEach(card => {
        const dateStr = card.dataset.date; // Format: "2026-02-07"
        const cardDate = new Date(dateStr);
        cardDate.setHours(0, 0, 0, 0);
        
        const button = card.querySelector('.day-button');
        const dayNum = card.dataset.day;
        
        // Check if today's date is >= card's date
        if (today >= cardDate) {
            // Day is unlocked
            card.classList.remove('locked');
            
            if (button) {
                button.addEventListener('click', () => {
                    showPage(`day${dayNum}`);
                    updateProgress(parseInt(dayNum));
                });
            }
        } else {
            // Day is locked
            card.classList.add('locked');
            
            // Remove any existing click handlers
            if (button) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        }
    });
}

/* ================================
   Rose Day Interaction
   ================================ */
const mainRose = document.getElementById('mainRose');
const roseMessage = document.getElementById('roseMessage');

if (mainRose) {
    mainRose.addEventListener('click', () => {
        mainRose.classList.add('clicked');
        
        // Create falling petals - IMPROVED
        createFallingPetals();
        
        // Show message
        setTimeout(() => {
            roseMessage.classList.add('visible');
        }, 600);
        
        // Remove clicked class to allow re-clicking
        setTimeout(() => {
            mainRose.classList.remove('clicked');
        }, 1200);
    });
}

function createFallingPetals() {
    const petalEmojis = ['🌹', '🌸', '💐', '🌺'];
    const petalCount = 20;
    
    for (let i = 0; i < petalCount; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
            
            // Random horizontal starting position
            const startX = 20 + Math.random() * 60; // Center area
            petal.style.left = `${startX}%`;
            
            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 200; // -100 to 100px
            petal.style.setProperty('--drift', `${drift}px`);
            petal.style.setProperty('--random-x', `${(Math.random() - 0.5) * 100}px`);
            
            // Random animation duration
            const duration = 3 + Math.random() * 2; // 3-5 seconds
            petal.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(petal);
            
            // Remove after animation
            setTimeout(() => petal.remove(), duration * 1000);
        }, i * 100);
    }
}

/* ================================
   Propose Day - Envelope
   ================================ */
const envelope = document.getElementById('envelope');

if (envelope) {
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('opened');
    });
}

/* ================================
   Chocolate Day
   ================================ */
const chocolates = document.querySelectorAll('.chocolate');
const chocolateMessage = document.getElementById('chocolateMessage');
let eatenCount = 0;

chocolates.forEach(chocolate => {
    chocolate.addEventListener('click', () => {
        if (chocolate.classList.contains('eaten')) return;
        
        chocolate.classList.add('eaten');
        eatenCount++;
        
        const message = chocolate.dataset.message;
        chocolateMessage.textContent = message;
        chocolateMessage.classList.add('visible');
        
        setTimeout(() => {
            chocolateMessage.classList.remove('visible');
        }, 3000);
        
        if (eatenCount === chocolates.length) {
            setTimeout(() => {
                chocolateMessage.textContent = "You've discovered all my sweet messages! 🐱💕";
                chocolateMessage.classList.add('visible');
            }, 3500);
        }
    });
});

/* ================================
   Teddy Day
   ================================ */
const teddy = document.querySelector('.teddy');
const hugMessage = document.getElementById('hugMessage');

if (teddy) {
    teddy.addEventListener('click', () => {
        teddy.classList.add('hugged');
        
        setTimeout(() => {
            hugMessage.classList.add('visible');
            teddy.classList.remove('hugged');
        }, 1200);
    });
}

/* ================================
   Promise Day
   ================================ */
const signButton = document.getElementById('signButton');
const signature = document.getElementById('signature');

if (signButton) {
    signButton.addEventListener('click', () => {
        signature.classList.add('visible');
        signButton.style.display = 'none';
    });
}

/* ================================
   Hug Day
   ================================ */
const hugButton = document.getElementById('hugButton');
const warmthOverlay = document.getElementById('warmthOverlay');

if (hugButton) {
    hugButton.addEventListener('click', () => {
        warmthOverlay.classList.add('active');
        
        setTimeout(() => {
            warmthOverlay.classList.remove('active');
        }, 3000);
    });
}

/* ================================
   Kiss Day
   ================================ */
const heartbeat = document.querySelector('.heartbeat');
const kissMessage = document.getElementById('kissMessage');

if (heartbeat) {
    heartbeat.addEventListener('click', () => {
        heartbeat.classList.add('beating');
        
        setTimeout(() => {
            kissMessage.classList.add('visible');
            heartbeat.classList.remove('beating');
        }, 1500);
    });
}

/* ================================
   Valentine's Day - Reveal Sequence
   ================================ */
const revealStages = document.querySelectorAll('.reveal-stage');
let currentStage = 0;

function showNextStage() {
    if (currentStage < revealStages.length - 1) {
        revealStages[currentStage].classList.remove('active');
        currentStage++;
        revealStages[currentStage].classList.add('active');
        
        if (currentStage < revealStages.length - 1) {
            setTimeout(showNextStage, 2500);
        }
    }
}

// Auto-start reveal sequence when page loads
const revealSequence = document.getElementById('revealSequence');
if (revealSequence) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentStage = 0;
                setTimeout(showNextStage, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(revealSequence);
}

/* ================================
   Answer Buttons
   ================================ */
const yesButton = document.getElementById('yesButton');
const absolutelyButton = document.getElementById('absolutelyButton');
const celebration = document.getElementById('celebration');
const confettiContainer = document.getElementById('confettiContainer');

function startCelebration() {
    celebration.classList.add('active');
    createConfetti();
    updateProgress(8);
}

if (yesButton) {
    yesButton.addEventListener('click', startCelebration);
}

if (absolutelyButton) {
    absolutelyButton.addEventListener('click', startCelebration);
}

function createConfetti() {
    const confettiEmojis = ['🐱', '💕', '💖', '✨', '🎉', '💝', '🐾', '😻', '💗', '🌟'];
    const confettiCount = 50;
    
    function spawnConfetti() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
                
                // Random horizontal position
                const startX = Math.random() * 100;
                confetti.style.left = `${startX}%`;
                
                // Random horizontal drift
                const drift = (Math.random() - 0.5) * 300;
                confetti.style.setProperty('--drift', `${drift}px`);
                confetti.style.setProperty('--random-x', `${(Math.random() - 0.5) * 200}px`);
                
                // Random animation duration
                const duration = 3 + Math.random() * 2;
                confetti.style.animationDuration = `${duration}s`;
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), duration * 1000);
            }, i * 100);
        }
    }
    
    // Initial burst
    spawnConfetti();
    
    // Continue spawning
    const interval = setInterval(spawnConfetti, 1500);
    
    // Stop after 15 seconds
    setTimeout(() => clearInterval(interval), 15000);
}

/* ================================
   Photo Slideshow
   ================================ */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    updateDots();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', prevSlide);
}

if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', nextSlide);
}

// Auto-advance slideshow
let slideshowInterval;

function startSlideshow() {
    slideshowInterval = setInterval(nextSlide, 4000);
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

// Pause on hover
const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', stopSlideshow);
    slideshowContainer.addEventListener('mouseleave', startSlideshow);
}

// Slideshow Dots
function initializeSlideshowDots() {
    const slideDots = document.getElementById('slideDots');
    if (!slideDots) return;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
        
        slideDots.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Start slideshow when celebration is visible
const celebrationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startSlideshow();
        } else {
            stopSlideshow();
        }
    });
});

if (celebration) {
    celebrationObserver.observe(celebration);
}

/* ================================
   Easter Egg
   ================================ */
const easterEgg = document.getElementById('easterEgg');
const closeEaster = document.getElementById('closeEaster');
let clickCount = 0;
let clickTimer;

// Triple-click on progress indicator to reveal easter egg
const progressIndicator = document.getElementById('progressIndicator');
if (progressIndicator) {
    progressIndicator.addEventListener('click', () => {
        clickCount++;
        
        clearTimeout(clickTimer);
        
        if (clickCount === 3) {
            easterEgg.classList.add('active');
            clickCount = 0;
        }
        
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    });
}

if (closeEaster) {
    closeEaster.addEventListener('click', () => {
        easterEgg.classList.remove('active');
    });
}

// Close easter egg when clicking outside
if (easterEgg) {
    easterEgg.addEventListener('click', (e) => {
        if (e.target === easterEgg) {
            easterEgg.classList.remove('active');
        }
    });
}

/* ================================
   Keyboard Navigation
   ================================ */
document.addEventListener('keydown', (e) => {
    // Slideshow controls
    if (celebration.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
    
    // ESC to close easter egg
    if (e.key === 'Escape') {
        easterEgg.classList.remove('active');
    }
});

/* ================================
   Smooth Scroll Enhancement
   ================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ================================
   Performance Optimization
   ================================ */
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Reduce animations on mobile for better performance
if (window.innerWidth < 768) {
    document.documentElement.style.setProperty('--animation-speed', '0.5');
}

/* ================================
   Console Easter Egg
   ================================ */
console.log('%c🐱 Meow! You found a hidden message! 💕', 'color: #ff69b4; font-size: 20px; font-weight: bold;');
console.log('%cThis Valentine\'s website was crafted with love and purrs 🐾', 'color: #ff1493; font-size: 14px;');
console.log('%cMade for the most special person in the world 💖', 'color: #9d4edd; font-size: 14px; font-style: italic;');

/* ================================
   DEBUG: Check Unlocked Status
   (Remove in production)
   ================================ */
console.log('%c📅 Day Unlock Status:', 'color: #ff69b4; font-size: 14px; font-weight: bold;');
const today = new Date();
today.setHours(0, 0, 0, 0);

document.querySelectorAll('.day-card').forEach(card => {
    const dateStr = card.dataset.date;
    const cardDate = new Date(dateStr);
    cardDate.setHours(0, 0, 0, 0);
    const dayNum = card.dataset.day;
    const isUnlocked = today >= cardDate;
    
    console.log(`Day ${dayNum} (${dateStr}): ${isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}`);
});