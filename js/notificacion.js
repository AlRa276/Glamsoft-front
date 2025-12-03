// --- Función para inicializar los eventos del modal ---
function initNotificacionesModal() {
    const modal = document.getElementById('notificaciones-modal');
    const bellIcon = document.querySelector('.fa-bell');

    if (!modal || !bellIcon) return; // seguridad

    // CORREGIDO: El botón de cierre tiene la clase .close-btn-notif
    const closeBtn = modal.querySelector('.close-btn-notif'); 

    // Mostrar modal al hacer clic en la campana
    bellIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // evita que se cierre inmediatamente
        
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block';
            // Llamamos a la función (ahora vacía) por si en el futuro
            // quieres añadir lógica aquí (ej. mostrar puntos rojos)
            loadNotificaciones(); 
        }
    });

    // Cerrar con el botón "X"
    if (closeBtn) { // Añadimos un 'if' por seguridad
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.style.display = 'none';
        });
    }

    // Cerrar al hacer clic fuera del contenido del modal
    document.addEventListener('click', (e) => {
        if (
            modal.style.display === 'block' &&
            !modal.contains(e.target) &&
            !bellIcon.contains(e.target)
        ) {
            modal.style.display = 'none';
        }
    });

    // Cerrar al hacer scroll o deslizar en cualquier parte
    window.addEventListener('scroll', () => {
        if (modal.style.display === 'block') modal.style.display = 'none';
    });

    // Cerrar al deslizar en pantallas táctiles (swipe)
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        const touchEndY = e.touches[0].clientY;
        const diff = Math.abs(touchEndY - touchStartY);
        if (diff > 30 && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// --- Función para cargar el HTML del modal y luego inicializarlo ---
function loadModalNotificaciones() {
    fetch('modals/notificaciones.html') // ajusta la ruta si es necesario
        .then((res) => res.text())
        .then((html) => {
            const placeholder = document.getElementById('modal-placeholder');
            // Usamos += para no sobreescribir otros modales
            placeholder.innerHTML += html; 
            initNotificacionesModal(); // Esto inicializa los listeners
        })
        .catch((err) =>
            console.error('Error cargando notificaciones:', err)
        );
}

// --- Cargar contenido del modal al inicio ---
// Asegúrate de que esto se llame desde tu script principal
// document.addEventListener('DOMContentLoaded', loadModalNotificaciones);

// --- Función para llenar la lista de notificaciones (MODIFICADA) ---
function loadNotificaciones() {
    // El contenido ahora es ESTÁTICO en el HTML.
    // Esta función ya no necesita añadir 'li' elements.
    // Se puede dejar vacía o usarse en el futuro.
    console.log("Modal de notificaciones abierto.");
}