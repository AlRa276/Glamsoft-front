document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pre-cita-form');
    const inputAlergias = document.getElementById('pregunta-alergias');
    const inputCondiciones = document.getElementById('pregunta-condiciones');
    const errorAlergias = document.getElementById('error-alergias');
    const errorCondiciones = document.getElementById('error-condiciones');

    // Función para validar un campo específico
    function validateField(inputElement, errorElement, message) {
        const value = inputElement.value.trim(); // .trim() elimina espacios en blanco al inicio y final
        if (value === '') {
            errorElement.textContent = message; // Establece el mensaje de error
            errorElement.style.display = 'block'; // Muestra el mensaje de error
            inputElement.closest('.form-group').classList.add('error'); // Añade clase de error al grupo
            return false;
        } else {
            errorElement.style.display = 'none'; // Oculta el mensaje de error
            inputElement.closest('.form-group').classList.remove('error'); // Quita clase de error
            return true;
        }
    }

    // Escuchar el evento submit del formulario
    form.addEventListener('submit', function(event) {
        let formIsValid = true;

        // Validar cada campo
        const isAlergiasValid = validateField(inputAlergias, errorAlergias, 'No se puede dejar el campo vacío.');
        const isCondicionesValid = validateField(inputCondiciones, errorCondiciones, 'No se puede dejar el campo vacío.');

        // Si algún campo no es válido, el formulario no es válido
        if (!isAlergiasValid || !isCondicionesValid) {
            formIsValid = false;
        }

        if (!formIsValid) {
            event.preventDefault(); // Detener el envío del formulario si hay errores
        } else {
            // Aquí puedes añadir la lógica para enviar el formulario (ej. AJAX)
            alert('Formulario enviado con éxito (¡en un escenario real, iría a un servidor!)');
            // Por ahora, para la demo, también evitamos el envío real
            event.preventDefault(); 
        }
    });

    // Opcional: Validar en tiempo real cuando el usuario escribe (o cuando pierde el foco)
    inputAlergias.addEventListener('input', function() {
        validateField(inputAlergias, errorAlergias, 'No se puede dejar el campo vacío.');
    });

    inputCondiciones.addEventListener('input', function() {
        validateField(inputCondiciones, errorCondiciones, 'No se puede dejar el campo vacío.');
    });

});