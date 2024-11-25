// Función para cargar productos destacados y elegir uno aleatorio para el contador
const fetchFeaturedProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/productos');
        const allProducts = await response.json();

        // Seleccionar los primeros tres productos
        const featuredProducts = allProducts.slice(0, 3);

        // Renderizar productos destacados
        const featuredContainer = document.getElementById('featured-products');
        featuredContainer.innerHTML = ''; // Asegúrate de limpiar el contenedor

        featuredProducts.forEach(product => {
            const productHTML = `
                <div class="col-lg-4 col-md-6 text-center">
                    <div class="single-product-item">
                        <div class="product-image">
                            <a href="single-product.html?id=${product._id}">
                                <img src="${product.imagenes || 'https://via.placeholder.com/150'}" alt="${product.nombre}">
                            </a>
                        </div>
                        <h3>${product.nombre}</h3>
                        <p class="product-price"><span>Precio:</span> $${product.precio}</p>
                        <a href="#" class="add-to-cart cart-btn" data-id="${product._id}">
                            <i class="fas fa-shopping-cart"></i> Agregar al carrito
                        </a>
                    </div>
                </div>
            `;
            featuredContainer.innerHTML += productHTML;
        });

        // Seleccionar un producto aleatorio para el contador
        const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];

        // Renderizar el producto aleatorio en el contador
        if (randomProduct) {
            const cartBannerImage = document.querySelector('.cart-banner .image img');
            const cartBannerTitle = document.querySelector('.cart-banner h4');
            const cartBannerText = document.querySelector('.cart-banner .text');

            // Actualizar la imagen, el título y la descripción
            cartBannerImage.src = randomProduct.imagenes || 'https://via.placeholder.com/150';
            cartBannerTitle.textContent = randomProduct.nombre;
            cartBannerText.textContent = `¡Aprovecha esta oferta única para el producto ${randomProduct.nombre}! Por tiempo limitado.`;
        }

        // Agregar eventos a los botones "Agregar al carrito"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.closest('.add-to-cart').dataset.id;

                const selectedProduct = allProducts.find(p => p._id === productId);

                if (selectedProduct) {
                    addToCart(selectedProduct); // Llama a la función para agregar al carrito
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar productos destacados:', error);
    }
};

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchFeaturedProducts();
});
