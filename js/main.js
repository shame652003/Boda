document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Inicializar GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // Animación de entrada Hero (Secuencial)
    const tl = gsap.timeline();
    tl.from('.gs-reveal', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Animación al hacer Scroll (Títulos y bloques)
    gsap.utils.toArray('.gs-scroll').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1
        });
    });

    // Animación lateral para tarjetas (Desktop y Mobile)
    gsap.from('.gs-scroll-left', {
        scrollTrigger: { trigger: '.gs-scroll-left', start: 'top 85%' },
        x: -50, opacity: 0, duration: 1
    });
    
    gsap.from('.gs-scroll-right', {
        scrollTrigger: { trigger: '.gs-scroll-right', start: 'top 85%' },
        x: 50, opacity: 0, duration: 1, delay: 0.2
    });

    // --- 2. Lluvia de Rosas (Canvas Optimizado) ---
    const canvas = document.getElementById('rose-rain');
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Array para guardar las partículas
    const petals = [];
    // Número de rosas según el tamaño de pantalla
    const maxPetals = window.innerWidth < 768 ? 30 : 60; 

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Petal {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height; // Empiezan arriba
            this.size = Math.random() * 15 + 10; // Tamaño variable
            this.speedY = Math.random() * 1 + 0.5; // Caída lenta
            this.speedX = Math.random() * 1 - 0.5; // Movimiento lateral suave
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.3 + 0.1; // Opacidad baja (sutil)
            // Color de pétalo (Variaciones de rojo/rosa)
            this.color = `rgba(${128 + Math.random() * 50}, 0, 32, ${this.opacity})`;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX; // Movimiento oscilante
            this.rotation += this.rotationSpeed;

            if (this.y > height) {
                this.y = -50;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.beginPath();
            
            // Dibujar forma de pétalo simple
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
            ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
            
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function initPetals() {
        for (let i = 0; i < maxPetals; i++) {
            petals.push(new Petal());
        }
    }

    function animatePetals() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animatePetals);
    }

    initPetals();
    animatePetals();

    // --- 3. Contador Regresivo ---
    const eventDate = new Date('February 14, 2026 17:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = "¡Es hoy!";
        }
    }

    setInterval(updateCountdown, 1000);

    // --- 4. Funcionalidad RSVP WhatsApp ---
    const form = document.getElementById('rsvp-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('guest-name').value;
        
        // NÚMERO DE TELÉFONO DE LA NOVIA (Añadir código de país, ej: 58 para Venezuela)
        // IMPORTANTE: Cambia esto por el número real
        const phoneNumber = "+58 412-6729542"; 
        
        const message = `¡Hola Iris! Soy ${guestName}. Confirmo mi asistencia para su boda el 14 de Febrero. ¡Gracias por la invitación! 💍`;
        
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
    });
});