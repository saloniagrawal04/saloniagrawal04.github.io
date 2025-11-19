/* ===================================
   MINIMAL ACADEMIC WEBSITE JAVASCRIPT
   Background simulation + interactions
   =================================== */

// ==========================================
// SMOOTH SCROLLING & ACTIVE NAV HIGHLIGHTING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initBackgroundSimulation();
    initResearchCards();
    initModal();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// BACKGROUND SIMULATION: BLACK HOLE + GALAXY
// ==========================================

function initBackgroundSimulation() {
    const canvas = document.getElementById('bg-simulation');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simulation parameters
    const blackHole = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        mass: 1000
    };

    const particles = [];
    const numParticles = 150;
    const numStars = 50;

    // Particle class for accretion disk
    class Particle {
        constructor() {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 300;
            this.x = blackHole.x + Math.cos(angle) * distance;
            this.y = blackHole.y + Math.sin(angle) * distance;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = Math.random() > 0.5 ? '#60a5fa' : '#818cf8';
        }

        update() {
            // Calculate gravitational force
            const dx = blackHole.x - this.x;
            const dy = blackHole.y - this.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Prevent division by zero
            if (dist < 5) {
                this.reset();
                return;
            }

            // Gravitational acceleration
            const force = blackHole.mass / distSq;
            const ax = (dx / dist) * force;
            const ay = (dy / dist) * force;

            // Update velocity and position
            this.vx += ax * 0.01;
            this.vy += ay * 0.01;

            // Add tangential velocity for orbital motion
            const tangentX = -dy / dist;
            const tangentY = dx / dist;
            this.vx += tangentX * 0.5;
            this.vy += tangentY * 0.5;

            // Apply velocity damping
            this.vx *= 0.99;
            this.vy *= 0.99;

            this.x += this.vx;
            this.y += this.vy;

            // Reset if too far
            if (dist > 600) {
                this.reset();
            }
        }

        reset() {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 300;
            this.x = blackHole.x + Math.cos(angle) * distance;
            this.y = blackHole.y + Math.sin(angle) * distance;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
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

    // Star class for background
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.twinklePhase += this.twinkleSpeed;
            this.opacity = 0.3 + Math.sin(this.twinklePhase) * 0.3;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Initialize particles and stars
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    // Animation loop
    function animate() {
        // Update black hole position to center
        blackHole.x = canvas.width / 2;
        blackHole.y = canvas.height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Draw black hole (event horizon)
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, 15, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            blackHole.x, blackHole.y, 0,
            blackHole.x, blackHole.y, 30
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.3)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw AGN outflow jets (subtle lines)
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(blackHole.x, blackHole.y - 15);
        ctx.lineTo(blackHole.x, blackHole.y - 200);
        ctx.moveTo(blackHole.x, blackHole.y + 15);
        ctx.lineTo(blackHole.x, blackHole.y + 200);
        ctx.stroke();

        requestAnimationFrame(animate);
    }

    animate();
}

// ==========================================
// RESEARCH CARD ANIMATIONS
// ==========================================

function initResearchCards() {
    // AGN Outflow Animation
    animateAGN();

    // Globular Cluster Animation
    animateGC();

    // Dark Matter Animation
    animateDM();

    // Machine Learning Animation
    animateML();
}

function animateAGN() {
    const container = document.getElementById('agn-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let angle = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw bicone outline
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 40, cy - 60);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 40, cy - 60);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 40, cy + 60);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 40, cy + 60);
        ctx.stroke();

        // Animated outflow particles
        for (let i = 0; i < 5; i++) {
            const offset = (angle + i * 30) % 60;
            const y1 = cy - 10 - offset;
            const y2 = cy + 10 + offset;

            ctx.fillStyle = `rgba(96, 165, 250, ${1 - offset / 60})`;
            ctx.beginPath();
            ctx.arc(cx, y1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, y2, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        angle = (angle + 1) % 60;
        requestAnimationFrame(draw);
    }

    draw();
}

function animateGC() {
    const container = document.getElementById('gc-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const stars = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 20; i++) {
        stars.push({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 50 + 10,
            speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
            size: Math.random() * 2 + 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw center
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw orbiting stars
        stars.forEach(star => {
            star.angle += star.speed;
            const x = cx + Math.cos(star.angle) * star.radius;
            const y = cy + Math.sin(star.angle) * star.radius * 0.6;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

function animateDM() {
    const container = document.getElementById('dm-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let pulsePhase = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detector grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 20; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, canvas.height - 20);
            ctx.stroke();
        }

        // Draw pulse
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = (Math.sin(pulsePhase) * 0.5 + 0.5) * 30 + 10;

        ctx.fillStyle = `rgba(129, 140, 248, ${1 - (radius - 10) / 30})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        pulsePhase += 0.05;
        requestAnimationFrame(draw);
    }

    draw();
}

function animateML() {
    const container = document.getElementById('ml-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const nodes = [];
    const layers = [4, 6, 6, 3];
    const layerSpacing = canvas.width / (layers.length + 1);

    // Create neural network nodes
    layers.forEach((count, layerIndex) => {
        const x = layerSpacing * (layerIndex + 1);
        const nodeSpacing = canvas.height / (count + 1);

        for (let i = 0; i < count; i++) {
            nodes.push({
                x: x,
                y: nodeSpacing * (i + 1),
                layer: layerIndex,
                activation: Math.random()
            });
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.1)';
        ctx.lineWidth = 1;
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (otherNode.layer === node.layer + 1) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                }
            });
        });

        // Draw nodes
        nodes.forEach(node => {
            node.activation = 0.3 + Math.sin(Date.now() * 0.001 + node.x + node.y) * 0.3;
            ctx.fillStyle = `rgba(96, 165, 250, ${node.activation})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

// ==========================================
// RESEARCH MODAL
// ==========================================

function initModal() {
    const modal = document.getElementById('research-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const researchCards = document.querySelectorAll('.research-card');

    // Research details (you can edit these)
    const researchDetails = {
        agn: {
            title: 'AGN Outflows and Galaxy Evolution',
            advisor: 'Prof. Alison Coil',
            description: `
                <p>Active Galactic Nuclei (AGN) are among the most energetic phenomena in the universe, 
                powered by supermassive black holes accreting matter at the centers of galaxies. My research 
                focuses on understanding how AGN-driven outflows regulate star formation and influence the 
                evolution of their host galaxies.</p>
                
                <h3>Research Objectives</h3>
                <ul>
                    <li>Characterize the kinematics and energetics of ionized gas outflows using KCWI spectroscopy</li>
                    <li>Measure outflow rates and compare with theoretical predictions from simulations</li>
                    <li>Investigate the relationship between AGN properties and outflow characteristics</li>
                    <li>Assess the impact of AGN feedback on galaxy-scale star formation</li>
                </ul>
                
                <h3>Methods & Tools</h3>
                <p>I analyze integral field spectroscopy data from the Keck Cosmic Web Imager (KCWI), 
                using Python-based tools to map the spatial distribution and velocity structure of ionized gas. 
                My workflow includes emission line fitting, kinematic modeling, and comparison with hydrodynamic simulations.</p>
            `,
            collaborators: ['Prof. Alison Coil', 'UCSD Galaxy Evolution Group']
        },
        gc: {
            title: 'Globular Cluster Dynamics',
            advisor: 'Prof. Kyle Kremer',
            description: `
                <p>Globular clusters are dense stellar systems containing hundreds of thousands of stars, 
                serving as natural laboratories for studying stellar dynamics and compact object formation. 
                My work focuses on understanding the long-term evolution of these systems through N-body simulations.</p>
                
                <h3>Research Focus</h3>
                <ul>
                    <li>Black hole retention and dynamical evolution in dense stellar environments</li>
                    <li>Binary star formation and evolution through dynamical interactions</li>
                    <li>Mass segregation and core collapse in globular clusters</li>
                    <li>Comparison of simulation results with observational data</li>
                </ul>
                
                <h3>Computational Methods</h3>
                <p>I use the CMC (Cluster Monte Carlo) code to simulate globular cluster evolution over billions 
                of years, tracking individual stellar interactions and compact object formation. This work requires 
                high-performance computing resources and careful analysis of large simulation datasets.</p>
            `,
            collaborators: ['Prof. Kyle Kremer', 'CIERA Northwestern']
        },
        dm: {
            title: 'Dark Matter Detection with XENONnT',
            advisor: 'Prof. Kaixuan Ni',
            description: `
                <p>Dark matter constitutes approximately 85% of the matter in the universe, yet its nature 
                remains one of physics' greatest mysteries. I contribute to the XENONnT experiment, which searches 
                for Weakly Interacting Massive Particles (WIMPs) using a liquid xenon time projection chamber.</p>
                
                <h3>My Contributions</h3>
                <ul>
                    <li>Background characterization and reduction in the XENONnT detector</li>
                    <li>Development of analysis tools for identifying and rejecting background events</li>
                    <li>Monte Carlo simulations of detector response and background sources</li>
                    <li>Data quality monitoring and calibration studies</li>
                </ul>
                
                <h3>Experimental Techniques</h3>
                <p>The XENONnT detector is located deep underground in the Gran Sasso National Laboratory in Italy, 
                shielded from cosmic rays. I work on analyzing the detector data to distinguish potential dark matter 
                signals from various background sources including radioactive decays and neutron interactions.</p>
            `,
            collaborators: ['Prof. Kaixuan Ni', 'XENON Collaboration']
        },
        ml: {
            title: 'Machine Learning for Particle Physics',
            advisor: 'Prof. Javier Duarte',
            description: `
                <p>Modern particle physics experiments produce massive amounts of data that require sophisticated 
                analysis techniques. I work on developing and applying machine learning methods to improve particle 
                identification and event classification in high-energy physics.</p>
                
                <h3>Project Areas</h3>
                <ul>
                    <li>Jet classification using graph neural networks</li>
                    <li>Particle identification with deep learning</li>
                    <li>Fast simulation using generative models</li>
                    <li>Real-time event selection for detector triggers</li>
                </ul>
                
                <h3>Technical Approach</h3>
                <p>I implement neural network architectures optimized for particle physics data, including graph 
                networks for jet tagging and convolutional networks for calorimeter image analysis. A key challenge 
                is developing models that are both accurate and fast enough for real-time applications in detector 
                trigger systems.</p>
            `,
            collaborators: ['Prof. Javier Duarte', 'CMS Collaboration']
        }
    };

    // Open modal on card click
    researchCards.forEach(card => {
        card.addEventListener('click', () => {
            const researchType = card.getAttribute('data-research');
            const details = researchDetails[researchType];

            if (details) {
                modalBody.innerHTML = `
                    <h2>${details.title}</h2>
                    <p class="card-advisor" style="font-size: 1.1rem; margin-bottom: 2rem;">${details.advisor}</p>
                    ${details.description}
                    <h3>Collaborators</h3>
                    <p>${details.collaborators.join(', ')}</p>
                `;
                modal.style.display = 'block';
            }
        });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
