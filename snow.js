/** Класс снежинки */
class Flake {
    constructor(options) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 0;
        this.alpha = 0;
        this.ns = options.ns;
        this.radiusMax = options.radius;
        this.interval = options.interval;
        this.snowColor = options.snowColor;
        this.snowOpacity = options.snowOpacity;
        this.angle = 0;

        this.reset();
    }

    reset () {
        this.x = this.randBetween(0, window.innerWidth);
        this.y = this.randBetween(0, -window.innerHeight);
        this.vx = this.randBetween(-3, 3);
        this.vy = this.randBetween(2, 5);
        this.radius = this.randBetween(1, this.radiusMax);
        this.alpha = this.randBetween(0.1, this.snowOpacity);
    }

    randBetween (min, max) {
        return min + Math.random() * (max - min);
    }

    update () {
        this.x += this.vx / this.randBetween(3, this.interval);
        this.y += this.vy / this.randBetween(2, this.interval);

        if (this.y + this.radius > window.innerHeight) {
            this.reset();
        }
    }
}

/** Класс снегопада */
class Snow {
    constructor(options) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;z-index:99;top:0;pointer-events:none';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => this.onResize());
        this.onResize();
        this.updateBound = this.update.bind(this);
        requestAnimationFrame(this.updateBound);
        this.createFlakes(options);
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.createVignette();
    }

    createVignette() {
        const xMid = this.width * 0.5;
        const yMid = this.height * 0.5;
        const radius = Math.sqrt(xMid * xMid + yMid * yMid);
        this.vignette = this.ctx.createRadialGradient(xMid, yMid, radius / 5, xMid, yMid, radius * 1.075);

        for (let i = 0; i <= 1; i += 0.1) {
            const alpha = Math.pow(i, 3);
            this.vignette.addColorStop(0.7 + i * 0.3, `rgba(30, 30, 30, ${alpha})`);
        }
    }

    createFlakes(options) {
        const flakes = window.innerWidth / 2;
        this.snowflakes = [];

        for (let s = 0; s < flakes; s++) {
            this.snowflakes.push(new Flake(options));
        }
    }

    update () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const flake of this.snowflakes) {
            flake.update();
            this.ctx.save();
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.globalAlpha = flake.alpha;
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.fillStyle = this.vignette;
        this.ctx.fillRect(0, 0, this.width, this.height);
        requestAnimationFrame(this.updateBound);
    }
}

/**
 * Настройки снега
 * @constant {Object} options
 * @property {string} options.snowColor - цвет снежинок
 * @property {number} options.snowOpacity - прозрачность снежинок
 * @property {object} options.ns - количество снежинок на канвасе
 * @property {number} options.radius - максимальный размер снежинок
 * @property {number} options.interval - замедление снегопада [3-15]
 */
const options = {
  snowColor: '255,255,255',
  snowOpacity: 0.8,
  ns: 150,
  radius: 4,
  interval: 10
}

let s = new Snow(options);
