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
    // --- 4. Funcionalidad Dinámica y Validaciones RSVP ---
    const rsvpForm = document.getElementById('rsvp-form');
    const nameInput = document.getElementById('guest-name');
    const companionsSelect = document.getElementById('guest-companions');
    const companionsContainer = document.getElementById('companions-container');
    const formFeedback = document.getElementById('form-feedback');

    // Lista de opciones para el parentesco
    const relationshipOptions = [
        { value: '', text: 'Selecciona parentesco...' },
        { value: 'Pareja', text: 'Esposo/a / Pareja' },
        { value: 'Hijo', text: 'Hijo/a' },
        { value: 'Padre', text: 'Padre / Madre' },
        { value: 'Hermano', text: 'Hermano/a' },
        { value: 'Familiar', text: 'Otro Familiar (Tío, Primo, Abuelo)' },
        { value: 'Amigo', text: 'Amigo/a' }
    ];

    // Función auxiliar para mostrar errores
    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        // Si no existe un span de error, lo creamos dinámicamente (útil para campos generados)
        let errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            formGroup.appendChild(errorSpan);
        }
        formGroup.classList.add('error');
        errorSpan.innerText = message;
    }

    // Función auxiliar para limpiar errores
    function clearError(inputElement) {
        const formGroup = inputElement.parentElement;
        formGroup.classList.remove('error');
        const errorSpan = formGroup.querySelector('.error-message');
        if (errorSpan) errorSpan.innerText = ''; // Limpiar texto
    }

    // --- LÓGICA DINÁMICA: Generar campos de acompañantes ---
    companionsSelect.addEventListener('change', function() {
        const count = parseInt(this.value);
        companionsContainer.innerHTML = ''; // Limpiar contenedor anterior

        for (let i = 1; i <= count; i++) {
            // Crear estructura HTML para cada acompañante
            const div = document.createElement('div');
            div.className = 'companion-group';
            
            // Generar opciones del select de parentesco
            let optionsHtml = '';
            relationshipOptions.forEach(opt => {
                optionsHtml += `<option value="${opt.value}">${opt.text}</option>`;
            });

            div.innerHTML = `
                <h4>Acompañante ${i}</h4>
                <div class="companion-row">
                    <div class="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" class="comp-name" placeholder="Nombre del acompañante" required>
                    </div>
                    <div class="form-group">
                        <label>Parentesco *</label>
                        <select class="comp-relation" required>
                            ${optionsHtml}
                        </select>
                    </div>
                </div>
            `;
            companionsContainer.appendChild(div);
        }
        
        // Refrescar ScrollTrigger si es necesario (por el cambio de altura)
        ScrollTrigger.refresh();
    });

    // --- VALIDACIÓN Y ENVÍO ---
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') clearError(nameInput);
    });

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        formFeedback.innerText = '';
        formFeedback.className = 'form-feedback';

        // 1. Validar Nombre del Invitado Principal
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Por favor, ingresa tu nombre completo.');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // 2. Validar Campos Dinámicos (si existen)
        const compNames = document.querySelectorAll('.comp-name');
        const compRelations = document.querySelectorAll('.comp-relation');

        compNames.forEach((input, index) => {
            if (input.value.trim() === '') {
                showError(input, 'Ingresa el nombre.');
                isValid = false;
            } else {
                clearError(input);
            }
        });

        compRelations.forEach((select, index) => {
            if (select.value === '') {
                showError(select, 'Selecciona parentesco.');
                isValid = false;
            } else {
                clearError(select);
            }
        });

        if (isValid) {
            const guestName = nameInput.value.trim();
            const guestCount = companionsSelect.value;
            
            // NÚMERO DE WHATSAPP (REEMPLAZAR AQUÍ)
            const targetPhoneNumber = "+584245994530"; 
            
            // Construir Mensaje
            let message = `¡Hola! Iris y Pedro Soy  *${guestName}*. \nConfirmo mi asistencia para la boda de Pedro & Iris el 14 de Febrero. 💍\n`;

            if (guestCount > 0) {
                message += `\nAsistiré con *${guestCount} acompañante(s)*:\n`;
                compNames.forEach((input, index) => {
                    const name = input.value.trim();
                    const relation = compRelations[index].options[compRelations[index].selectedIndex].text;
                    message += `👤 ${name} (${relation})\n`;
                });
            } else {
                message += `\nAsistiré sin acompañantes.`;
            }
            
            const url = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;
            
            formFeedback.innerText = '¡Todo listo! Abriendo WhatsApp...';
            formFeedback.classList.add('success');
            
            setTimeout(() => {
                window.open(url, '_blank');
                // Opcional: rsvpForm.reset(); companionsContainer.innerHTML = '';
            }, 1500);

        } else {
             formFeedback.innerText = 'Por favor, completa todos los campos requeridos.';
             formFeedback.classList.add('error');
        }
    });
});