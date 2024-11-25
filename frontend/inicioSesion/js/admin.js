document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin panel loaded");

    // Formulario para agregar producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;
            const productCategory = document.getElementById('productCategory').value;
            const productImage = document.getElementById('productImage').value;

            const data = {
                nombre: productName,
                precio: parseFloat(productPrice),
                categoriasProducto: [productCategory], // Ajusta si es necesario para tu backend
                imagenes: productImage
            };

            try {
                const response = await fetch('http://localhost:3000/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Producto agregado exitosamente');
                    addProductForm.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                    modal.hide();

                    // Si tienes una función para actualizar productos en la página de productos, llámala aquí
                    if (typeof fetchProductos === 'function') {
                        fetchProductos(); // Asegúrate de que esta función esté disponible
                    }
                } else {
                    alert(`Error al agregar producto: ${result.mensaje}`);
                }
            } catch (error) {
                console.error("Error al agregar producto:", error);
                alert('Error al conectar con el servidor');
            }
        });
    }

    // Formulario para agregar categoría
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const categoryName = document.getElementById('categoryName').value;
            const categoryDescription = document.getElementById('categoryDescription').value;

            const data = {
                nombre: categoryName,
                descripcion: categoryDescription
            };

            try {
                const response = await fetch('http://localhost:3000/categorias', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Categoría agregada exitosamente');
                    addCategoryForm.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                    modal.hide();

                    // Actualizar categorías en la página de productos
                    if (typeof fetchCategorias === 'function') {
                        fetchCategorias(); // Asegúrate de que esta función esté disponible
                    }
                } else {
                    alert(`Error al agregar categoría: ${result.mensaje}`);
                }
            } catch (error) {
                console.error("Error al agregar categoría:", error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});
