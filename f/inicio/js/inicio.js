let listaProductos = document.querySelector('#listaProductos');
let categorieList = document.querySelector('#categorieList');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let btnComprar = document.getElementById('btnComprar');
let productosCarrito = document.getElementById('productosCarrito');
let subtotal = document.getElementById('subtotal');
const URL = "http://localhost:3000/productos";
const URL2 = "http://localhost:3000/categorias";

document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const modalElement = document.getElementById('verCarrito');
    let allProducts = []; // Variable para almacenar todos los productos
    const searchInput = document.getElementById('searchInput');

    // Función para manejar el modo oscuro
    function setDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            modalElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            modalElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Verificar si el modo oscuro está habilitado al cargar la página
    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
        darkModeToggle.checked = true;
    }

    // Cambiar modo oscuro cuando se hace click en el toggle
    darkModeToggle.addEventListener('click', () => {
        setDarkMode(darkModeToggle.checked);
    });

    // Cargar los productos al mostrar el modal
    document.getElementById('verCarrito').addEventListener('shown.bs.modal', mostrarProductos);

    // Evento para el botón de comprar
    btnComprar.addEventListener('click', () => {
        if(carrito.length === 0){
            alert('Para comprar tu carrito no puede estar vacío');
        } else {
            cerrarModal();
            carrito = [];
            localStorage.removeItem('carrito');
            alert('Gracias por su compra!');
            mostrarProductos();
        }
    });

    // Obtener productos desde la API
    fetch(URL)
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener productos: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        allProducts = data; // Asigna los productos a allProducts
        mostrarProductosFiltrados(allProducts); // Muestra todos los productos inicialmente
    })
    .catch(error => console.error('Error en fetch:', error));

    // Obtener categorías desde la API
    fetch(URL2)
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Imprime las categorías en la consola

        // Verifica que los datos sean un array de categorías
        if (Array.isArray(data)) {
            categorieList.innerHTML = `<li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">HOME</a>
            </li>`;

            // Iterar sobre las categorías y agregar a la lista
            data.forEach((categoria) => {
                categorieList.innerHTML += `
                    <li class="nav-item">
                        <a class="nav-link" onclick="muestraProductos('${categoria.nombre}')" class="categoria-link">${categoria.nombre.toUpperCase()}</a>
                    </li>
                `;
            });
        } else {
            console.error("La respuesta no es un array:", data);
        }
    })
    .catch(error => console.error('Error al obtener las categorías:', error));



    // Filtrar productos al escribir en el campo de búsqueda
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = allProducts.filter(producto => 
            producto.title.toLowerCase().includes(searchTerm) ||
            producto.description.toLowerCase().includes(searchTerm)
        );
        mostrarProductosFiltrados(filteredProducts); // Muestra los productos filtrados
    });

    // Función para mostrar productos filtrados
    function mostrarProductosFiltrados(productos) {
        listaProductos.innerHTML = "";
        productos.forEach((producto) => {
            listaProductos.innerHTML += `
                <div class="col-12 col-md-3 py-5">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre.slice(0,30)}</h5>
                            <p class="card-text text-danger">$ ${producto.precio}</p>
                            <a href="#" class="btn btn-outline-primary w-100" data-id="${producto.id}">Agregar al carrito</a>
                        </div>
                    </div>  
                </div>
            `;
        });

        // Agregar el evento de clic a los botones de "Agregar al carrito"
        document.querySelectorAll('.btn-outline-primary').forEach(button => {
            button.addEventListener('click', agregarAlCarrito);
        });
    }

    // Función para agregar un producto al carrito
    function agregarAlCarrito(event) {
        event.preventDefault();
        const id = event.target.dataset.id;
        fetch(`${URL}/${id}`)
            .then(response => response.json())
            .then(producto => {
                carrito.push(producto);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                alert("Producto añadido al carrito.");
            });
    }

    // Función para mostrar los productos del carrito
    function mostrarProductos() {
        productosCarrito.innerHTML = "";
        carrito.forEach((producto) => {
            productosCarrito.innerHTML += `
                <div class="col-6 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Calcular el subtotal
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        subtotal.innerHTML = `Subtotal: $${total}`;
    }

    // Función para cerrar el modal
    function cerrarModal() {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    }

    // Función para filtrar productos por categoría
    function muestraProductos(categoria) {
        const productosFiltrados = allProducts.filter(producto => producto.categoria.toLowerCase() === categoria.toLowerCase());
        mostrarProductosFiltrados(productosFiltrados);
    }
});
