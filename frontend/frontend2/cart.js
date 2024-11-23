// Obtener productos del carrito y renderizarlos
const fetchCartProducts = async () => {
    try {
        // Obtener los productos almacenados en el carrito desde localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Si no hay productos en el carrito, mostrar mensaje vacío
        if (cartItems.length === 0) {
            document.querySelector('.cart-table tbody').innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">Your cart is empty.</td>
                </tr>
            `;
            updateCartTotals(0, 0);
            return;
        }

        // Llamar al backend para obtener información actualizada de los productos
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();

        renderCartProducts(cartItems, productos);
    } catch (error) {
        console.error('Error al cargar productos del carrito:', error);
        alert('No se pudieron cargar los productos. Verifica la conexión con el servidor.');
    }
};

// Renderizar los productos del carrito en la tabla
const renderCartProducts = (cartItems, productos) => {
    const cartTableBody = document.querySelector('.cart-table tbody');
    cartTableBody.innerHTML = ''; // Limpiar tabla

    let subtotal = 0;

    cartItems.forEach(cartItem => {
        const producto = productos.find(p => p._id === cartItem.id);
        if (producto) {
            const totalProducto = producto.precio * cartItem.cantidad;
            subtotal += totalProducto;

            const productRow = `
                <tr class="table-body-row" data-id="${producto._id}">
                    <td class="product-remove">
                        <a href="#" class="remove-product"><i class="far fa-window-close"></i></a>
                    </td>
                    <td class="product-image">
                        <img src="${producto.imagenes}" alt="${producto.nombre}">
                    </td>
                    <td class="product-name">${producto.nombre}</td>
                    <td class="product-price">$${producto.precio.toFixed(2)}</td>
                    <td class="product-quantity">
                        <input type="number" value="${cartItem.cantidad}" class="quantity-input" min="1">
                    </td>
                    <td class="product-total">$${totalProducto.toFixed(2)}</td>
                </tr>
            `;
            cartTableBody.innerHTML += productRow;
        }
    });

    // Actualizar los totales
    updateCartTotals(subtotal, 10); // Ejemplo: Envío fijo de $10
};

// Actualizar los totales del carrito (subtotal, envío, total)
const updateCartTotals = (subtotal, shipping) => {
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${(subtotal + shipping).toFixed(2)}`;
};

// Eliminar producto del carrito
const removeProductFromCart = (productId) => {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    fetchCartProducts(); // Recargar productos
};

// Actualizar cantidad de un producto
const updateProductQuantity = (productId, newQuantity) => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cartItems.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cartItems[productIndex].cantidad = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cartItems)); // Guardar en localStorage
        fetchCartProducts(); // Recargar productos
    }
};

// Manejo de eventos
document.addEventListener('DOMContentLoaded', () => {
    fetchCartProducts(); // Cargar productos al inicio

    const cartTable = document.querySelector('.cart-table');

    // Evento para eliminar productos
    cartTable.addEventListener('click', (e) => {
        if (e.target.closest('.remove-product')) {
            e.preventDefault();
            const productId = e.target.closest('tr').dataset.id;
            removeProductFromCart(productId);
        }
    });

    // Evento para actualizar cantidades
    cartTable.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.closest('tr').dataset.id;
            const newQuantity = parseInt(e.target.value, 10);
            if (newQuantity > 0) {
                updateProductQuantity(productId, newQuantity);
            } else {
                alert('La cantidad debe ser al menos 1');
                e.target.value = 1; // Restablecer a 1 si la cantidad es menor
            }
        }
    });

    // Vaciar el carrito
    document.getElementById('empty-cart').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('cart'); // Vacía el carrito
        fetchCartProducts(); // Recargar productos
    });
});
