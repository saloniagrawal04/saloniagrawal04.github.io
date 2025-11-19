/* Lab Notebook Scripts */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initAGNVisual();
    initGCVisual();
    initDMVisual();
});

/* Hero Canvas: Ink Particle Field */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null };

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.color = 'rgba(255, 255, 255, 0.5)'; // White ink on navy
        }

        update() {
            // Gentle swirl towards mouse
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.vx += dx * 0.0001;
                    this.vy += dy * 0.0001;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            // Friction
            this.vx *= 0.99;
            this.vy *= 0.99;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* AGN Visual: Interactive Bicone Sketch */
function initAGNVisual() {
    const container = document.getElementById('agn-visual');
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('agn-slider');

    let angle = 45;
    if (slider) {
        slider.addEventListener('input', (e) => {
            angle = parseInt(e.target.value);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const len = 80;
        const rad = angle * (Math.PI / 180);

        ctx.strokeStyle = '#1B1B1B';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw Top Cone
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(rad) * len, cy - Math.cos(rad) * len);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - Math.sin(rad) * len, cy - Math.cos(rad) * len);
        // Arc top
        ctx.moveTo(cx - Math.sin(rad) * len, cy - Math.cos(rad) * len);
        ctx.quadraticCurveTo(cx, cy - Math.cos(rad) * len - 20, cx + Math.sin(rad) * len, cy - Math.cos(rad) * len);
        ctx.stroke();

        // Draw Bottom Cone
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(rad) * len, cy + Math.cos(rad) * len);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - Math.sin(rad) * len, cy + Math.cos(rad) * len);
        // Arc bottom
        ctx.moveTo(cx - Math.sin(rad) * len, cy + Math.cos(rad) * len);
        ctx.quadraticCurveTo(cx, cy + Math.cos(rad) * len + 20, cx + Math.sin(rad) * len, cy + Math.cos(rad) * len);
        ctx.stroke();

        // Arrows (Outflow)
        ctx.strokeStyle = '#FF857C'; // Coral arrows
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - len - 20);
        ctx.moveTo(cx - 5, cy - len - 15);
        ctx.lineTo(cx, cy - len - 20);
        ctx.lineTo(cx + 5, cy - len - 15);
        ctx.stroke();

        requestAnimationFrame(draw);
    }
    draw();
}

/* GC Visual: N-Body Sketch */
function initGCVisual() {
    const container = document.getElementById('gc-visual');
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const stars = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    class Star {
        constructor() {
            this.angle = Math.random() * Math.PI * 2;
            this.r = Math.random() * 60 + 10;
            this.speed = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
            this.size = Math.random() * 3 + 1;
        }
        update() {
            this.angle += this.speed;
        }
        draw() {
            const x = cx + Math.cos(this.angle) * this.r;
            const y = cy + Math.sin(this.angle) * this.r * 0.6; // Elliptical orbit
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#1B1B1B';
            ctx.fill();
        }
    }

    for (let i = 0; i < 20; i++) stars.push(new Star());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw cluster center
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1B1B1B';
        ctx.fill();

        stars.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* DM Visual: Pulse Sketch */
function initDMVisual() {
    const container = document.getElementById('dm-visual');
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let pulseY = canvas.height;
    let active = false;

    container.addEventListener('mouseenter', () => active = true);
    container.addEventListener('mouseleave', () => active = false);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw TPC "wires"
        ctx.strokeStyle = '#CCC';
        ctx.lineWidth = 1;
        for (let i = 20; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 20);
            ctx.lineTo(i, canvas.height - 20);
            ctx.stroke();
        }

        if (active) {
            pulseY -= 2;
            if (pulseY < 20) pulseY = canvas.height - 20;

            // Draw pulse
            ctx.fillStyle = '#8BB7F0'; // Sky blue pulse
            ctx.beginPath();
            ctx.arc(canvas.width / 2, pulseY, 10, 0, Math.PI * 2);
            ctx.fill();

            // Draw wave
            ctx.strokeStyle = '#8BB7F0';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, pulseY, 20, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            pulseY = canvas.height - 20;
        }

        requestAnimationFrame(draw);
    }
    draw();
}
