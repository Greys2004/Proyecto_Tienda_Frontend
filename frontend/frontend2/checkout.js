// Renderizar los detalles del pedido en checkout.html
const renderOrderDetails = (cartItems, productos) => {
    const orderDetailsBody = document.getElementById('order-details-body');
    orderDetailsBody.innerHTML = ''; // Limpiar contenido previo

    let subtotal = 0;

    // Iterar sobre los productos en el carrito
    cartItems.forEach(cartItem => {
        const producto = productos.find(p => p._id === cartItem.id);
        if (producto) {
            const totalProducto = producto.precio * cartItem.cantidad;
            subtotal += totalProducto;

            const productRow = `
                <tr>
                    <td>${producto.nombre} x${cartItem.cantidad}</td>
                    <td>$${totalProducto.toFixed(2)}</td>
                </tr>
            `;
            orderDetailsBody.innerHTML += productRow;
        }
    });

    // Agregar los totales (en este caso, un envío fijo de 10)
    const shipping = 10; // Ejemplo de costo de envío
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${(subtotal + shipping).toFixed(2)}`;
};


document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    if (!productos.length) {
        alert('No se pudieron cargar los productos. Verifica la conexión.');
        return;
    }

    renderOrderDetails(cartItems, productos);
});
