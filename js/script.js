/* ================================
   Valentine Week Website - JavaScript
   ================================ */

// ================================
// Configuration & State
// ================================
let currentSlide = 0;
let musicPlaying = false;
let easterEggClicks = 0;
let easterEggTimer = null;

// Date configuration - Valentine Week 2026
const valentineDates = [
    { day: 1, date: new Date('2026-02-07'), name: 'Rose Day' },
    { day: 2, date: new Date('2026-02-08'), name: 'Propose Day' },
    { day: 3, date: new Date('2026-02-09'), name: 'Chocolate Day' },
    { day: 4, date: new Date('2026-02-10'), name: 'Teddy Day' },
    { day: 5, date: new Date('2026-02-11'), name: 'Promise Day' },
    { day: 6, date: new Date('2026-02-12'), name: 'Hug Day' },
    { day: 7, date: new Date('2026-02-13'), name: 'Kiss Day' },
    { day: 8, date: new Date('2026-02-14'), name: "Valentine's Day" }
];

// ================================
// Initialization
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    createParticles();
    checkAndUnlockDays();
    updateProgressIndicator();
});

// ================================
// App Initialization
// ================================
function initializeApp() {
    console.log('Valentine Week Website Initialized! 💕');
    
    // Set up slideshow dots
    initializeSlideshow();
    
    // Check if it's Valentine's Day and if the user already said yes
    const valentineComplete = localStorage.getItem('valentineComplete');
    if (valentineComplete === 'true') {
        // Show celebration page if already completed
        const currentDate = new Date();
        const valentineDate = new Date('2026-02-14');
        if (currentDate >= valentineDate) {
            showPage('day8');
            showCelebration();
        }
    }
}

// ================================
// Event Listeners
// ================================
function setupEventListeners() {
    // Landing page - Begin Journey button
    const beginButton = document.getElementById('beginJourney');
    if (beginButton) {
        beginButton.addEventListener('click', () => {
            showPage('timeline');
        });
    }
    
    // Back to Landing button
    const backToLanding = document.getElementById('backToLanding');
    if (backToLanding) {
        backToLanding.addEventListener('click', () => {
            showPage('landing');
        });
    }
    
    // Music toggle
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Day cards - click to open
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                const day = this.getAttribute('data-day');
                openDay(day);
            }
        });
    });
    
    // Rose Day - Rose click
    const rose = document.getElementById('mainRose');
    if (rose) {
        rose.addEventListener('click', function() {
            this.classList.add('clicked');
            createPetals();
            setTimeout(() => {
                document.getElementById('roseMessage').classList.add('visible');
            }, 1000);
        });
    }
    
    // Propose Day - Envelope click
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.addEventListener('click', function() {
            this.classList.add('opened');
        });
    }
    
    // Chocolate Day - Chocolate clicks
    const chocolates = document.querySelectorAll('.chocolate');
    chocolates.forEach(chocolate => {
        chocolate.addEventListener('click', function() {
            if (!this.classList.contains('eaten')) {
                const message = this.getAttribute('data-message');
                const messageEl = document.getElementById('chocolateMessage');
                messageEl.textContent = message;
                messageEl.classList.add('visible');
                this.classList.add('eaten');
                
                setTimeout(() => {
                    this.style.visibility = 'hidden';
                }, 500);
            }
        });
    });
    
    // Teddy Day - Teddy click
    const teddy = document.querySelector('.teddy');
    if (teddy) {
        teddy.addEventListener('click', function() {
            this.classList.add('hugged');
            setTimeout(() => {
                document.getElementById('hugMessage').classList.add('visible');
                this.classList.remove('hugged');
            }, 1000);
        });
    }
    
    // Promise Day - Sign button
    const signButton = document.getElementById('signButton');
    if (signButton) {
        signButton.addEventListener('click', function() {
            document.getElementById('signature').classList.add('visible');
            this.style.display = 'none';
        });
    }
    
    // Hug Day - Hug button
    const hugButton = document.getElementById('hugButton');
    if (hugButton) {
        hugButton.addEventListener('click', function() {
            const overlay = document.getElementById('warmthOverlay');
            overlay.classList.add('active');
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 3000);
        });
    }
    
    // Kiss Day - Heartbeat click
    const heartbeat = document.getElementById('heartbeatContainer');
    if (heartbeat) {
        heartbeat.addEventListener('click', function() {
            const heart = this.querySelector('.heartbeat');
            heart.classList.add('beating');
            setTimeout(() => {
                document.getElementById('kissMessage').classList.add('visible');
                heart.classList.remove('beating');
            }, 1500);
        });
    }
    
    // Valentine's Day - Answer buttons
    const yesButton = document.getElementById('yesButton');
    const absolutelyButton = document.getElementById('absolutelyButton');
    
    if (yesButton) {
        yesButton.addEventListener('click', handleYesClick);
    }
    
    if (absolutelyButton) {
        absolutelyButton.addEventListener('click', handleYesClick);
    }
    
    // Slideshow controls
    const prevSlide = document.getElementById('prevSlide');
    const nextSlide = document.getElementById('nextSlide');
    
    if (prevSlide) {
        prevSlide.addEventListener('click', () => changeSlide(-1));
    }
    
    if (nextSlide) {
        nextSlide.addEventListener('click', () => changeSlide(1));
    }
    
    // Easter egg - multiple heart clicks
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('heartbeat') || 
            e.target.classList.contains('rose') ||
            e.target.textContent.includes('❤️') ||
            e.target.textContent.includes('💕')) {
            handleEasterEggClick();
        }
    });
    
    // Close easter egg modal
    const closeEaster = document.getElementById('closeEaster');
    if (closeEaster) {
        closeEaster.addEventListener('click', () => {
            document.getElementById('easterEgg').classList.remove('active');
        });
    }
}

// ================================
// Date Checking & Unlocking Logic
// ================================
function checkAndUnlockDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    
    // For testing purposes, you can uncomment the line below to unlock all days
    // today.setDate(today.getDate() + 30); // This will unlock all days
    
    valentineDates.forEach(({ day, date }) => {
        const card = document.querySelector(`.day-card[data-day="${day}"]`);
        if (!card) return;
        
        // Check if the current date is >= the day's date
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);
        
        if (today >= dayDate) {
            // Unlock the day
            card.classList.remove('locked');
        } else {
            // Keep locked
            card.classList.add('locked');
        }
    });
}

// ================================
// Progress Indicator
// ================================
function updateProgressIndicator() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let unlockedDays = 0;
    
    valentineDates.forEach(({ date }) => {
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);
        if (today >= dayDate) {
            unlockedDays++;
        }
    });
    
    const currentDayEl = document.getElementById('currentDay');
    const progressFill = document.getElementById('progressFill');
    
    if (currentDayEl) {
        currentDayEl.textContent = unlockedDays;
    }
    
    if (progressFill) {
        const percentage = (unlockedDays / 8) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

// ================================
// Page Navigation
// ================================
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Special handling for Valentine's Day reveal
    if (pageId === 'day8') {
        startValentineReveal();
    }
}

function openDay(day) {
    showPage(`day${day}`);
}

function goToTimeline() {
    showPage('timeline');
}

function nextDay(day) {
    // Check if the next day is unlocked
    const nextCard = document.querySelector(`.day-card[data-day="${day}"]`);
    if (nextCard && !nextCard.classList.contains('locked')) {
        showPage(`day${day}`);
    } else {
        alert('This day hasn\'t arrived yet! Patience, love is on its way 💕');
    }
}

function previousDay(day) {
    showPage(`day${day}`);
}

// ================================
// Music Toggle
// ================================
function toggleMusic() {
    const musicToggle = document.getElementById('musicToggle');
    
    if (musicPlaying) {
        // Stop music (if you have audio implemented)
        musicToggle.classList.remove('playing');
        musicPlaying = false;
    } else {
        // Play music (if you have audio implemented)
        // You can add: const audio = new Audio('assets/background-music.mp3');
        // audio.loop = true;
        // audio.play();
        musicToggle.classList.add('playing');
        musicPlaying = true;
    }
    
    // Note: To add actual music, uncomment and implement audio functionality:
    // const audio = document.getElementById('backgroundMusic');
    // if (audio) {
    //     if (musicPlaying) {
    //         audio.pause();
    //     } else {
    //         audio.play();
    //     }
    // }
}

// ================================
// Particle Animation (Landing Page)
// ================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particles = ['❤️', '💕', '💖', '💗', '💝', '🌹', '💐'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        particlesContainer.appendChild(particle);
    }
}

// ================================
// Rose Petals Animation
// ================================
function createPetals() {
    const petals = ['🌹', '🌺', '🌸', '🌼', '💮'];
    const petalCount = 30;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDelay = `${Math.random() * 1}s`;
        petal.style.animationDuration = `${3 + Math.random() * 2}s`;
        document.body.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 5000);
    }
}

// ================================
// Valentine's Day Reveal Sequence
// ================================
function startValentineReveal() {
    const stages = [
        { id: 'stage1', delay: 0 },
        { id: 'stage2', delay: 3000 },
        { id: 'stage3', delay: 6000 },
        { id: 'stage4', delay: 9000 },
        { id: 'stage5', delay: 12000 }
    ];
    
    // Check if already completed
    const valentineComplete = localStorage.getItem('valentineComplete');
    if (valentineComplete === 'true') {
        showCelebration();
        return;
    }
    
    // Hide all stages first
    stages.forEach(({ id }) => {
        const stage = document.getElementById(id);
        if (stage) {
            stage.classList.remove('active');
        }
    });
    
    // Show stages sequentially
    stages.forEach(({ id, delay }) => {
        setTimeout(() => {
            const stage = document.getElementById(id);
            if (stage) {
                // Hide previous stage
                stages.forEach(({ id: prevId }) => {
                    if (prevId !== id) {
                        const prevStage = document.getElementById(prevId);
                        if (prevStage) {
                            prevStage.classList.remove('active');
                        }
                    }
                });
                
                // Show current stage
                stage.classList.add('active');
            }
        }, delay);
    });
}

// ================================
// Handle "YES" Click
// ================================
function handleYesClick() {
    localStorage.setItem('valentineComplete', 'true');
    showCelebration();
}

// ================================
// Show Celebration
// ================================
function showCelebration() {
    const revealSequence = document.getElementById('revealSequence');
    const celebration = document.getElementById('celebration');
    
    if (revealSequence) {
        revealSequence.style.display = 'none';
    }
    
    if (celebration) {
        celebration.classList.add('active');
        createConfetti();
        
        // Show slideshow automatically
        showSlide(0);
    }
}

// ================================
// Confetti Animation
// ================================
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;
    
    const emojis = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '🌹', '💐', '🎉', '🎊', '✨'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Continue creating confetti
    setTimeout(() => {
        if (document.getElementById('celebration').classList.contains('active')) {
            createConfetti();
        }
    }, 3000);
}

// ================================
// Slideshow Functions
// ================================
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideDots');
    
    if (!dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    
    // Activate current dot
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// ================================
// Easter Egg
// ================================
function handleEasterEggClick() {
    easterEggClicks++;
    
    // Clear previous timer
    if (easterEggTimer) {
        clearTimeout(easterEggTimer);
    }
    
    // Reset counter after 2 seconds of no clicks
    easterEggTimer = setTimeout(() => {
        easterEggClicks = 0;
    }, 2000);
    
    // Show easter egg after 10 clicks
    if (easterEggClicks >= 10) {
        const easterEgg = document.getElementById('easterEgg');
        if (easterEgg) {
            easterEgg.classList.add('active');
        }
        easterEggClicks = 0;
    }
}

// ================================
// Utility Functions
// ================================

// Format date for display
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Check if date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Add smooth scroll behavior
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

// ================================
// Console Easter Egg
// ================================
console.log('%c💝 Made with Love 💝', 'font-size: 20px; color: #ff6b9d; font-weight: bold;');
console.log('%cHappy Valentine\'s Day! 🌹', 'font-size: 16px; color: #c41e3a;');
console.log('%cThis website was crafted with care for someone special...', 'font-size: 12px; color: #6b4f4f; font-style: italic;');

// ================================
// Testing Helper (Remove in production)
// ================================
// Uncomment this function to test all days unlocked
/*
window.unlockAllDays = function() {
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        card.classList.remove('locked');
    });
    updateProgressIndicator();
    console.log('All days unlocked for testing!');
};
*/

// ================================
// Performance Optimization
// ================================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ================================
// Export functions for HTML onclick handlers
// ================================
window.goToTimeline = goToTimeline;
window.nextDay = nextDay;
window.previousDay = previousDay;
window.showPage = showPage;