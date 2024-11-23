let currentPage = 1;
const limit = 12;
let allProductos = [];
let productosFiltrados = []; // Productos filtrados globalmente

// Función para obtener productos desde el backend
const fetchProductos = async () => {
    try {
        const response = await fetch('http://localhost:3000/productos');
        allProductos = await response.json();
        productosFiltrados = allProductos; // Inicialmente todos los productos están filtrados
        renderProductos(currentPage, productosFiltrados);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
};

// Función para renderizar productos
const renderProductos = (page, productos = productosFiltrados) => {
    const productosContainer = document.querySelector('.product-lists');
    productosContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar

    // Calcula el rango de productos para la página actual
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const productosPagina = productos.slice(startIndex, endIndex);

    // Genera y agrega el HTML de cada producto
    productosPagina.forEach(producto => {
        const categoriasClases = producto.categoriasProducto
            ? producto.categoriasProducto.map(cat => cat.nombre.toLowerCase().replace(/\s+/g, '-')).join(' ')
            : '';

        const productoHTML = `
            <div class="col-lg-4 col-md-6 text-center product-item ${categoriasClases}">
                <div class="single-product-item">
                    <div class="product-image">
                        <a href="single-product.html?id=${producto._id}">
                            <img src="${producto.imagenes || 'https://via.placeholder.com/150'}" alt="${producto.nombre}">
                        </a>
                    </div>
                    <h3>${producto.nombre}</h3>
                    <p class="product-price"><span>Precio:</span> $${producto.precio}</p>
                    <a href="#" class="add-to-cart cart-btn" data-id="${producto._id}"><i class="fas fa-shopping-cart"></i> Agregar al carrito</a>
                </div>
            </div>
        `;

        productosContainer.innerHTML += productoHTML;
    });

    // Agregar eventos a los botones después de renderizar
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.target.closest('.add-to-cart').dataset.id;

            // Buscar el producto en la lista de productos
            const producto = allProductos.find(p => p._id === productId);

            if (producto) {
                addToCart(producto); // Llama a la función para agregar el producto al carrito
            }
        });
    });

    adjustPaginationPosition();
    renderPagination(productos); // Renderizar la paginación basada en los productos actuales
};

// Función para renderizar la paginación
const renderPagination = (productos = productosFiltrados) => {
    const paginationWrap = document.querySelector('.pagination-wrap');
    let paginationContainer = paginationWrap.querySelector('ul');

    if (!paginationContainer) {
        paginationContainer = document.createElement('ul');
        paginationWrap.appendChild(paginationContainer);
    }

    paginationContainer.innerHTML = ''; // Limpia el contenido de la paginación

    const totalPages = Math.ceil(productos.length / limit);

    if (currentPage > 1) {
        paginationContainer.innerHTML += `
            <li><a href="#" data-page="${currentPage - 1}">Prev</a></li>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
            <li><a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a></li>
        `;
    }

    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `
            <li><a href="#" data-page="${currentPage + 1}">Next</a></li>
        `;
    }

    paginationContainer.querySelectorAll('a').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = parseInt(e.target.dataset.page);
            renderProductos(currentPage, productos); // Renderizar productos filtrados
        });
    });
};

// Función para filtrar productos según la categoría
const filterProductos = (filterValue) => {
    if (filterValue === '*') {
        productosFiltrados = allProductos; // Mostrar todos los productos
    } else {
        productosFiltrados = allProductos.filter(producto => {
            const categoriasClases = producto.categoriasProducto
                ? producto.categoriasProducto.map(cat => cat.nombre.toLowerCase().replace(/\s+/g, '-'))
                : [];
            return categoriasClases.includes(filterValue.substring(1)); // Compara las clases de categorías
        });
    }

    // Renderizar productos filtrados desde la primera página
    currentPage = 1;
    renderProductos(currentPage, productosFiltrados);
};

// Función para obtener categorías desde el backend
const fetchCategorias = async () => {
    try {
        const response = await fetch('http://localhost:3000/categorias');
        const categorias = await response.json();
        renderCategorias(categorias);
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
};

// Función para renderizar categorías en los filtros
const renderCategorias = (categorias) => {
    const categoryTrack = document.querySelector('#category-filters');
    categoryTrack.innerHTML = ''; // Limpia las categorías

    // Generar dinámicamente las categorías
    categorias.forEach(categoria => {
        const categoryItem = `
            <li data-filter=".${categoria.nombre.toLowerCase().replace(/\s+/g, '-')}">
                ${categoria.nombre}
            </li>
        `;
        categoryTrack.innerHTML += categoryItem;
    });

    // Agregar eventos de filtro
    categoryTrack.querySelectorAll('li').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = button.getAttribute('data-filter');

            // Resaltar la categoría activa
            categoryTrack.querySelectorAll('li').forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            // Filtrar productos
            filterProductos(filterValue);
        });
    });

    // Configurar el slider
    setupSlider();
};

const setupSlider = () => {
    const track = document.querySelector('.slider-track');
    const leftNav = document.querySelector('.slider-nav.left');
    const rightNav = document.querySelector('.slider-nav.right');
    const categoryItems = document.querySelectorAll('.slider-track li');
    const categoryWidth = categoryItems[0].offsetWidth + 15; // Ancho de una categoría más margen
    const categoriesPerView = 6; // Categorías visibles
    let currentPosition = 0;

    // Botón izquierdo
    leftNav.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition -= categoriesPerView;
            track.style.transform = `translateX(-${currentPosition * categoryWidth}px)`;
        }
    });

    // Botón derecho
    rightNav.addEventListener('click', () => {
        if ((currentPosition + categoriesPerView) < categoryItems.length) {
            currentPosition += categoriesPerView;
            track.style.transform = `translateX(-${currentPosition * categoryWidth}px)`;
        }
    });
};


// Renderizar categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderCategorias(categorias);
});

// Ajustar la altura de los contenedores de productos
const adjustPaginationPosition = () => {
    const productosContainer = document.querySelector('.product-lists');
    const paginationWrap = document.querySelector('.pagination-wrap');
    const productos = productosContainer.querySelectorAll('.product-item');
    const productosPorFila = 3; // Número de productos por fila

    if (productosContainer && productos.length > 0) {
        // Calcular la altura más alta de una tarjeta
        let maxHeight = 0;
        productos.forEach(producto => {
            producto.style.height = 'auto'; // Reiniciar la altura
            const height = producto.offsetHeight;
            if (height > maxHeight) maxHeight = height;
        });

        // Aplicar la misma altura a todas las tarjetas
        productos.forEach(producto => {
            producto.style.height = `${maxHeight}px`;
        });

        // Calcular el número total de filas requeridas
        const totalFilas = Math.ceil(productos.length / productosPorFila);

        // Calcular la altura total del contenedor
        const alturaContenedor = totalFilas * maxHeight;

        // Ajustar el margen superior del botón de paginación
        paginationWrap.style.marginTop = `${alturaContenedor + 20}px`;
    } else {
        // Si no hay productos, restablecer el margen
        paginationWrap.style.marginTop = '20px';
    }
};


// Función para agregar productos al carrito en localStorage
const addToCart = (producto) => {
    // Obtener el carrito actual desde localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificar si el producto ya está en el carrito
    const existingProduct = cartItems.find(item => item.id === producto._id);

    if (existingProduct) {
        // Si existe, aumentar la cantidad
        existingProduct.cantidad += 1;
    } else {
        // Si no existe, agregarlo al carrito con cantidad inicial
        cartItems.push({
            id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes,
            cantidad: 1
        });
    }

    // Guardar los cambios en localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Mostrar un mensaje de confirmación
    alert(`¡${producto.nombre} se ha agregado al carrito!`);
};


// Inicia la carga de productos
document.addEventListener('DOMContentLoaded', () => {
    fetchProductos(); // Cargar productos
    fetchCategorias(); // Cargar categorías
});
