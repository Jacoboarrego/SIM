// Componente de tabla que muestra el inventario de productos.
// Props:
// - products: array de objetos producto recibidos desde el servidor.
// - onEdit(product): callback para iniciar edición de un producto.
// - onDelete(productId): callback para eliminar un producto por id.
// - onAddToCart(product): callback para añadir un producto al carrito.
function ProductTable({ products, onEdit, onDelete, onAddToCart }) {
  return (
    <article className="card table-card">
      <h2>Inventario de productos</h2>
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5">No hay productos registrados.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className="table-actions">
                    {/* Añade el producto al carrito (cantidad por defecto +1) */}
                    <button className="btn small" onClick={() => onAddToCart(product)}>
                      Carrito
                    </button>
                    {/* Llama al callback para editar en el formulario superior */}
                    <button className="btn secondary small" onClick={() => onEdit(product)}>
                      Editar
                    </button>
                    {/* Elimina el producto mediante su id */}
                    <button className="btn danger small" onClick={() => onDelete(product._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default ProductTable;
