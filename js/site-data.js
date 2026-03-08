// Site Data Manager - Handles all localStorage operations
const SiteData = {
    STORAGE_KEY: 'portfolio_data',
    
    // Default data fallback
    defaults: {
        profile: {
            name: "Ayush Negi",
            title: "UI/UX Designer & Creative Mind",
            bio: "I'm Ayush, a curious mind who enjoys exploring ideas and turning them into digital creations. Through design, experimentation, and a little vibe coding, I build things that reflect both creativity and thoughtful problem-solving.",
            bio2: "I work with Figma for UI/UX design, Lightroom and Photoshop for photo editing, and illustration — blending visual craft with just enough code to bring ideas to life on the web.",
            bio3: "I study philosophy and psychology, which shapes how I think about design — always asking why something feels right, not just whether it looks good.",
            location: "Uttarakhand, India",
            email: "ayyushnegi@gmail.com",
            avatar: null
        },
        skills: [
            { id: 1, name: "Figma", percentage: 75, icon: "figma" },
            { id: 2, name: "Adobe Photoshop", percentage: 70, icon: "photoshop" },
            { id: 3, name: "Lightroom", percentage: 72, icon: "lightroom" },
            { id: 4, name: "Illustration", percentage: 65, icon: "illustration" },
            { id: 5, name: "HTML / CSS", percentage: 60, icon: "css" },
            { id: 6, name: "JavaScript", percentage: 45, icon: "javascript" },
            { id: 7, name: "Philosophy & Psychology", percentage: 80, icon: "philosophy" },
            { id: 8, name: "Vibe Coding", percentage: 70, icon: "code" }
        ],
        projects: [
            {
                id: 1,
                title: "This Portfolio",
                description: "A personal portfolio site built through experimentation and vibe coding — featuring 3D animations, an admin CMS, and a design that reflects my creative approach.",
                tags: ["HTML", "CSS", "JavaScript", "Three.js"],
                liveUrl: "#",
                githubUrl: "https://github.com/ayyushnegii/ayush-negi-portfolio",
                image: null,
                visible: true
            }
        ],
        experience: [
            {
                id: 1,
                date: "2024 - Present",
                title: "Self-Taught Designer & Creator",
                company: "Independent",
                description: "Exploring UI/UX design, photo editing, and creative coding on my own terms. Building small projects, experimenting with ideas, and developing a personal design language."
            },
            {
                id: 2,
                date: "2024 - Present",
                title: "Philosophy & Psychology Student",
                company: "University",
                description: "Studying the way humans think, feel, and perceive the world — bringing those insights into every design decision I make."
            }
        ],
        contact: {
            email: "ayyushnegi@gmail.com",
            github: "https://github.com/ayyushnegii",
            linkedin: "https://linkedin.com/in/ayyushnegii",
            twitter: "https://twitter.com/ayyushnegii"
        },
        settings: {
            siteTitle: "Ayush Negi | UI/UX Designer & Creative Mind",
            favicon: "AN",
            sections: {
                about: true,
                skills: true,
                projects: true,
                experience: true,
                contact: true
            }
        },
        stats: {
            projects: 3,
            years: 1,
            clients: 0
        }
    },

    // Get all data or defaults
    getAll() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.defaults;
    },

    // Get specific section
    get(section) {
        const data = this.getAll();
        return data[section] || this.defaults[section];
    },

    // Save all data
    saveAll(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Save specific section
    save(section, value) {
        const data = this.getAll();
        data[section] = value;
        this.saveAll(data);
    },

    // Update specific field
    update(section, field, value) {
        const data = this.getAll();
        if (data[section]) {
            data[section][field] = value;
            this.saveAll(data);
        }
    },

    // Check if data exists
    hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    // Reset to defaults
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // Export data as JSON
    export() {
        const data = this.getAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-data.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    // Import data from JSON
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveAll(data);
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    }
};

// Make globally available
window.SiteData = SiteData;
