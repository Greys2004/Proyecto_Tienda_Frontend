document.addEventListener('DOMContentLoaded', () => {
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }

            const data = {
                correo: email,
                contrasena: password,
                telefono: "1234567890",
                direccionEntrega: {
                    calle: "Calle Ejemplo",
                    numero: "123",
                    colonia: "Colonia Ejemplo",
                    ciudad: "Ciudad Ejemplo",
                    estado: "Estado Ejemplo",
                    codigoPostal: "00000"
                },
                roles: email.includes('@admin.com') ? ['admin'] : ['cliente']
            };

            try {
                const response = await fetch('http://localhost:3000/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage('Usuario registrado exitosamente', 'success');
                    closeModal();
                } else {
                    showMessage(result.mensaje || 'Error al registrar usuario', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('No se pudo conectar al servidor', 'error');
            }
        });
    }

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;

            const data = { correo: email, contrasena: password };

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage('Inicio de sesión exitoso', 'success');
                    closeModal();
                    // Guardar el rol en localStorage para usarlo en index_2.html
                    localStorage.setItem('userRole', result.usuario.roles[0]);
                    window.location.href = 'index_2.html';
                } else {
                    showMessage(result.mensaje || 'Credenciales incorrectas', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('No se pudo conectar al servidor', 'error');
            }
        });
    }

    // Función para mostrar mensajes en el modal
    function showMessage(message, type) {
        const modalBody = document.querySelector('#loginModal .modal-body');
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
        messageDiv.textContent = message;

        // Eliminar mensajes previos
        const existingMessage = modalBody.querySelector('.alert');
        if (existingMessage) {
            modalBody.removeChild(existingMessage);
        }

        // Agregar nuevo mensaje
        modalBody.prepend(messageDiv);

        // Remover el mensaje después de 3 segundos
        setTimeout(() => {
            if (modalBody.contains(messageDiv)) {
                modalBody.removeChild(messageDiv);
            }
        }, 3000);
    }

    // Función para cerrar el modal
    function closeModal() {
        const loginModal = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(loginModal);
        if (modal) {
            modal.hide();
        }
    }

    // Función para mostrar botones según el rol en index_2.html
    function updateUIBasedOnRole() {
        const userRole = localStorage.getItem('userRole');
        const adminButtons = document.getElementById('adminButtons');
        const loginRegisterIcon = document.querySelector('.login-btn');

        if (userRole) {
            // Cambiar ícono de login/register
            if (loginRegisterIcon) {
                loginRegisterIcon.innerHTML = `<i class="fas fa-user"></i> ${userRole === 'admin' ? 'Admin' : 'Usuario'}`;
            }

            // Mostrar botones de admin si el rol es admin
            if (userRole === 'admin' && adminButtons) {
                adminButtons.style.display = 'block';
            } else if (adminButtons) {
                adminButtons.style.display = 'none';
            }
        }
    }

    // Actualizar la interfaz según el rol
    if (window.location.pathname.includes('index_2.html')) {
        updateUIBasedOnRole();
    }

    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('userRole'); // Eliminar el rol del usuario
        window.location.href = 'index.html'; // Redirigir a la página de inicio
    }

    // Agregar un evento al botón de cierre de sesión (asegúrate de que exista un botón de logout en la interfaz)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

});
