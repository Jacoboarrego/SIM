// Página principal del dashboard que muestra inventario, carrito, pagos y análisis.
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  simulatePayment,
  updateProduct,
  saveDeveloperInfo,
} from '../services/productService';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import CartDrawer from '../components/CartDrawer';
import PqrForm from '../components/PqrForm';
import SocialLinks from '../components/SocialLinks';
import GoogleMap from '../components/GoogleMap';
import AiAssistant from '../components/AiAssistant';

function InventoryDashboard() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Carga los productos desde el backend usando el token de autenticación.
  const loadProducts = async () => {
    try {
      const result = await fetchProducts(token);
      setProducts(result);
    } catch (error) {
      console.error(error);
      setStatusMessage('No se pudo cargar el inventario.');
    }
  };

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  // Maneja la creación de un nuevo producto y actualiza la lista local.
  const handleCreate = async (values) => {
    try {
      const product = await createProduct(token, values);
      setProducts((prev) => [product, ...prev]);
      setStatusMessage('Producto agregado con éxito.');
    } catch (error) {
      setStatusMessage('Error al agregar producto.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updated = await updateProduct(token, selectedProduct._id, values);
      setProducts((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setSelectedProduct(null);
      setStatusMessage('Producto actualizado.');
    } catch (error) {
      setStatusMessage('Error al actualizar producto.');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(token, productId);
      setProducts((prev) => prev.filter((item) => item._id !== productId));
      setStatusMessage('Producto eliminado.');
    } catch (error) {
      setStatusMessage('Error al eliminar producto.');
    }
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // Calcula el total del carrito cada vez que cambian los items.
  const totalCart = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setStatusMessage('Agrega productos al carrito para pagar.');
      return;
    }

    try {
      const receipt = await simulatePayment(token, {
        items: cartItems,
        total: totalCart,
        paymentMethod: 'Tarjeta de crédito simulada',
      });
      setStatusMessage(receipt.message);
      setCartItems([]);
    } catch (error) {
      setStatusMessage('Error al procesar el pago.');
    }
  };

  const submitDeveloperInfo = async (developer) => {
    try {
      await saveDeveloperInfo(developer);
      setStatusMessage('Información de desarrollador guardada.');
    } catch (error) {
      setStatusMessage('No se pudo guardar la información de desarrollador.');
    }
  };

  // Calcula métricas de inventario como valor total y productos en bajo stock.
  const analytics = useMemo(() => {
    const totalValue = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lowStock = products.filter((item) => item.quantity <= 5);
    return { totalProducts: products.length, totalValue, lowStock };
  }, [products]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-top">
        <div>
          <h1>Panel de Inventario</h1>
          <p>Administración de productos, carrito, pagos y análisis inteligente.</p>
        </div>
        <div className="status-badge">Usuario: {user.email}</div>
      </section>

      <section className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <article className="card accent-card">
            <h3>Resumen de inventario</h3>
            <ul>
              <li>Productos: {analytics.totalProducts}</li>
              <li>Valor total aproximado: ${analytics.totalValue.toFixed(2)}</li>
              <li>Productos con bajo stock: {analytics.lowStock.length}</li>
            </ul>
          </article>

          <AiAssistant products={products} />

          <article className="card">
            <h3>Formulario PQR</h3>
            <PqrForm />
          </article>

          <article className="card">
            <h3>Equipo de desarrollo</h3>
            <p>Guarda la información del desarrollador que trabaja en el proyecto.</p>
            <button className="btn small" onClick={() => submitDeveloperInfo({ name: 'Equipo SIM', role: 'Desarrollador', email: 'equipo@sim.com', message: 'Proyecto académico de inventario con IA' })}>
              Guardar desarrollador demo
            </button>
          </article>
        </aside>

        <section className="dashboard-main">
          <ProductForm
            product={selectedProduct}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onClear={() => setSelectedProduct(null)}
          />

          <ProductTable
            products={products}
            onEdit={(product) => setSelectedProduct(product)}
            onDelete={handleDelete}
            onAddToCart={handleAddToCart}
          />

          <CartDrawer
            items={cartItems}
            total={totalCart}
            onRemove={handleRemoveCart}
            onCheckout={handlePayment}
          />

          <section className="card map-card">
            <h3>Ubicación de la empresa</h3>
            <GoogleMap />
          </section>

          <section className="card social-card">
            <h3>Redes sociales</h3>
            <SocialLinks />
          </section>
        </section>
      </section>

      {statusMessage && <div className="toast-message">{statusMessage}</div>}
    </main>
  );
}

export default InventoryDashboard;
