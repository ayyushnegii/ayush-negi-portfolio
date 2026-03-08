// Site Data Manager - Handles all localStorage operations
const SiteData = {
    STORAGE_KEY: 'portfolio_data',
    
    // Default data fallback
    defaults: {
        profile: {
            name: "Alex Rivera",
            title: "Full Stack Developer & Creative Coder",
            bio: "I'm a Full Stack Developer and Creative Coder based in the digital realm. With over 5 years of experience, I craft immersive web experiences that push the boundaries of what's possible in the browser.",
            bio2: "My journey began with a fascination for how code can transform into art. Today, I specialize in building 3D web experiences, interactive interfaces, and scalable applications that leave lasting impressions.",
            bio3: "When I'm not coding, you'll find me exploring the intersection of technology and design, creating digital experiences that inspire and captivate.",
            location: "San Francisco, CA",
            email: "alex@portfolio.dev",
            avatar: null
        },
        skills: [
            { id: 1, name: "React", percentage: 95, icon: "react" },
            { id: 2, name: "TypeScript", percentage: 90, icon: "typescript" },
            { id: 3, name: "Three.js", percentage: 88, icon: "threejs" },
            { id: 4, name: "Node.js", percentage: 92, icon: "node" },
            { id: 5, name: "Python", percentage: 85, icon: "python" },
            { id: 6, name: "PostgreSQL", percentage: 82, icon: "postgres" },
            { id: 7, name: "GraphQL", percentage: 80, icon: "graphql" },
            { id: 8, name: "CSS/SASS", percentage: 94, icon: "css" }
        ],
        projects: [
            {
                id: 1,
                title: "Cosmic Dreams",
                description: "An immersive 3D space exploration platform featuring procedurally generated galaxies, real-time star rendering, and interactive spacecraft controls.",
                tags: ["Three.js", "WebGL", "GSAP"],
                liveUrl: "#",
                githubUrl: "#",
                image: null,
                visible: true
            },
            {
                id: 2,
                title: "Neural Canvas",
                description: "A creative coding suite for AI-assisted artwork generation. Users can create, customize, and export unique digital artworks powered by machine learning.",
                tags: ["React", "TensorFlow", "Canvas"],
                liveUrl: "#",
                githubUrl: "#",
                image: null,
                visible: true
            },
            {
                id: 3,
                title: "Crypto Vault",
                description: "A secure cryptocurrency portfolio tracker with real-time price updates, interactive charts, and advanced analytics for DeFi investments.",
                tags: ["Next.js", "Web3", "Chart.js"],
                liveUrl: "#",
                githubUrl: "#",
                image: null,
                visible: true
            },
            {
                id: 4,
                title: "Sound Forge",
                description: "A web-based digital audio workstation with real-time synthesis, effects processing, and MIDI controller support for music production.",
                tags: ["Web Audio", "Canvas", "React"],
                liveUrl: "#",
                githubUrl: "#",
                image: null,
                visible: true
            }
        ],
        experience: [
            {
                id: 1,
                date: "2023 - Present",
                title: "Senior Full Stack Developer",
                company: "Quantum Labs",
                description: "Leading development of next-generation web applications. Architecting scalable solutions and mentoring junior developers."
            },
            {
                id: 2,
                date: "2021 - 2023",
                title: "Full Stack Developer",
                company: "Neon Digital",
                description: "Built interactive 3D web experiences for Fortune 500 clients. Implemented real-time collaboration features."
            },
            {
                id: 3,
                date: "2019 - 2021",
                title: "Frontend Developer",
                company: "Pixel Perfect Studios",
                description: "Developed responsive, accessible web interfaces. Specialized in animations and micro-interactions."
            },
            {
                id: 4,
                date: "2018 - 2019",
                title: "Junior Developer",
                company: "StartUp Inc.",
                description: "Started my professional journey building MVPs and learning modern web technologies."
            }
        ],
        contact: {
            email: "alex@portfolio.dev",
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
        },
        settings: {
            siteTitle: "Alex Rivera | Full Stack Developer & Creative Coder",
            favicon: "AR",
            sections: {
                about: true,
                skills: true,
                projects: true,
                experience: true,
                contact: true
            }
        },
        stats: {
            projects: 50,
            years: 5,
            clients: 30
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
