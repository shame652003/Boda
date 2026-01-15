document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Inicializar GSAP y ScrollTrigger ---
    gsap.registerPlugin(ScrollTrigger);

    // Animación de entrada Hero (Secuencial y Elegante)
    const tl = gsap.timeline();
    tl.from('.gs-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Animación al hacer Scroll
    gsap.utils.toArray('.gs-scroll').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // --- 2. Lluvia de Rosas (Canvas Optimizado - Tonos Dorados/Crema) ---
    const canvas = document.getElementById('rose-rain');
    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    // Menos pétalos en móviles para rendimiento
    const maxPetals = window.innerWidth < 768 ? 25 : 50; 

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
            this.y = Math.random() * height - height;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 1.5 - 0.75;
            this.opacity = Math.random() * 0.4 + 0.1;
            // Colores: Variaciones de dorado, crema y beige
            const colors = [
                 `rgba(74, 0, 18, ${this.opacity})`,   // vinotinto base
                 `rgba(100, 0, 24, ${this.opacity})`,  // un poco más claro
                 `rgba(50, 0, 10, ${this.opacity})`    // más oscuro
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.005) + this.speedX;
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

    // --- 3. Contador Regresivo (Fecha: 14 Feb 2026, 5:00 PM) ---
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
            document.getElementById('countdown').innerHTML = "¡Hoy es el gran día!";
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Llamada inicial

    // ============================
// VARIABLES
// ============================
const rsvpForm = document.getElementById('rsvp-form');
const nameInput = document.getElementById('guest-name');
const companionsSelect = document.getElementById('guest-companions');
const companionsContainer = document.getElementById('companions-container');
const formFeedback = document.getElementById('form-feedback');

const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnSpinner = submitBtn.querySelector('.btn-spinner');

// ============================
// OPCIONES DE PARENTESCO
// ============================
const relationshipOptions = [
    { value: '', text: 'Selecciona parentesco...' },
    { value: 'Pareja', text: 'Esposo/a / Pareja' },
    { value: 'Hijo', text: 'Hijo/a' },
    { value: 'Padre', text: 'Padre / Madre' },
    { value: 'Hermano', text: 'Hermano/a' },
    { value: 'Familiar', text: 'Otro Familiar' },
    { value: 'Amigo', text: 'Amigo/a' }
];

// ============================
// FUNCIONES DE ERROR
// ============================
function showError(input, message) {
    const group = input.parentElement;
    group.classList.add('error');
    group.querySelector('.error-message').innerText = message;
}

function clearError(input) {
    const group = input.parentElement;
    group.classList.remove('error');
    group.querySelector('.error-message').innerText = '';
}

// ============================
// SOLO LETRAS EN EL NOMBRE
// ============================
nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    clearError(nameInput);
});

// ============================
// CAMPOS DINÁMICOS ACOMPAÑANTES
// ============================
companionsSelect.addEventListener('change', function () {
    companionsContainer.innerHTML = '';
    const count = parseInt(this.value);

    for (let i = 1; i <= count; i++) {
        let options = '';
        relationshipOptions.forEach(opt => {
            options += `<option value="${opt.value}">${opt.text}</option>`;
        });

        companionsContainer.innerHTML += `
            <div class="companion-group">
                <h4>Acompañante ${i}</h4>
                <div class="form-group">
                    <label>Nombre Completo *</label>
                    <input type="text" class="comp-name" required>
                    <span class="error-message"></span>
                </div>
                <div class="form-group">
                    <label>Parentesco *</label>
                    <select class="comp-relation" required>
                        ${options}
                    </select>
                    <span class="error-message"></span>
                </div>
            </div>
        `;
    }
});

// ============================
// ENVÍO DEL FORMULARIO
// ============================
rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    formFeedback.innerText = '';
    formFeedback.className = 'form-feedback';

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    // Validar nombre principal
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Ingresa tu nombre.');
        isValid = false;
    } else if (!nameRegex.test(nameInput.value.trim())) {
        showError(nameInput, 'Solo letras permitidas.');
        isValid = false;
    }

    // Validar acompañantes
    const compNames = document.querySelectorAll('.comp-name');
    const compRelations = document.querySelectorAll('.comp-relation');

    compNames.forEach((input) => {
        if (input.value.trim() === '') {
            showError(input, 'Ingresa el nombre.');
            isValid = false;
        }
    });

    compRelations.forEach((select) => {
        if (select.value === '') {
            showError(select, 'Selecciona parentesco.');
            isValid = false;
        }
    });

    // ============================
    // SI TODO ES VÁLIDO
    // ============================
    if (isValid) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';

        const guestName = nameInput.value.trim();
        const guestCount = companionsSelect.value;
        const phone = "+584245994530";

      let message = `CONFIRMACION DE ASISTENCIA

        Hola, un gusto saludarlos.
        Soy ${guestName} y confirmo con alegria mi asistencia a la boda de Pedro & Iris.

        Fecha: 14 de Febrero
        Evento: Boda

        `;

        if (guestCount > 0) {
            message += `Acompanantes (${guestCount}):\n`;
            compNames.forEach((input, i) => {
                const relation = compRelations[i].options[compRelations[i].selectedIndex].text;
                message += ` - ${input.value} (${relation})\n`;
            });
        } else {
            message += `Asistire sin acompanantes.\n`;
        }

        message += `\nMuchas gracias por la invitacion, alli estaremos.`;


        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        formFeedback.innerText = 'Redirigiendo a WhatsApp...';
        formFeedback.classList.add('success');

        setTimeout(() => {
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location.href = url;
            } else {
                window.open(url, '_blank');
            }

            rsvpForm.reset();
            companionsContainer.innerHTML = '';
            formFeedback.innerText = '';

            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        }, 2000);
    } else {
        formFeedback.innerText = 'Completa todos los campos.';
        formFeedback.classList.add('error');
    }
});

});