function showConfirmationModal(title, message) {
    // 1. Obtener los elementos del modal
    const overlay = document.getElementById('confirm-modal-overlay');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const btnYes = document.getElementById('confirm-yes');
    const btnNo = document.getElementById('confirm-no');
    const btnCloseX = document.getElementById('confirm-close-x');

    // 2. Poner el texto
    titleEl.textContent = title;
    messageEl.innerHTML = message; // Usamos innerHTML para los <br>

    // 3. Mostrar el modal
    overlay.classList.add('visible');

    // 4. Crear y devolver la Promesa
    return new Promise((resolve) => {
        
        // 5. Definir listeners que solo se ejecutan UNA VEZ
        
        // Resolver a 'true' si se hace clic en 'Sí'
        btnYes.addEventListener('click', () => {
            overlay.classList.remove('visible');
            resolve(true);
        }, { once: true }); // {once: true} es clave para que no se acumulen

        // Resolver a 'false' si se hace clic en 'No'
        btnNo.addEventListener('click', () => {
            overlay.classList.remove('visible');
            resolve(false);
        }, { once: true });

        // Resolver a 'false' si se cierra con la 'X'
        btnCloseX.addEventListener('click', () => {
            overlay.classList.remove('visible');
            resolve(false);
        }, { once: true });
    });
}