// js/modal.js

/**
 * Cierra todos los modales abiertos.
 */
export function closeAllModals() {
    const allModals = document.querySelectorAll('#authModal, #notificaciones-modal, #profileMenuModal');
    allModals.forEach(m => {
        if (m) m.style.display = 'none';
    });
}

/**
 * Inicializa los eventos globales para cerrar modales (Overlay, 'X', tecla Esc).
 * Excluye el profileMenuModal que tiene su propio "click-outside".
 */
export function initGlobalModalClose() {
    const modals = document.querySelectorAll('#authModal, #notificaciones-modal');

    modals.forEach(modal => {
        if (!modal) return;

        const closeBtn = modal.querySelector('.close-btn-auth, .close-btn-notif');
        const modalContent = modal.querySelector('.modal-content, .modal-content-notificaciones');

        // Cerrar al hacer clic en el botón X
        if (closeBtn) {
            closeBtn.addEventListener('click', e => {
                e.stopPropagation();
                closeAllModals();
            });
        }

        // Evitar cierre si se hace clic dentro del contenido
        if (modalContent) {
            modalContent.addEventListener('click', e => e.stopPropagation());
        }

        // Cerrar si se hace clic fuera del contenido (en el overlay)
        modal.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Cerrar todas las modales con la tecla ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}