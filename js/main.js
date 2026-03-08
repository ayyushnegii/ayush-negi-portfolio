// Main Application
class PortfolioApp {
    constructor() {
        this.loader = document.getElementById('loader');
        this.progressFill = document.getElementById('progressFill');
        this.loaderPercent = document.getElementById('loaderPercent');
        this.nav = document.getElementById('nav');
        
        this.init();
    }

    init() {
        this.setupLoader();
        this.setupNavigation();
        this.setupTypewriter();
        this.setupGSAP();
        this.setupVanillaTilt();
        this.setupContactForm();
        this.setupScrollEffects();
    }

    // Loading Screen
    setupLoader() {
        const progress = { value: 0 };
        
        const animateProgress = () => {
            progress.value += Math.random() * 15 + 5;
            
            if (progress.value >= 100) {
                progress.value = 100;
                this.completeLoading();
            } else {
                this.progressFill.style.width = progress.value + '%';
                this.loaderPercent.textContent = Math.floor(progress.value) + '%';
                setTimeout(animateProgress, 200 + Math.random() * 200);
            }
        };

        setTimeout(animateProgress, 500);
    }

    completeLoading() {
        gsap.to(this.loader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                this.loader.style.display = 'none';
                this.animateHero();
            }
        });
    }

    // Navigation
    setupNavigation() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Mobile nav toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    // Typewriter Effect
    setupTypewriter() {
        const text = "Ideas. Designed and built.";
        const typewriter = document.getElementById('typewriter');
        
        if (!typewriter) return;
        
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                typewriter.textContent += text.charAt(index);
                index++;
                setTimeout(type, 80 + Math.random() * 40);
            }
        };
        
        setTimeout(type, 1500);
    }

    // GSAP Animations
    setupGSAP() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial animations are triggered after loader completes
    }

    animateHero() {
        const tl = gsap.timeline();

        // Animate title lines
        tl.from('.title-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-cta', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');

        // Setup section animations
        this.setupSectionAnimations();
    }

    setupSectionAnimations() {
        // Section title character reveal
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title.querySelectorAll('.title-char'), {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'back.out(1.7)'
            });
        });

        // About section
        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.about-visual', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8');

        // About stats counter
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const target = parseInt(stat.dataset.count);
            
            gsap.to(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power2.out'
            });
        });

        // Skills section
        gsap.from('.skills-orbit', {
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out'
            });
        });

        // Projects section
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: '.projects-grid',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // Experience timeline
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.2,
                ease: 'power2.out'
            });
        });

        // Contact section
        gsap.from('.contact-info', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8');
    }

    // VanillaTilt for 3D card effects
    setupVanillaTilt() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(tiltElements, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.3,
                perspective: 1000,
                transition: true
            });
        }
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.querySelector('.btn-text').textContent;
            
            // Simulate sending
            btn.querySelector('.btn-text').textContent = 'Sending...';
            
            setTimeout(() => {
                btn.classList.add('success');
                btn.querySelector('.btn-text').textContent = 'Message Sent!';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    btn.classList.remove('success');
                    btn.querySelector('.btn-text').textContent = originalText;
                }, 3000);
            }, 1500);
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        // Parallax for hero section
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 200,
            opacity: 0
        });

        // About section parallax
        gsap.to('.about-visual', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50
        });

        // Skills orbit parallax
        gsap.to('.skills-orbit', {
            scrollTrigger: {
                trigger: '.skills',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -100
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Add smooth scroll polyfill for older browsers
if (!window.scrollTo) {
    window.scrollTo = function(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
}
