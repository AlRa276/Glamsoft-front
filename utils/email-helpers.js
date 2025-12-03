/**
 * Funciones auxiliares para preparar datos de emails
 * Agregar este archivo en: js/utils/email-helpers.js
 */

const EmailHelpers = {
    /**
     * Extraer información completa de una cita para enviar emails
     * @param {Object} cita - Objeto de cita del backend
     * @returns {Promise<Object>} Datos formateados para email
     */
    async prepararDatosCita(cita) {
        try {
            console.log('📋 Preparando datos de cita para email:', cita);

            // Extraer fecha y hora
            let fecha = '';
            let hora = '';

            if (Array.isArray(cita.fechaHoraCita) && cita.fechaHoraCita.length >= 3) {
                const [year, month, day, hour, minute] = cita.fechaHoraCita;
                fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (hour !== undefined && minute !== undefined) {
                    hora = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                }
            }

            // Extraer servicios
            let servicioNombre = 'Servicio';
            if (Array.isArray(cita.servicios) && cita.servicios.length > 0) {
                servicioNombre = cita.servicios.map(s => s.nombre || s).join(', ');
            }

            // Extraer nombre del estilista
            const estilistaNombre = cita.nombreEstilista || cita.estilista?.nombre || 'Tu estilista';

            // Obtener email del cliente
            let clienteEmail = null;
            let clienteNombre = cita.nombreCliente || cita.cliente?.nombre || 'Cliente';

            try {
                if (cita.telefonoCliente) {
                    const url = API_CONFIG.buildUrl(`/usuarios/telefono/${cita.telefonoCliente}`);
                    const response = await httpService.get(url);
                    const userData = response.data?.data || response.data;
                    clienteEmail = userData?.email;
                    clienteNombre = userData?.nombre || clienteNombre;
                    console.log('✅ Email del cliente obtenido:', clienteEmail);
                }
            } catch (error) {
                console.warn('⚠️ No se pudo obtener el email del cliente:', error);
            }

            return {
                email: clienteEmail,
                nombreCliente: clienteNombre,
                fecha: fecha,
                hora: hora,
                servicio: servicioNombre,
                estilista: estilistaNombre,
                precio: cita.precioTotal || 0
            };

        } catch (error) {
            console.error('❌ Error al preparar datos de cita:', error);
            throw error;
        }
    },

    /**
     * Enviar email de cancelación con toda la lógica incluida
     * @param {Object} cita - Objeto de cita completo
     * @param {string} motivo - Motivo de cancelación
     */
    async enviarEmailCancelacion(cita, motivo = '') {
        try {
            console.log('📧 Iniciando envío de email de cancelación...');

            // Preparar datos
            const emailData = await this.prepararDatosCita(cita);
            emailData.motivoCancelacion = motivo;

            console.log('📤 Datos preparados para email de cancelación:', emailData);

            // Verificar que EmailService esté disponible y configurado
            if (typeof EmailService === 'undefined') {
                console.warn('⚠️ EmailService no está disponible');
                return { success: false, message: 'EmailService no disponible' };
            }

            if (!EmailService.isConfigured()) {
                console.warn('⚠️ EmailService no está configurado correctamente');
                return { success: false, message: 'EmailService no configurado' };
            }

            // Enviar email
            const result = await EmailService.enviarCancelacionCita(emailData);

            if (result.success) {
                console.log('✅ Email de cancelación enviado exitosamente');
            } else {
                console.warn('⚠️ No se pudo enviar email de cancelación:', result.message);
            }

            return result;

        } catch (error) {
            console.error('❌ Error al enviar email de cancelación:', error);
            return {
                success: false,
                message: error.message || 'Error al enviar email',
                error
            };
        }
    },

    /**
     * Enviar email de rechazo con toda la lógica incluida
     * @param {Object} cita - Objeto de cita completo
     * @param {string} motivo - Motivo del rechazo
     */
    async enviarEmailRechazo(cita, motivo = '') {
        try {
            console.log('📧 Iniciando envío de email de rechazo...');

            // Preparar datos
            const emailData = await this.prepararDatosCita(cita);
            emailData.motivoRechazo = motivo;

            console.log('📤 Datos preparados para email de rechazo:', emailData);

            // Verificar que EmailService esté disponible y configurado
            if (typeof EmailService === 'undefined') {
                console.warn('⚠️ EmailService no está disponible');
                return { success: false, message: 'EmailService no disponible' };
            }

            if (!EmailService.isConfigured()) {
                console.warn('⚠️ EmailService no está configurado correctamente');
                return { success: false, message: 'EmailService no configurado' };
            }

            // Enviar email
            const result = await EmailService.enviarRechazo(emailData);

            if (result.success) {
                console.log('✅ Email de rechazo enviado exitosamente');
            } else {
                console.warn('⚠️ No se pudo enviar email de rechazo:', result.message);
            }

            return result;

        } catch (error) {
            console.error('❌ Error al enviar email de rechazo:', error);
            return {
                success: false,
                message: error.message || 'Error al enviar email',
                error
            };
        }
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailHelpers;
}