// Drawer/Panel que muestra los items agregados al carrito.
// Props:
// - items: array de productos con la propiedad `quantity` local.
// - total: número con el total calculado del carrito.
// - onRemove(productId): callback para quitar un item del carrito.
// - onCheckout(): callback para iniciar la simulación de pago.
function CartDrawer({ items, total, onRemove, onCheckout }) {
  return (
    <article className="card cart-card">
      <h2>Carrito de compras</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-item" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.quantity} unidad(es)</p>
              </div>
              <div className="cart-item-actions">
                {/* Precio total por línea */}
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                {/* Elimina el item del carrito */}
                <button className="btn danger tiny" onClick={() => onRemove(item._id)}>
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="checkout-panel">
        <span>Total: ${total.toFixed(2)}</span>
        {/* Botón de pago simulado; deshabilitado si no hay items */}
        <button className="btn primary full-width" onClick={onCheckout} disabled={items.length === 0}>
          Pagar (simulado)
        </button>
      </div>
    </article>
  );
}

export default CartDrawer;
