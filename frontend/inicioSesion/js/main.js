// document.addEventListener('DOMContentLoaded', () => {
//     const userRole = localStorage.getItem('userRole');
//     const userName = localStorage.getItem('userName');
//     const adminButtons = document.getElementById('adminButtons');
//     const welcomeMessage = document.getElementById('welcomeMessage');
//     const profileMenu = document.getElementById('profileMenu');

//     if (userRole) {
//         // Actualizar mensaje de bienvenida
//         welcomeMessage.textContent = `Bienvenido, ${userName}`;

//         // Actualizar el perfil
//         profileMenu.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
//         profileMenu.addEventListener('click', () => {
//             // Abrir menú de perfil (puedes reemplazar esto con un modal si es necesario)
//             alert('Abrir menú de perfil, configuraciones, y cerrar sesión.');
//         });

//         // Mostrar botones de admin si el rol es admin
//         if (userRole === 'admin') {
//             adminButtons.style.display = 'block';
//         } else {
//             adminButtons.style.display = 'none';
//         }
//     } else {
//         welcomeMessage.textContent = 'Por favor, inicia sesión.';
//     }
// });
