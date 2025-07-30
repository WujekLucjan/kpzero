// ========== MOTYW ==========
function changeTheme(theme) {
    document.body.classList.remove('theme-white', 'theme-red', 'theme-black');
    document.body.classList.add(`theme-${theme}`);

    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.href = `img/moon_${theme}.png`;
    }

    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'black';
    changeTheme(savedTheme);
    initAudioPlayers();
});

// ========== AUDIO ==========
function initAudioPlayers() {
    const audioBlocks = document.querySelectorAll('.audio-block');

    audioBlocks.forEach(block => {
        const src = block.dataset.src;
        const audio = new Audio(src);
        audio.preload = 'metadata';

        const btn = block.querySelector('.btn-playpause');
        const progressContainer = block.querySelector('.progress-container');
        const progressBar = block.querySelector('.progress');
        const timeDisplay = block.querySelector('.time');

        btn.addEventListener('click', () => {
            document.querySelectorAll('.audio-block').forEach(other => {
                if (other !== block && other._audio && !other._audio.paused) {
                    other._audio.pause();
                    other.querySelector('.btn-playpause').innerHTML = '&#9658;';
                }
            });
            audio.paused ? audio.play() : audio.pause();
        });

        audio.addEventListener('play', () => btn.innerHTML = '&#10073;&#10073;');
        audio.addEventListener('pause', () => btn.innerHTML = '&#9658;');

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = percent + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            }
        });

        progressContainer.addEventListener('click', e => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            audio.currentTime = (clickX / rect.width) * audio.duration;
        });

        block._audio = audio;
    });
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// ========== POPIÓŁ ==========
const canvasAsh = document.getElementById('ashParticles');
const ctxAsh = canvasAsh.getContext('2d');
let ashParticles = [];

function resizeAshCanvas() {
    canvasAsh.width = window.innerWidth;
    canvasAsh.height = window.innerHeight;
}
window.addEventListener('resize', resizeAshCanvas);
resizeAshCanvas();

class AshParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvasAsh.width;
        this.y = Math.random() * canvasAsh.height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.y += this.speed;
        if (this.y > canvasAsh.height) {
            this.reset();
            this.y = 0;
        }
    }
    draw() {
        ctxAsh.beginPath();
        ctxAsh.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxAsh.fillStyle = `rgba(200, 200, 200, ${this.alpha})`;
        ctxAsh.fill();
    }
}

for (let i = 0; i < 100; i++) {
    ashParticles.push(new AshParticle());
}

function animateAsh() {
    ctxAsh.clearRect(0, 0, canvasAsh.width, canvasAsh.height);
    ashParticles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateAsh);
}
animateAsh();

// ========== PŁATKI RÓŻ ==========
const roseContainer = document.getElementById("rose-container");

function createRosePetal() {
    const petal = document.createElement("img");
    petal.src = "img/rose_petals.png";
    petal.className = "rose-petal";

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 4 + Math.random() * 3 + "s";
    petal.style.opacity = Math.random();
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;

    roseContainer.appendChild(petal);

    setTimeout(() => {
        roseContainer.removeChild(petal);
    }, 7000);
}
setInterval(createRosePetal, 400);

// ========== DYM ==========
const canvasSmoke = document.getElementById("smokeCanvas");
const ctxSmoke = canvasSmoke.getContext("2d");
let smokeParticles = [];

function resizeSmokeCanvas() {
    canvasSmoke.width = window.innerWidth;
    canvasSmoke.height = window.innerHeight;
}
resizeSmokeCanvas();
window.addEventListener("resize", resizeSmokeCanvas);

class SmokeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20 + Math.random() * 30;
        this.alpha = 0.2 + Math.random() * 0.2;
        this.velocityX = (Math.random() - 0.5) * 0.4;
        this.velocityY = -0.5 - Math.random() * 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.rotation += this.rotationSpeed;
        this.alpha *= 0.99;
    }

    draw() {
        ctxSmoke.save();
        ctxSmoke.translate(this.x, this.y);
        ctxSmoke.rotate(this.rotation);
        const gradient = ctxSmoke.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(200, 200, 200, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
        ctxSmoke.fillStyle = gradient;
        ctxSmoke.beginPath();
        ctxSmoke.arc(0, 0, this.size, 0, Math.PI * 2);
        ctxSmoke.fill();
        ctxSmoke.restore();
    }

    isDead() {
        return this.alpha < 0.01;
    }
}

function animateSmoke() {
    ctxSmoke.clearRect(0, 0, canvasSmoke.width, canvasSmoke.height);

    const baseX = canvasSmoke.width / 2;
    const baseY = canvasSmoke.height - 80;
    for (let i = 0; i < 2; i++) {
        smokeParticles.push(new SmokeParticle(
            baseX + (Math.random() - 0.5) * 20,
            baseY
        ));
    }

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.update();
        p.draw();
        if (p.isDead()) {
            smokeParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateSmoke);
}
animateSmoke();
