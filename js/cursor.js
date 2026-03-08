// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('customCursor');
        this.dot = this.cursor?.querySelector('.cursor-dot');
        this.ring = this.cursor?.querySelector('.cursor-ring');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.ringX = 0;
        this.ringY = 0;
        
        this.isHovering = false;
        this.hoverElements = [];
        
        this.init();
    }

    init() {
        if (!this.cursor) return;
        
        this.addEventListeners();
        this.detectHoverElements();
        this.animate();
    }

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Handle link/button hover states
        const hoverSelectors = [
            'a', 'button', 'input', 'textarea', 
            '[data-magnetic]', '.project-card', 
            '.skill-card', '.timeline-content'
        ];

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const matchesSelector = hoverSelectors.some(selector => {
                try {
                    return target.matches(selector) || target.closest(selector);
                } catch (e) {
                    return false;
                }
            });
            
            if (matchesSelector) {
                this.setHover(true);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            const related = e.relatedTarget;
            
            if (related && related.closest) {
                const stillOnHover = hoverSelectors.some(selector => {
                    try {
                        return related.matches(selector) || related.closest(selector);
                    } catch (e) {
                        return false;
                    }
                });
                
                if (!stillOnHover) {
                    this.setHover(false);
                }
            }
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }

    detectHoverElements() {
        const observer = new MutationObserver(() => {
            this.hoverElements = document.querySelectorAll(
                'a, button, input, textarea, [data-magnetic], .project-card, .skill-card, .timeline-content'
            );
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setHover(isHovering) {
        this.isHovering = isHovering;
        
        if (isHovering) {
            this.cursor.classList.add('hover');
        } else {
            this.cursor.classList.remove('hover');
        }
    }

    animate() {
        // Smooth follow for dot
        this.dotX += (this.mouseX - this.dotX) * 0.2;
        this.dotY += (this.mouseY - this.dotY) * 0.2;

        // Smoother follow for ring with delay
        this.ringX += (this.mouseX - this.ringX) * 0.1;
        this.ringY += (this.mouseY - this.ringY) * 0.1;

        if (this.dot) {
            this.dot.style.left = this.dotX + 'px';
            this.dot.style.top = this.dotY + 'px';
        }

        if (this.ring) {
            this.ring.style.left = this.ringX + 'px';
            this.ring.style.top = this.ringY + 'px';
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Magnetic Effect for buttons and links
class MagneticEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-magnetic]');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            this.addListeners(el);
        });
    }

    addListeners(el) {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.2s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.customCursor = new CustomCursor();
    window.magneticEffect = new MagneticEffect();
});
