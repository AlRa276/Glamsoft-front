// Gestión de Servicios - Vista Cliente
class ServiciosCliente {
    constructor() {
        this.servicios = [];
        this.categoriaActual = 'todos';
        this.init();
    }

    async init() {
        try {
            await this.loadServicios();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error al inicializar:', error);
        }
    }

    setupEventListeners() {
        // Filtros por categoría
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.categoriaActual = e.target.dataset.category;
                this.renderServicios();
            });
        });
    }

    async loadServicios() {
        this.showLoader();
        try {
            const response = await ServiciosService.getAll();
            const serviciosActivos = (response.data || response || []).filter(s => s.activo);
            this.servicios = serviciosActivos;
            this.renderServicios();
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            this.showNotification('Error al cargar servicios', 'error');
        } finally {
            this.hideLoader();
        }
    }

    renderServicios() {
        const container = document.querySelector('.services-list');
        if (!container) return;

        let serviciosFiltrados = this.servicios;
        if (this.categoriaActual !== 'todos') {
            serviciosFiltrados = this.servicios.filter(s =>
                (s.categoria || '').toLowerCase().includes(this.categoriaActual.toLowerCase())
            );
        }

        if (serviciosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-cut" style="font-size: 48px; color: #bdc3c7; margin-bottom: 15px;"></i>
                    <p>No hay servicios disponibles en esta categoría</p>
                </div>
            `;
            return;
        }

        container.innerHTML = serviciosFiltrados.map(servicio => `
            <div class="service-card">
                <div class="service-image">
                    ${servicio.imagenURL ? 
                        `<img src="${servicio.imagenURL}" alt="${servicio.nombre}">` :
                        `<div class="placeholder-image"><i class="fas fa-scissors"></i></div>`
                    }
                </div>
                <div class="service-content">
                    <h3 class="service-title">${servicio.nombre}</h3>
                    <p class="service-category">${servicio.categoria || 'General'}</p>
                    <p class="service-description">${servicio.descripcion || 'Servicio profesional de belleza'}</p>
                    <div class="service-footer">
                        <div class="service-info">
                            <span class="service-price">$${parseFloat(servicio.precio).toFixed(2)}</span>
                            <span class="service-duration"><i class="far fa-clock"></i> ${servicio.duracion} min</span>
                        </div>
                        <button class="btn-agendar-servicio" data-servicio-id="${servicio.idServicio}">Agendar</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Agregar eventos a los botones después de renderizar
        this.attachAgendarButtons();
    }

    attachAgendarButtons() {
        // ✅ CAMBIO CRÍTICO: Verificar login antes de agendar
        document.querySelectorAll('.btn-agendar-servicio').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const idServicio = parseInt(e.target.dataset.servicioId);
                
                // Verificar si está logeado
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                
                if (!isLoggedIn) {
                    // No está logeado: guardar selección y abrir modal de auth
                    console.log('Usuario no logeado - abriendo modal de autenticación');
                    
                    // Guardar servicio seleccionado para después del login
                    localStorage.setItem('servicioSeleccionado', idServicio.toString());
                    
                    const servicio = this.servicios.find(s => s.idServicio === idServicio);
                    if (servicio) {
                        localStorage.setItem('servicioSeleccionadoData', JSON.stringify(servicio));
                    }
                    
                    // Guardar que queremos ir a agendar después del login
                    sessionStorage.setItem('redirectAfterAuth', 'agendar.html');
                    
                    // Abrir modal de autenticación
                    const authModal = document.getElementById('authModal');
                    if (authModal) {
                        authModal.style.display = 'flex';
                    } else {
                        console.error('Modal de autenticación no encontrado');
                        alert('Debes iniciar sesión para agendar una cita');
                        window.location.href = 'inicio.html';
                    }
                } else {
                    // Está logeado: proceder normalmente
                    this.agendarServicio(idServicio);
                }
            });
        });
    }

    agendarServicio(idServicio) {
        const servicio = this.servicios.find(s => s.idServicio === idServicio);
        if (!servicio) {
            console.error('Servicio no encontrado:', idServicio);
            this.showNotification('Servicio no encontrado', 'error');
            return;
        }

        // Guardar selección y redirigir a agendar
        try {
            localStorage.setItem('servicioSeleccionado', idServicio.toString());
            localStorage.setItem('servicioSeleccionadoData', JSON.stringify(servicio));
            
            console.log('Redirigiendo a agendar.html con servicio:', idServicio);
            window.location.href = 'agendar.html';
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            this.showNotification('No se pudo continuar al agendado. Intenta nuevamente.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px;
            border-radius: 8px; background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showLoader() { 
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex'; 
    }
    
    hideLoader() { 
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none'; 
    }
}

// Inicializar
let serviciosCliente;
document.addEventListener('DOMContentLoaded', () => {
    serviciosCliente = new ServiciosCliente();
});