const socket = io();
const productsContainer = document.getElementById('products');


productsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.getAttribute('data-id');
        if (confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${productId}?`)) {
            socket.emit('eliminar-producto', productId);
        }
    }
});


socket.on('arrayProductos', (productos) => {
    let productosHTML = '<h2>Productos en Tiempo Real:</h2><ul style="list-style: none; padding: 0;">';
    
    productos.forEach(producto => {
        productosHTML += `
            <li style="border: 1px solid #eee; margin-bottom: 10px; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; background-color: #fcfcfc;">
                <div>
                    <strong>${producto.title}</strong> (${producto.category}) <br>
                    Precio: $${producto.price} | Stock: ${producto.stock}
                </div>
                <button class="delete-btn" data-id="${producto.id}" 
                        style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                    Eliminar
                </button>
            </li>
        `;
    });
    
    productosHTML += '</ul>';
    productsContainer.innerHTML = productosHTML;
});
