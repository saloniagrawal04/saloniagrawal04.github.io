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
    const numParticles = 100;
    const numStars = 150;
    const numNebulae = 8;

    // Nebula class for background ambiance
    class Nebula {
        constructor(isHero = false) {
            this.isHero = isHero;
            if (isHero) {
                // Hero nebula: Centered, larger, brighter
                this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
                this.y = canvas.height / 3 + (Math.random() - 0.5) * 100;
                this.radius = Math.random() * 300 + 300;
                this.vx = (Math.random() - 0.5) * 0.05;
                this.vy = (Math.random() - 0.5) * 0.05;
                // Mix of Teal, Lime, and Deep Blue
                const colors = [
                    'rgba(45, 212, 191, 0.08)', // Teal
                    'rgba(163, 230, 53, 0.05)', // Lime
                    'rgba(14, 165, 233, 0.06)'  // Sky Blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            } else {
                // Background nebulae
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 400 + 200;
                this.vx = (Math.random() - 0.5) * 0.1;
                this.vy = (Math.random() - 0.5) * 0.1;
                const colors = [
                    'rgba(45, 212, 191, 0.03)', // Teal
                    'rgba(163, 230, 53, 0.02)', // Lime
                    'rgba(8, 145, 178, 0.03)'   // Darker Cyan
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen (looser bounds for hero nebulae to keep them central-ish)
            if (this.isHero) {
                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.x > canvas.width + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = canvas.height + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius;
            } else {
                if (this.x < -this.radius) this.x = canvas.width + this.radius;
                if (this.x > canvas.width + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = canvas.height + this.radius;
                if (this.y > canvas.height + this.radius) this.y = -this.radius;
            }
        }

        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

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
            // Teal or Lime
            this.color = Math.random() > 0.5 ? '#2dd4bf' : '#a3e635';
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
            ctx.fillStyle = '#f0fdfa'; // Pale Mint stars
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Initialize objects
    const nebulae = [];
    // Add Hero Nebulae (Front/Center)
    for (let i = 0; i < 5; i++) {
        nebulae.push(new Nebula(true));
    }
    // Add Background Nebulae
    for (let i = 0; i < numNebulae; i++) {
        nebulae.push(new Nebula(false));
    }

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

        // Draw nebulae first (background)
        nebulae.forEach(nebula => {
            nebula.update();
            nebula.draw();
        });

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
        gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.3)'); // Teal glow
        gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw AGN outflow jets (subtle lines)
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.2)'; // Teal jets
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

    // KCWI Data Reduction Animation
    animateKCWI();
}

function animateAGN() {
    const container = document.getElementById('agn-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let flowPhase = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const coneHeight = 60;
        const coneWidth = 35;

        // Draw LEFT CONE (TEAL - Blueshift)
        // Top left cone
        const leftGradientTop = ctx.createLinearGradient(cx, cy, cx - coneWidth, cy - coneHeight);
        leftGradientTop.addColorStop(0, 'rgba(45, 212, 191, 0.1)');
        leftGradientTop.addColorStop(0.5, 'rgba(45, 212, 191, 0.4)');
        leftGradientTop.addColorStop(1, 'rgba(45, 212, 191, 0.6)');

        ctx.fillStyle = leftGradientTop;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - coneWidth, cy - coneHeight);
        ctx.lineTo(cx, cy - coneHeight);
        ctx.closePath();
        ctx.fill();

        // Bottom left cone
        const leftGradientBottom = ctx.createLinearGradient(cx, cy, cx - coneWidth, cy + coneHeight);
        leftGradientBottom.addColorStop(0, 'rgba(45, 212, 191, 0.1)');
        leftGradientBottom.addColorStop(0.5, 'rgba(45, 212, 191, 0.4)');
        leftGradientBottom.addColorStop(1, 'rgba(45, 212, 191, 0.6)');

        ctx.fillStyle = leftGradientBottom;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - coneWidth, cy + coneHeight);
        ctx.lineTo(cx, cy + coneHeight);
        ctx.closePath();
        ctx.fill();

        // Draw RIGHT CONE (RED - Redshift)
        // Top right cone
        const rightGradientTop = ctx.createLinearGradient(cx, cy, cx + coneWidth, cy - coneHeight);
        rightGradientTop.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
        rightGradientTop.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
        rightGradientTop.addColorStop(1, 'rgba(239, 68, 68, 0.6)');

        ctx.fillStyle = rightGradientTop;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + coneWidth, cy - coneHeight);
        ctx.lineTo(cx, cy - coneHeight);
        ctx.closePath();
        ctx.fill();

        // Bottom right cone
        const rightGradientBottom = ctx.createLinearGradient(cx, cy, cx + coneWidth, cy + coneHeight);
        rightGradientBottom.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
        rightGradientBottom.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
        rightGradientBottom.addColorStop(1, 'rgba(239, 68, 68, 0.6)');

        ctx.fillStyle = rightGradientBottom;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + coneWidth, cy + coneHeight);
        ctx.lineTo(cx, cy + coneHeight);
        ctx.closePath();
        ctx.fill();

        // Draw flowing particles in left cone (teal)
        for (let i = 0; i < 6; i++) {
            const offset = (flowPhase + i * 15) % 60;
            const progress = offset / 60;
            const x1 = cx - progress * coneWidth;
            const y1 = cy - progress * coneHeight;
            const x2 = cx - progress * coneWidth;
            const y2 = cy + progress * coneHeight;

            ctx.fillStyle = `rgba(45, 212, 191, ${1 - progress})`;
            ctx.beginPath();
            ctx.arc(x1, y1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x2, y2, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw flowing particles in right cone (red)
        for (let i = 0; i < 6; i++) {
            const offset = (flowPhase + i * 15) % 60;
            const progress = offset / 60;
            const x1 = cx + progress * coneWidth;
            const y1 = cy - progress * coneHeight;
            const x2 = cx + progress * coneWidth;
            const y2 = cy + progress * coneHeight;

            ctx.fillStyle = `rgba(239, 68, 68, ${1 - progress})`;
            ctx.beginPath();
            ctx.arc(x1, y1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x2, y2, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw central AGN (faint dot)
        const agnGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
        agnGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        agnGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        agnGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = agnGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Central bright point
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

        flowPhase = (flowPhase + 0.8) % 60;
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
        ctx.fillStyle = '#a3e635';
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

    let animationPhase = 0;
    const cycleLength = 200; // Full animation cycle

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const tpcTop = 20;
        const tpcBottom = canvas.height - 20;
        const tpcHeight = tpcBottom - tpcTop;
        const interactionPoint = tpcBottom - 30; // Where particle interacts

        // Draw TPC chamber outline
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 40, tpcTop, 80, tpcHeight);

        // Draw horizontal lines for TPC structure
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)';
        ctx.lineWidth = 1;
        for (let y = tpcTop + 15; y < tpcBottom; y += 15) {
            ctx.beginPath();
            ctx.moveTo(cx - 40, y);
            ctx.lineTo(cx + 40, y);
            ctx.stroke();
        }

        const phase = animationPhase % cycleLength;

        // Phase 1: Particle entering (0-40)
        if (phase < 40) {
            const progress = phase / 40;
            const particleY = tpcTop + progress * (interactionPoint - tpcTop);

            // Draw incoming DM particle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(cx, particleY, 3, 0, Math.PI * 2);
            ctx.fill();

            // Particle trail
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - progress)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, tpcTop);
            ctx.lineTo(cx, particleY);
            ctx.stroke();
        }

        // Phase 2: First scintillation (S1) at interaction point (40-80)
        if (phase >= 40 && phase < 80) {
            const flashProgress = (phase - 40) / 40;
            const flashRadius = flashProgress * 15;
            const flashOpacity = Math.sin(flashProgress * Math.PI) * 0.6;

            // S1 scintillation flash
            const s1Gradient = ctx.createRadialGradient(cx, interactionPoint, 0, cx, interactionPoint, flashRadius);
            s1Gradient.addColorStop(0, `rgba(45, 212, 191, ${flashOpacity})`);
            s1Gradient.addColorStop(0.5, `rgba(45, 212, 191, ${flashOpacity * 0.5})`);
            s1Gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

            ctx.fillStyle = s1Gradient;
            ctx.beginPath();
            ctx.arc(cx, interactionPoint, flashRadius, 0, Math.PI * 2);
            ctx.fill();

            // Interaction point marker
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(cx, interactionPoint, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Phase 3: Electrons drifting up (80-140)
        if (phase >= 80 && phase < 140) {
            const driftProgress = (phase - 80) / 60;
            const electronY = interactionPoint - driftProgress * (interactionPoint - tpcTop - 20);

            // Draw drifting electrons (ionization cloud)
            for (let i = 0; i < 5; i++) {
                const offsetX = (Math.sin(phase * 0.1 + i) * 8);
                const offsetY = i * 5;
                ctx.fillStyle = `rgba(45, 212, 191, ${0.6 * (1 - driftProgress * 0.5)})`;
                ctx.beginPath();
                ctx.arc(cx + offsetX, electronY + offsetY, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Drift path
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * (1 - driftProgress)})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(cx, interactionPoint);
            ctx.lineTo(cx, electronY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Phase 4: Second scintillation (S2) at top (140-180)
        if (phase >= 140 && phase < 180) {
            const s2Progress = (phase - 140) / 40;
            const s2Y = tpcTop + 20;
            const s2Radius = s2Progress * 25;
            const s2Opacity = Math.sin(s2Progress * Math.PI) * 0.7;

            // S2 scintillation flash (larger than S1)
            const s2Gradient = ctx.createRadialGradient(cx, s2Y, 0, cx, s2Y, s2Radius);
            s2Gradient.addColorStop(0, `rgba(45, 212, 191, ${s2Opacity})`);
            s2Gradient.addColorStop(0.4, `rgba(45, 212, 191, ${s2Opacity * 0.6})`);
            s2Gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

            ctx.fillStyle = s2Gradient;
            ctx.beginPath();
            ctx.arc(cx, s2Y, s2Radius, 0, Math.PI * 2);
            ctx.fill();

            // Bright center
            ctx.fillStyle = `rgba(255, 255, 255, ${s2Opacity})`;
            ctx.beginPath();
            ctx.arc(cx, s2Y, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Label text
        if (phase < 40) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '9px monospace';
            ctx.fillText('DM particle', cx + 10, tpcTop + 30);
        } else if (phase >= 40 && phase < 80) {
            ctx.fillStyle = 'rgba(45, 212, 191, 0.7)';
            ctx.font = '9px monospace';
            ctx.fillText('S1', cx + 18, interactionPoint);
        } else if (phase >= 140 && phase < 180) {
            ctx.fillStyle = 'rgba(45, 212, 191, 0.7)';
            ctx.font = '9px monospace';
            ctx.fillText('S2', cx + 28, tpcTop + 20);
        }

        animationPhase++;
        requestAnimationFrame(draw);
    }

    draw();
}


function animateKCWI() {
    const container = document.getElementById('kcwi-animation');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let phase = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw data cube representation
        const cubeSize = 40;

        // Back face
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(cx - cubeSize / 2 + 10, cy - cubeSize / 2 - 10, cubeSize, cubeSize);
        ctx.stroke();

        // Front face
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#2dd4bf';
        ctx.beginPath();
        ctx.rect(cx - cubeSize / 2, cy - cubeSize / 2, cubeSize, cubeSize);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Connect corners
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
        ctx.lineWidth = 1;
        [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(cx - cubeSize / 2 + i * cubeSize, cy - cubeSize / 2 + j * cubeSize);
            ctx.lineTo(cx - cubeSize / 2 + i * cubeSize + 10, cy - cubeSize / 2 + j * cubeSize - 10);
            ctx.stroke();
        });

        // Animated spectral lines
        for (let i = 0; i < 3; i++) {
            const offset = (phase + i * 20) % 60;
            const alpha = 1 - offset / 60;
            ctx.strokeStyle = `rgba(163, 230, 53, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const y = cy - 15 + i * 15 - offset * 0.5;
            ctx.moveTo(cx - 15, y);
            ctx.lineTo(cx + 15, y);
            ctx.stroke();
        }

        phase = (phase + 1) % 60;
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
            title: 'AGN Outflows',
            advisor: 'Prof. Alison Coil',
            description: `
                <p style="margin-bottom: 2rem;">In active galactic nuclei (AGN), supermassive black holes launch powerful winds that reshape their host galaxies. We study these outflows using ionized-gas emission lines in galaxy spectra, which reveal the motion and energetics of gas near the black hole.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Spectral Signatures: Broad vs Narrow [O III]</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem;">
                    <div>
                        <canvas id="narrow-spectrum" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">No AGN — narrow line from normal ionized gas.</p>
                    </div>
                    <div>
                        <canvas id="broad-spectrum" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">With AGN — broad wings from fast outflowing gas.</p>
                    </div>
                </div>
                <p style="font-style: italic; color: #cbd5e1; margin-bottom: 2rem;">Broad and asymmetric emission lines indicate gas moving at hundreds to thousands of km/s, a signature of AGN-driven outflows.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Three-Gaussian Decomposition</h3>
                <div style="margin-bottom: 1rem;">
                    <canvas id="gaussian-fit" width="600" height="250" style="width: 100%; max-width: 600px; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                </div>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">Decomposing the emission line into Gaussian components reveals separate gas populations with different velocities and velocity dispersions.</p>
                
                <p style="margin-top: 2rem;">These kinematic components help us map the structure of AGN winds and measure how they influence galaxy evolution.</p>
            `,
            collaborators: ['Prof. Alison Coil', 'UCSD Galaxy Evolution Group'],
            initVisuals: function () {
                // Draw narrow spectrum
                const narrowCanvas = document.getElementById('narrow-spectrum');
                if (narrowCanvas) {
                    const ctx = narrowCanvas.getContext('2d');
                    const w = narrowCanvas.width;
                    const h = narrowCanvas.height;

                    // Axes
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(40, h - 30);
                    ctx.lineTo(w - 20, h - 30);
                    ctx.moveTo(40, 20);
                    ctx.lineTo(40, h - 30);
                    ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '11px monospace';
                    ctx.fillText('Wavelength', w / 2 - 30, h - 5);
                    ctx.save();
                    ctx.translate(15, h / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText('Flux', -15, 0);
                    ctx.restore();

                    // Draw narrow Gaussian
                    ctx.strokeStyle = '#2dd4bf';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#2dd4bf';
                    ctx.beginPath();
                    const centerX = w / 2;
                    const sigma = 15;
                    for (let x = 40; x < w - 20; x++) {
                        const dx = x - centerX;
                        const y = h - 30 - 100 * Math.exp(-(dx * dx) / (2 * sigma * sigma));
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Draw broad spectrum
                const broadCanvas = document.getElementById('broad-spectrum');
                if (broadCanvas) {
                    const ctx = broadCanvas.getContext('2d');
                    const w = broadCanvas.width;
                    const h = broadCanvas.height;

                    // Axes
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(40, h - 30);
                    ctx.lineTo(w - 20, h - 30);
                    ctx.moveTo(40, 20);
                    ctx.lineTo(40, h - 30);
                    ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '11px monospace';
                    ctx.fillText('Wavelength', w / 2 - 30, h - 5);
                    ctx.save();
                    ctx.translate(15, h / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText('Flux', -15, 0);
                    ctx.restore();

                    // Draw broad asymmetric profile
                    ctx.strokeStyle = '#f87171';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#f87171';
                    ctx.beginPath();
                    const centerX = w / 2;
                    for (let x = 40; x < w - 20; x++) {
                        const dx = x - centerX;
                        // Asymmetric profile with extended blue wing
                        const narrow = 80 * Math.exp(-(dx * dx) / (2 * 15 * 15));
                        const broad = 40 * Math.exp(-(dx * dx) / (2 * 40 * 40));
                        const blueWing = dx < 0 ? 25 * Math.exp(-(dx * dx) / (2 * 60 * 60)) : 0;
                        const y = h - 30 - (narrow + broad + blueWing);
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Draw Gaussian decomposition
                const fitCanvas = document.getElementById('gaussian-fit');
                if (fitCanvas) {
                    const ctx = fitCanvas.getContext('2d');
                    const w = fitCanvas.width;
                    const h = fitCanvas.height;

                    // Axes
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(50, h - 40);
                    ctx.lineTo(w - 30, h - 40);
                    ctx.moveTo(50, 20);
                    ctx.lineTo(50, h - 40);
                    ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '12px monospace';
                    ctx.fillText('Velocity (km/s)', w / 2 - 50, h - 10);
                    ctx.save();
                    ctx.translate(15, h / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText('Flux', -15, 0);
                    ctx.restore();

                    // Velocity tick marks
                    ctx.font = '10px monospace';
                    const velocities = [-1000, -500, 0, 500, 1000];
                    velocities.forEach(v => {
                        const x = 50 + (w - 80) * (v + 1000) / 2000;
                        ctx.fillText(v.toString(), x - 15, h - 25);
                    });

                    const centerX = w / 2;

                    // Component 1: Narrow core (teal)
                    ctx.strokeStyle = '#2dd4bf';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#2dd4bf';
                    ctx.beginPath();
                    for (let x = 50; x < w - 30; x++) {
                        const dx = x - centerX;
                        const y = h - 40 - 120 * Math.exp(-(dx * dx) / (2 * 20 * 20));
                        if (x === 50) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Component 2: Intermediate (lime)
                    ctx.strokeStyle = '#a3e635';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#a3e635';
                    ctx.beginPath();
                    for (let x = 50; x < w - 30; x++) {
                        const dx = x - centerX;
                        const y = h - 40 - 60 * Math.exp(-(dx * dx) / (2 * 50 * 50));
                        if (x === 50) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Component 3: Broad wing (red)
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#ef4444';
                    ctx.beginPath();
                    for (let x = 50; x < w - 30; x++) {
                        const dx = x - centerX - 40; // Offset for blueshift
                        const y = h - 40 - 35 * Math.exp(-(dx * dx) / (2 * 80 * 80));
                        if (x === 50) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Total fit (white)
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    for (let x = 50; x < w - 30; x++) {
                        const dx = x - centerX;
                        const g1 = 120 * Math.exp(-(dx * dx) / (2 * 20 * 20));
                        const g2 = 60 * Math.exp(-(dx * dx) / (2 * 50 * 50));
                        const g3 = 35 * Math.exp(-((dx + 40) * (dx + 40)) / (2 * 80 * 80));
                        const y = h - 40 - (g1 + g2 + g3);
                        if (x === 50) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();

                    // Legend
                    const legendX = w - 180;
                    const legendY = 40;
                    ctx.font = '11px sans-serif';

                    ctx.fillStyle = '#2dd4bf';
                    ctx.fillRect(legendX, legendY, 15, 3);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillText('Narrow core', legendX + 20, legendY + 3);

                    ctx.fillStyle = '#a3e635';
                    ctx.fillRect(legendX, legendY + 15, 15, 3);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillText('Intermediate', legendX + 20, legendY + 18);

                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(legendX, legendY + 30, 15, 3);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillText('Broad wing', legendX + 20, legendY + 33);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(legendX, legendY + 45, 15, 3);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillText('Total fit', legendX + 20, legendY + 48);
                }
            }
        },
        gc: {
            title: 'Globular Clusters',
            advisor: 'Prof. Kyle Kremer',
            description: `
                <p style="margin-bottom: 2rem;">Globular clusters are dense, gravitationally bound star systems containing hundreds of thousands of stars. They are natural laboratories for studying stellar dynamics, black hole retention, binary evolution, and the pathways that form exotic objects like X-ray binaries and millisecond pulsars.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Sparse vs Dense Stellar Environments</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem;">
                    <div>
                        <canvas id="sparse-field" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">Typical stellar environment — low interaction rate.</p>
                    </div>
                    <div>
                        <canvas id="dense-cluster" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">Globular cluster core — high encounter and collision rates.</p>
                    </div>
                </div>
                <p style="font-style: italic; color: #cbd5e1; margin-bottom: 2rem;">The extreme stellar densities in globular clusters lead to frequent dynamical interactions that reshape the entire system.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Radial Density Profile (King Model)</h3>
                <div style="margin-bottom: 1rem;">
                    <canvas id="king-profile" width="600" height="250" style="width: 100%; max-width: 600px; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                </div>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">Radial density profiles reveal the structure of the cluster and help model its dynamical evolution.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Three-Body Interactions</h3>
                <div style="margin-bottom: 1rem;">
                    <canvas id="three-body" width="400" height="250" style="width: 100%; max-width: 400px; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                </div>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">Frequent three-body encounters harden binaries and drive the long-term evolution of the cluster.</p>
                
                <p style="margin-top: 2rem;">Using simulations like CMC-COSMIC, we follow these interactions across billions of years to understand how star clusters form black holes, binaries, and exotic stellar remnants.</p>
            `,
            collaborators: ['Prof. Kyle Kremer', 'CIERA Northwestern'],
            initVisuals: function () {
                // Draw sparse stellar field
                const sparseCanvas = document.getElementById('sparse-field');
                if (sparseCanvas) {
                    const ctx = sparseCanvas.getContext('2d');
                    const w = sparseCanvas.width;
                    const h = sparseCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Draw ~20 widely spaced stars
                    for (let i = 0; i < 20; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const size = Math.random() * 2 + 1;

                        // Star with glow
                        ctx.fillStyle = '#ffffff';
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.shadowBlur = 0;
                }

                // Draw dense cluster core
                const denseCanvas = document.getElementById('dense-cluster');
                if (denseCanvas) {
                    const ctx = denseCanvas.getContext('2d');
                    const w = denseCanvas.width;
                    const h = denseCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    const cx = w / 2;
                    const cy = h / 2;

                    // Draw ~150 stars concentrated toward center
                    for (let i = 0; i < 150; i++) {
                        // Use Gaussian distribution for clustering
                        const angle = Math.random() * Math.PI * 2;
                        const r = Math.abs(Math.random() * 30 + Math.random() * 30); // Concentrated distribution
                        const x = cx + Math.cos(angle) * r;
                        const y = cy + Math.sin(angle) * r;
                        const size = Math.random() * 1.5 + 0.5;

                        if (x >= 0 && x <= w && y >= 0 && y <= h) {
                            ctx.fillStyle = '#ffffff';
                            ctx.shadowBlur = 6;
                            ctx.shadowColor = '#a3e635';
                            ctx.beginPath();
                            ctx.arc(x, y, size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    ctx.shadowBlur = 0;
                }

                // Draw King profile
                const kingCanvas = document.getElementById('king-profile');
                if (kingCanvas) {
                    const ctx = kingCanvas.getContext('2d');
                    const w = kingCanvas.width;
                    const h = kingCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Axes
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(60, h - 40);
                    ctx.lineTo(w - 30, h - 40);
                    ctx.moveTo(60, 20);
                    ctx.lineTo(60, h - 40);
                    ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '12px monospace';
                    ctx.fillText('Radius (pc)', w / 2 - 30, h - 10);
                    ctx.save();
                    ctx.translate(20, h / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText('Density', -25, 0);
                    ctx.restore();

                    // Radius tick marks
                    ctx.font = '10px monospace';
                    const radii = [0, 5, 10, 15, 20];
                    radii.forEach(r => {
                        const x = 60 + (w - 90) * r / 20;
                        ctx.fillText(r.toString(), x - 5, h - 25);
                    });

                    // Draw King profile curve
                    ctx.strokeStyle = '#2dd4bf';
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#2dd4bf';
                    ctx.beginPath();

                    const rc = 3; // Core radius
                    const rt = 20; // Tidal radius

                    for (let x = 60; x < w - 30; x++) {
                        const r = (x - 60) / (w - 90) * rt;

                        // King model approximation
                        let density;
                        if (r < rc) {
                            // Flat core
                            density = 1.0;
                        } else if (r < rt) {
                            // Power law decline
                            density = Math.pow(1 + (r / rc) * (r / rc), -1.5);
                        } else {
                            density = 0;
                        }

                        const y = h - 40 - density * 150;

                        if (x === 60) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Annotations
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '11px sans-serif';
                    ctx.fillText('Core', 100, 50);
                    ctx.fillText('Halo', w - 100, h - 80);

                    // Dashed line for core radius
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    const rcX = 60 + (w - 90) * rc / rt;
                    ctx.beginPath();
                    ctx.moveTo(rcX, h - 40);
                    ctx.lineTo(rcX, 50);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Draw three-body interaction
                const threeBodyCanvas = document.getElementById('three-body');
                if (threeBodyCanvas) {
                    const ctx = threeBodyCanvas.getContext('2d');
                    const w = threeBodyCanvas.width;
                    const h = threeBodyCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    const cx = w / 2;
                    const cy = h / 2;

                    // Binary system (two stars orbiting)
                    const star1X = cx - 30;
                    const star1Y = cy;
                    const star2X = cx + 30;
                    const star2Y = cy;

                    // Draw orbital path
                    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, 35, 20, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Binary stars
                    ctx.fillStyle = '#2dd4bf';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#2dd4bf';
                    ctx.beginPath();
                    ctx.arc(star1X, star1Y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(star2X, star2Y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Intruder star
                    const intruderX = cx - 100;
                    const intruderY = cy - 60;
                    ctx.fillStyle = '#ef4444';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(intruderX, intruderY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Approach arrow
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(intruderX + 10, intruderY + 10);
                    ctx.lineTo(cx - 50, cy - 20);
                    ctx.stroke();

                    // Arrowhead
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.moveTo(cx - 50, cy - 20);
                    ctx.lineTo(cx - 55, cy - 25);
                    ctx.lineTo(cx - 52, cy - 15);
                    ctx.closePath();
                    ctx.fill();

                    // Ejection arrow (one star gets kicked out)
                    const ejectX = cx + 100;
                    const ejectY = cy + 60;
                    ctx.strokeStyle = '#a3e635';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(cx + 40, cy + 10);
                    ctx.lineTo(ejectX - 10, ejectY - 10);
                    ctx.stroke();

                    // Arrowhead
                    ctx.fillStyle = '#a3e635';
                    ctx.beginPath();
                    ctx.moveTo(ejectX - 10, ejectY - 10);
                    ctx.lineTo(ejectX - 15, ejectY - 15);
                    ctx.lineTo(ejectX - 5, ejectY - 12);
                    ctx.closePath();
                    ctx.fill();

                    // Labels
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '11px sans-serif';
                    ctx.fillText('Binary', cx - 20, cy - 30);
                    ctx.fillText('Intruder', intruderX - 25, intruderY - 15);
                    ctx.fillText('Ejected', ejectX - 20, ejectY + 5);

                    // Energy exchange annotation
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '10px sans-serif';
                    ctx.fillText('Energy transfer →', cx - 60, h - 30);
                    ctx.fillText('Binary hardens', cx - 50, h - 15);
                }
            }
        },
        dm: {
            title: 'Dark Matter Detection (XENONnT)',
            advisor: 'Prof. Kaixuan Ni',
            description: `
                <p style="margin-bottom: 2rem;">The XENON experiment searches for dark matter using a dual-phase liquid xenon detector deep underground. Interactions inside the xenon produce tiny flashes of light that allow us to reconstruct particle energies, positions, and event types.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">S1 and S2 Signals</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem;">
                    <div>
                        <canvas id="s1-signal" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">S1: Prompt scintillation from particle interaction.</p>
                    </div>
                    <div>
                        <canvas id="s2-signal" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #94a3b8;">S2: Electrons drift & create delayed electroluminescence.</p>
                    </div>
                </div>
                <p style="font-style: italic; color: #cbd5e1; margin-bottom: 2rem;">The timing and size of the S1 and S2 signals let us infer the event's depth, position, and type.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Delayed Single-Electron Bursts</h3>
                <div style="margin-bottom: 1rem;">
                    <canvas id="delayed-electrons" width="600" height="200" style="width: 100%; max-width: 600px; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                </div>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">Delayed single-electron emissions can mimic low-energy events, so identifying and matching them is essential.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Matching Algorithm</h3>
                <div style="margin-bottom: 1rem;">
                    <canvas id="matching-algorithm" width="600" height="250" style="width: 100%; max-width: 600px; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                </div>
                <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">Matching single-electron bursts to their parent S2 signal improves background rejection and event reconstruction.</p>
                
                <p style="margin-top: 2rem;">This analysis helps distinguish true low-energy interactions from detector artifacts, strengthening the search for rare dark matter signals.</p>
            `,
            collaborators: ['Prof. Kaixuan Ni', 'XENON Collaboration'],
            initVisuals: function () {
                // Draw S1 signal
                const s1Canvas = document.getElementById('s1-signal');
                if (s1Canvas) {
                    const ctx = s1Canvas.getContext('2d');
                    const w = s1Canvas.width;
                    const h = s1Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Draw particle interaction
                    const interactionY = h - 60;
                    ctx.fillStyle = '#ef4444';
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(w / 2, interactionY, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Draw S1 light flash (radial)
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 * i) / 8;
                        const length = 25;
                        ctx.strokeStyle = '#2dd4bf';
                        ctx.lineWidth = 2;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#2dd4bf';
                        ctx.beginPath();
                        ctx.moveTo(w / 2, interactionY);
                        ctx.lineTo(w / 2 + Math.cos(angle) * length, interactionY + Math.sin(angle) * length);
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;

                    // Label
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '11px sans-serif';
                    ctx.fillText('Prompt scintillation', w / 2 - 50, 30);
                    ctx.fillText('(S1)', w / 2 - 10, 45);
                }

                // Draw S2 signal
                const s2Canvas = document.getElementById('s2-signal');
                if (s2Canvas) {
                    const ctx = s2Canvas.getContext('2d');
                    const w = s2Canvas.width;
                    const h = s2Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Interaction point
                    const interactionY = h - 60;
                    ctx.fillStyle = '#ef4444';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(w / 2, interactionY, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Drifting electrons
                    for (let i = 0; i < 4; i++) {
                        const y = interactionY - 20 - i * 15;
                        const x = w / 2 + (Math.sin(i) * 5);
                        ctx.fillStyle = '#2dd4bf';
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = '#2dd4bf';
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.shadowBlur = 0;

                    // Drift arrow
                    ctx.strokeStyle = '#2dd4bf';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(w / 2, interactionY - 10);
                    ctx.lineTo(w / 2, 40);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // S2 light at top
                    const s2Y = 30;
                    for (let i = 0; i < 12; i++) {
                        const angle = (Math.PI * 2 * i) / 12;
                        const length = 20;
                        ctx.strokeStyle = '#a3e635';
                        ctx.lineWidth = 2;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#a3e635';
                        ctx.beginPath();
                        ctx.moveTo(w / 2, s2Y);
                        ctx.lineTo(w / 2 + Math.cos(angle) * length, s2Y + Math.sin(angle) * length);
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;

                    // Labels
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '10px sans-serif';
                    ctx.fillText('Electroluminescence', w / 2 + 30, 25);
                    ctx.fillText('(S2)', w / 2 + 50, 38);
                    ctx.fillText('Drift', w / 2 + 10, h / 2);
                }

                // Draw delayed electron bursts
                const delayedCanvas = document.getElementById('delayed-electrons');
                if (delayedCanvas) {
                    const ctx = delayedCanvas.getContext('2d');
                    const w = delayedCanvas.width;
                    const h = delayedCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Time axis
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(50, h - 30);
                    ctx.lineTo(w - 30, h - 30);
                    ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '11px monospace';
                    ctx.fillText('Time (μs)', w / 2 - 25, h - 5);

                    // Large S2 peak
                    const s2X = 150;
                    ctx.strokeStyle = '#a3e635';
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#a3e635';
                    ctx.beginPath();
                    for (let x = s2X - 30; x < s2X + 30; x++) {
                        const dx = x - s2X;
                        const y = h - 30 - 80 * Math.exp(-(dx * dx) / 200);
                        if (x === s2X - 30) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Label S2
                    ctx.fillStyle = '#a3e635';
                    ctx.font = '12px sans-serif';
                    ctx.fillText('S2', s2X - 8, 40);

                    // Delayed single electrons
                    const delays = [250, 320, 410, 480];
                    delays.forEach((x, i) => {
                        ctx.strokeStyle = '#ef4444';
                        ctx.lineWidth = 2;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#ef4444';
                        ctx.beginPath();
                        for (let dx = x - 8; dx < x + 8; dx++) {
                            const offset = dx - x;
                            const y = h - 30 - 20 * Math.exp(-(offset * offset) / 15);
                            if (dx === x - 8) ctx.moveTo(dx, y);
                            else ctx.lineTo(dx, y);
                        }
                        ctx.stroke();
                        ctx.shadowBlur = 0;

                        // Mark as delayed
                        if (i === 0) {
                            ctx.fillStyle = '#ef4444';
                            ctx.font = '9px sans-serif';
                            ctx.fillText('Delayed', x - 18, h - 50);
                            ctx.fillText('SE', x - 8, h - 38);
                        }
                    });
                }

                // Draw matching algorithm
                const matchCanvas = document.getElementById('matching-algorithm');
                if (matchCanvas) {
                    const ctx = matchCanvas.getContext('2d');
                    const w = matchCanvas.width;
                    const h = matchCanvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Timeline
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(50, h / 2);
                    ctx.lineTo(w - 50, h / 2);
                    ctx.stroke();

                    // S2 peak
                    const s2X = 120;
                    ctx.fillStyle = '#a3e635';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#a3e635';
                    ctx.beginPath();
                    ctx.arc(s2X, h / 2, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '11px sans-serif';
                    ctx.fillText('S2', s2X - 8, h / 2 - 20);

                    // Delayed electrons
                    const delays = [
                        { x: 220, y: h / 2 + 50 },
                        { x: 320, y: h / 2 + 70 },
                        { x: 420, y: h / 2 + 60 }
                    ];

                    delays.forEach((pos, i) => {
                        // Delayed electron
                        ctx.fillStyle = '#ef4444';
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#ef4444';
                        ctx.beginPath();
                        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        // Matching arrow
                        ctx.strokeStyle = '#2dd4bf';
                        ctx.lineWidth = 2;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.moveTo(s2X + 10, h / 2 + 5);
                        ctx.lineTo(pos.x - 8, pos.y - 5);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        // Arrowhead
                        ctx.fillStyle = '#60a5fa';
                        ctx.beginPath();
                        ctx.moveTo(pos.x - 8, pos.y - 5);
                        ctx.lineTo(pos.x - 12, pos.y - 8);
                        ctx.lineTo(pos.x - 6, pos.y - 10);
                        ctx.closePath();
                        ctx.fill();

                        if (i === 0) {
                            ctx.fillStyle = '#cbd5e1';
                            ctx.font = '9px sans-serif';
                            ctx.fillText('Delayed SE', pos.x - 25, pos.y + 20);
                        }
                    });

                    // Algorithm label
                    ctx.fillStyle = '#60a5fa';
                    ctx.font = '11px sans-serif';
                    ctx.fillText('Matching Algorithm', w / 2 - 50, 30);

                    // Position reconstruction
                    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
                    ctx.lineWidth = 1;
                    const gridX = w - 120;
                    const gridY = h - 80;
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.moveTo(gridX, gridY + i * 15);
                        ctx.lineTo(gridX + 60, gridY + i * 15);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(gridX + i * 15, gridY);
                        ctx.lineTo(gridX + i * 15, gridY + 45);
                        ctx.stroke();
                    }

                    ctx.fillStyle = '#10b981';
                    ctx.beginPath();
                    ctx.arc(gridX + 30, gridY + 22, 3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '9px sans-serif';
                    ctx.fillText('Position', gridX + 5, gridY - 5);
                }
            }
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
        },
        kcwi: {
            title: 'KCWI/KCRM Data Reduction',
            advisor: 'Prof. Alison Coil',
            description: `
                <p style="margin-bottom: 2rem;">The Keck Cosmic Web Imager (KCWI) and Keck Cosmic Reionization Mapper (KCRM) produce 3D data cubes containing spatial and spectral information. Reduction of these datasets requires careful calibration, sky subtraction, and mosaicking to create science-ready cubes for spectroscopic analysis.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Four-Step Workflow</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                    <div>
                        <canvas id="kcwi-step1" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #94a3b8;"><strong>1. Initial Calibration (KCWI DRP)</strong><br>Bias/dark subtraction, flat fields, wavelength calibration, geometric rectification.</p>
                    </div>
                    <div>
                        <canvas id="kcwi-step2" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #94a3b8;"><strong>2. Flux Calibration (KSkyWizard)</strong><br>Construct sensitivity and telluric correction curves using standard star observations.</p>
                    </div>
                    <div>
                        <canvas id="kcwi-step3" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #94a3b8;"><strong>3. Sky Subtraction (ZAP)</strong><br>PCA-based sky modeling and subtraction using ZAP.</p>
                    </div>
                    <div>
                        <canvas id="kcwi-step4" width="300" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;"></canvas>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: #94a3b8;"><strong>4. Resampling & Mosaicking</strong><br>Resample cubes, align pointings, and build final mosaics.</p>
                    </div>
                </div>
                
                <p style="font-style: italic; color: #cbd5e1; margin-bottom: 2rem;">These steps convert raw KCWI/KCRM exposures into calibrated, sky-subtracted, mosaicked cubes ready for emission-line fitting and kinematic mapping.</p>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Key Challenges</h3>
                <ul style="margin-left: 1.5rem; margin-bottom: 2rem; color: #cbd5e1;">
                    <li style="margin-bottom: 0.5rem;"><strong style="color: #60a5fa;">Sky Residuals:</strong> Removing sky emission without affecting galaxy signal</li>
                    <li style="margin-bottom: 0.5rem;"><strong style="color: #60a5fa;">Tellurics:</strong> Correcting atmospheric absorption in redder wavelengths</li>
                    <li style="margin-bottom: 0.5rem;"><strong style="color: #60a5fa;">Flux Calibration:</strong> Ensuring accurate sensitivity across full wavelength range</li>
                    <li style="margin-bottom: 0.5rem;"><strong style="color: #60a5fa;">Alignment:</strong> Matching spatial offsets and rotations between exposures</li>
                </ul>
                
                <p style="margin-top: 2rem;">This reduction pipeline enables high-fidelity measurements of galaxy kinematics, spatially resolved emission lines, and AGN-driven outflows.</p>
            `,
            collaborators: ['Prof. Alison Coil', 'KCWI Team'],
            initVisuals: function () {
                // Step 1: Initial Calibration Pipeline
                const step1Canvas = document.getElementById('kcwi-step1');
                if (step1Canvas) {
                    const ctx = step1Canvas.getContext('2d');
                    const w = step1Canvas.width;
                    const h = step1Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Draw pipeline flow
                    const steps = ['Raw', 'Bias', 'Flat', 'Arc', 'Cube'];
                    const stepWidth = (w - 60) / 5;

                    steps.forEach((label, i) => {
                        const x = 30 + i * stepWidth;
                        const y = h / 2;

                        // Box
                        ctx.fillStyle = i === steps.length - 1 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(96, 165, 250, 0.2)';
                        ctx.strokeStyle = i === steps.length - 1 ? '#10b981' : '#60a5fa';
                        ctx.lineWidth = 2;
                        ctx.fillRect(x - 20, y - 15, 40, 30);
                        ctx.strokeRect(x - 20, y - 15, 40, 30);

                        // Label
                        ctx.fillStyle = '#cbd5e1';
                        ctx.font = '10px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(label, x, y + 4);

                        // Arrow
                        if (i < steps.length - 1) {
                            ctx.strokeStyle = '#60a5fa';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(x + 20, y);
                            ctx.lineTo(x + stepWidth - 20, y);
                            ctx.stroke();

                            // Arrowhead
                            ctx.fillStyle = '#60a5fa';
                            ctx.beginPath();
                            ctx.moveTo(x + stepWidth - 20, y);
                            ctx.lineTo(x + stepWidth - 25, y - 3);
                            ctx.lineTo(x + stepWidth - 25, y + 3);
                            ctx.closePath();
                            ctx.fill();
                        }
                    });
                }

                // Step 2: Flux Calibration
                const step2Canvas = document.getElementById('kcwi-step2');
                if (step2Canvas) {
                    const ctx = step2Canvas.getContext('2d');
                    const w = step2Canvas.width;
                    const h = step2Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    // Draw standard star spectrum
                    ctx.strokeStyle = '#94a3b8';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    for (let x = 40; x < w - 30; x += 2) {
                        const noise = Math.random() * 10 - 5;
                        const y = h - 50 - 40 * Math.sin((x - 40) / 30) + noise;
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw sensitivity curve (smooth spline)
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#10b981';
                    ctx.beginPath();
                    for (let x = 40; x < w - 30; x++) {
                        const y = h - 50 - 40 * Math.sin((x - 40) / 30);
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Draw spline knots
                    for (let i = 0; i < 4; i++) {
                        const x = 60 + i * 50;
                        const y = h - 50 - 40 * Math.sin((x - 40) / 30);
                        ctx.fillStyle = '#f87171';
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Labels
                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '10px sans-serif';
                    ctx.fillText('Wavelength', w / 2 - 20, h - 10);
                    ctx.save();
                    ctx.translate(15, h / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText('Sensitivity', -25, 0);
                    ctx.restore();
                }

                // Step 3: Sky Subtraction (ZAP)
                const step3Canvas = document.getElementById('kcwi-step3');
                if (step3Canvas) {
                    const ctx = step3Canvas.getContext('2d');
                    const w = step3Canvas.width;
                    const h = step3Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    const midY = h / 2;

                    // Raw spectrum with sky lines (top half)
                    ctx.strokeStyle = '#f87171';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let x = 40; x < w - 30; x++) {
                        let y = midY - 40;
                        // Add sky emission spikes
                        if (x % 40 < 5) y -= 20;
                        if (x % 60 < 5) y -= 15;
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();

                    ctx.fillStyle = '#f87171';
                    ctx.font = '9px sans-serif';
                    ctx.fillText('Raw (with sky)', 45, midY - 60);

                    // Cleaned spectrum (bottom half)
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#10b981';
                    ctx.beginPath();
                    for (let x = 40; x < w - 30; x++) {
                        const y = midY + 40;
                        if (x === 40) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#10b981';
                    ctx.font = '9px sans-serif';
                    ctx.fillText('Sky-subtracted', 45, midY + 65);

                    // PCA arrow
                    ctx.strokeStyle = '#60a5fa';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(w - 60, midY - 20);
                    ctx.lineTo(w - 60, midY + 20);
                    ctx.stroke();

                    ctx.fillStyle = '#60a5fa';
                    ctx.beginPath();
                    ctx.moveTo(w - 60, midY + 20);
                    ctx.lineTo(w - 65, midY + 15);
                    ctx.lineTo(w - 55, midY + 15);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = '#60a5fa';
                    ctx.font = '9px sans-serif';
                    ctx.fillText('PCA', w - 75, midY);
                }

                // Step 4: Mosaicking
                const step4Canvas = document.getElementById('kcwi-step4');
                if (step4Canvas) {
                    const ctx = step4Canvas.getContext('2d');
                    const w = step4Canvas.width;
                    const h = step4Canvas.height;

                    ctx.clearRect(0, 0, w, h);

                    const cx = w / 2;
                    const cy = h / 2;

                    // Draw three cubes being combined
                    const cubes = [
                        { x: cx - 60, y: cy - 20, angle: -5 },
                        { x: cx, y: cy - 25, angle: 0 },
                        { x: cx + 60, y: cy - 20, angle: 5 }
                    ];

                    cubes.forEach((cube, i) => {
                        ctx.save();
                        ctx.translate(cube.x, cube.y);
                        ctx.rotate(cube.angle * Math.PI / 180);

                        // Cube outline
                        ctx.strokeStyle = i === 1 ? '#60a5fa' : 'rgba(96, 165, 250, 0.5)';
                        ctx.lineWidth = i === 1 ? 2 : 1;
                        ctx.strokeRect(-15, -15, 30, 30);

                        ctx.restore();
                    });

                    // Arrows pointing down
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2;
                    cubes.forEach(cube => {
                        ctx.beginPath();
                        ctx.moveTo(cube.x, cube.y + 20);
                        ctx.lineTo(cube.x, cy + 40);
                        ctx.stroke();
                    });

                    // Final mosaic cube
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#10b981';
                    ctx.fillRect(cx - 35, cy + 45, 70, 40);
                    ctx.strokeRect(cx - 35, cy + 45, 70, 40);
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#cbd5e1';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Final Mosaic', cx, cy + 70);
                }
            }
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

                // Initialize canvas visualizations after modal is visible
                if (details.initVisuals) {
                    setTimeout(() => details.initVisuals(), 50);
                }
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
