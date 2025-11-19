/* Physics Playground Scripts */

document.addEventListener('DOMContentLoaded', () => {
    initHeroPhysics();
    initGCPhysics();
});

/* Hero Section: Gravity Particles */
function initHeroPhysics() {
    const canvas = document.getElementById('physics-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 2 + 1;
            // Updated colors: Soft Sky Blue and Coral Highlight
            this.color = Math.random() > 0.5 ? '#9BBDF9' : '#FF7F6A';
        }

        update() {
            // Gravity towards mouse
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 300;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * 0.5;
                const directionY = forceDirectionY * force * 0.5;

                if (distance < maxDistance) {
                    this.vx += directionX;
                    this.vy += directionY;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            // Friction
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connecting lines
        particles.forEach((a, index) => {
            particles.slice(index + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    // Updated line color: Ink Black with low opacity for subtle connections
                    ctx.strokeStyle = `rgba(28, 28, 28, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* Globular Cluster Mini-Sim */
function initGCPhysics() {
    const container = document.getElementById('gc-canvas-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const stars = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    class Star {
        constructor() {
            this.angle = Math.random() * Math.PI * 2;
            this.radius = Math.random() * 80;
            this.speed = (Math.random() * 0.02) + 0.005;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.angle += this.speed;
            this.x = centerX + Math.cos(this.angle) * this.radius;
            this.y = centerY + Math.sin(this.angle) * this.radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Updated star color: Ink Black for visibility on white card background
            ctx.fillStyle = '#1C1C1C';
            ctx.fill();
        }
    }

    for (let i = 0; i < 30; i++) {
        stars.push(new Star());
    }

    function animate() {
        // Clear with transparency for trail effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
