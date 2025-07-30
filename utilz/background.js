export function initBackground() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const blobs = [], sparkles = [];

    class Blob {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 60 + Math.random() * 60;
        this.color = `hsla(${Math.random() * 360}, 80%, 60%, 0.6)`;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalCompositeOperation = "lighter";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Sparkle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3 + Math.random() * 5;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.alpha = 1;
        this.color = `hsla(${Math.random() * 360}, 100%, 70%, ${this.alpha})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 70%, ${this.alpha})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(blob => { blob.update(); blob.draw(); });
      sparkles.forEach((sparkle, index) => {
        sparkle.update(); sparkle.draw();
        if (sparkle.alpha <= 0) sparkles.splice(index, 1);
      });
      requestAnimationFrame(animate);
    }

    for (let i = 0; i < 10; i++) blobs.push(new Blob());

    document.addEventListener("click", e => {
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 20; i++) sparkles.push(new Sparkle(x, y));
    });

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    animate();
}