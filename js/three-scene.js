// Three.js Scene Manager
class ThreeSceneManager {
    constructor() {
        this.scenes = {};
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.time = 0;
        
        this.init();
    }

    init() {
        this.createHeroScene();
        this.createAboutScene();
        this.createSkillsScene();
        this.setupEventListeners();
        this.animate();
    }

    createHeroScene() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        this.scenes.hero = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75, width / height, 0.1, 1000),
            renderer: new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }),
            objects: []
        };

        const scene = this.scenes.hero.scene;
        const camera = this.scenes.hero.camera;
        const renderer = this.scenes.hero.renderer;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // Main geometric mesh - Torus Knot
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00f5ff,
            emissive: 0x7b2fff,
            emissiveIntensity: 0.3,
            shininess: 100,
            wireframe: false
        });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);
        this.scenes.hero.objects.push(torusKnot);

        // Wireframe overlay
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x7b2fff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMat);
        wireframe.scale.setScalar(1.01);
        scene.add(wireframe);
        this.scenes.hero.objects.push(wireframe);

        // Icosahedron
        const icoGeometry = new THREE.IcosahedronGeometry(0.5, 0);
        const icoMaterial = new THREE.MeshPhongMaterial({
            color: 0x7b2fff,
            emissive: 0x00f5ff,
            emissiveIntensity: 0.2,
            flatShading: true
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(3, 2, -1);
        scene.add(icosahedron);
        this.scenes.hero.objects.push(icosahedron);

        // Particles
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            const color = Math.random() > 0.5 ? new THREE.Color(0x00f5ff) : new THREE.Color(0x7b2fff);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        this.scenes.hero.objects.push(particles);
        this.scenes.hero.particles = particles;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f5ff, 1.5, 20);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x7b2fff, 1.5, 20);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Background gradient
        const bgGeometry = new THREE.PlaneGeometry(50, 50);
        const bgMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(0x0a0a0f) },
                color2: { value: new THREE.Color(0x151520) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                }
            `,
            depthWrite: false
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        bgMesh.position.z = -10;
        bgMesh.renderOrder = -1;
        scene.add(bgMesh);

        this.scenes.hero.mouseTarget = { x: 0, y: 0 };
    }

    createAboutScene() {
        const canvas = document.getElementById('aboutCanvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        this.scenes.about = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75, width / height, 0.1, 1000),
            renderer: new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }),
            objects: []
        };

        const scene = this.scenes.about.scene;
        const camera = this.scenes.about.camera;
        const renderer = this.scenes.about.renderer;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 4;

        // Abstract silhouette - twisted torus
        const geometry = new THREE.TorusGeometry(1.5, 0.4, 32, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0a0a0f,
            emissive: 0x00f5ff,
            emissiveIntensity: 0.4,
            shininess: 80,
            transparent: true,
            opacity: 0.9
        });
        const torus = new THREE.Mesh(geometry, material);
        scene.add(torus);
        this.scenes.about.objects.push(torus);

        // Inner glow sphere
        const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x7b2fff,
            transparent: true,
            opacity: 0.6
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowSphere);
        this.scenes.about.objects.push(glowSphere);

        // Orbiting rings
        const ringGeometry = new THREE.RingGeometry(2, 2.1, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00f5ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(ringGeometry.clone(), ringMaterial.clone());
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            scene.add(ring);
            this.scenes.about.objects.push(ring);
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f5ff, 1.2, 15);
        pointLight.position.set(3, 3, 3);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x7b2fff, 1.2, 15);
        pointLight2.position.set(-3, -3, 3);
        scene.add(pointLight2);
    }

    createSkillsScene() {
        const canvas = document.getElementById('skillsCanvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        this.scenes.skills = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75, width / height, 0.1, 1000),
            renderer: new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }),
            objects: []
        };

        const scene = this.scenes.skills.scene;
        const camera = this.scenes.skills.camera;
        const renderer = this.scenes.skills.renderer;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 6;

        // Central sphere
        const sphereGeometry = new THREE.IcosahedronGeometry(1, 2);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x0a0a0f,
            emissive: 0x7b2fff,
            emissiveIntensity: 0.5,
            shininess: 100,
            flatShading: true
        });
        const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(centralSphere);
        this.scenes.skills.objects.push(centralSphere);

        // Orbiting skill "planets"
        const skills = ['React', 'TypeScript', 'Three.js', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL', 'CSS'];
        const skillGroup = new THREE.Group();

        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * Math.PI * 2;
            const radius = 2.5;
            
            const planetGeometry = new THREE.OctahedronGeometry(0.3, 0);
            const planetMaterial = new THREE.MeshPhongMaterial({
                color: index % 2 === 0 ? 0x00f5ff : 0x7b2fff,
                emissive: index % 2 === 0 ? 0x00f5ff : 0x7b2fff,
                emissiveIntensity: 0.3,
                flatShading: true
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            planet.position.x = Math.cos(angle) * radius;
            planet.position.y = Math.sin(angle) * radius;
            planet.position.z = Math.sin(angle * 2) * 0.5;
            
            planet.userData = { 
                angle, 
                radius, 
                speed: 0.3 + Math.random() * 0.2,
                yOffset: Math.random() * Math.PI * 2
            };
            
            skillGroup.add(planet);
            this.scenes.skills.objects.push(planet);
        });

        scene.add(skillGroup);
        this.scenes.skills.skillGroup = skillGroup;

        // Connection lines
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f5ff,
            transparent: true,
            opacity: 0.2
        });

        for (let i = 0; i < skills.length; i++) {
            const nextIndex = (i + 1) % skills.length;
            const points = [];
            
            const angle1 = (i / skills.length) * Math.PI * 2;
            const angle2 = (nextIndex / skills.length) * Math.PI * 2;
            const radius = 2.5;
            
            points.push(new THREE.Vector3(
                Math.cos(angle1) * radius,
                Math.sin(angle1) * radius,
                0
            ));
            points.push(new THREE.Vector3(
                Math.cos(angle2) * radius,
                Math.sin(angle2) * radius,
                0
            ));
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            this.scenes.skills.objects.push(line);
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f5ff, 1.5, 20);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x7b2fff, 1.5, 20);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            if (this.scenes.hero) {
                this.scenes.hero.mouseTarget.x = this.mouse.x * 0.5;
                this.scenes.hero.mouseTarget.y = this.mouse.y * 0.5;
            }
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        Object.keys(this.scenes).forEach(key => {
            const scene = this.scenes[key];
            if (!scene) return;
            
            const container = scene.renderer.domElement.parentElement;
            if (!container) return;
            
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            scene.camera.aspect = width / height;
            scene.camera.updateProjectionMatrix();
            scene.renderer.setSize(width, height);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;

        // Animate hero scene
        if (this.scenes.hero) {
            const { scene, objects, camera, mouseTarget } = this.scenes.hero;
            
            // Rotate main objects
            if (objects[0]) {
                objects[0].rotation.x += 0.003;
                objects[0].rotation.y += 0.005;
            }
            if (objects[1]) {
                objects[1].rotation.x += 0.003;
                objects[1].rotation.y += 0.005;
            }
            if (objects[2]) {
                objects[2].rotation.x += 0.01;
                objects[2].rotation.y += 0.01;
            }
            
            // Mouse interaction with raycasting
            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObjects(objects.slice(0, 2));
            
            objects.forEach((obj, i) => {
                if (i < 2) {
                    obj.rotation.x += (mouseTarget.y * 0.5 - obj.rotation.x) * 0.05;
                    obj.rotation.y += (mouseTarget.x * 0.5 - obj.rotation.y) * 0.05;
                }
            });
            
            // Animate particles
            if (objects[3]) {
                objects[3].rotation.y += 0.0005;
            }
            
            this.scenes.hero.renderer.render(scene, camera);
        }

        // Animate about scene
        if (this.scenes.about) {
            const { scene, objects, renderer, camera } = this.scenes.about;
            
            if (objects[0]) {
                objects[0].rotation.x += 0.005;
                objects[0].rotation.y += 0.008;
            }
            if (objects[1]) {
                objects[1].rotation.x -= 0.003;
                objects[1].rotation.y += 0.005;
            }
            
            // Animate rings
            for (let i = 2; i < 5; i++) {
                if (objects[i]) {
                    objects[i].rotation.z += 0.002 * (i - 1);
                }
            }
            
            renderer.render(scene, camera);
        }

        // Animate skills scene
        if (this.scenes.skills) {
            const { scene, objects, skillGroup, renderer, camera } = this.scenes.skills;
            
            if (objects[0]) {
                objects[0].rotation.x += 0.005;
                objects[0].rotation.y += 0.003;
            }
            
            // Animate orbiting planets
            if (skillGroup) {
                skillGroup.rotation.z += 0.002;
                
                skillGroup.children.forEach((planet, i) => {
                    const { angle, radius, speed, yOffset } = planet.userData;
                    planet.position.x = Math.cos(angle + this.time * speed) * radius;
                    planet.position.y = Math.sin(angle + this.time * speed) * radius;
                    planet.position.z = Math.sin(angle * 2 + this.time * speed + yOffset) * 0.8;
                    planet.rotation.x += 0.02;
                    planet.rotation.y += 0.03;
                });
            }
            
            renderer.render(scene, camera);
        }
    }
}

// Initialize Three.js scenes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.threeSceneManager = new ThreeSceneManager();
});
