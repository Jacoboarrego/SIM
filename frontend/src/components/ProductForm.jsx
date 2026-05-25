import { useEffect, useState } from 'react';

// Formulario para crear o editar un producto.
// Props:
// - product: objeto producto cuando se edita, o null para creación.
// - onCreate(values): callback para crear un producto.
// - onUpdate(values): callback para actualizar el producto seleccionado.
// - onClear(): limpia la selección de edición.
function ProductForm({ product, onCreate, onUpdate, onClear }) {
  const [form, setForm] = useState({ name: '', category: '', quantity: '', price: '' });

  // Si `product` cambia, poblamos el formulario para edición.
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
      });
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Normaliza tipos y llama al callback correspondiente.
  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
    };

    if (product) {
      onUpdate(values);
    } else {
      onCreate(values);
    }

    setForm({ name: '', category: '', quantity: '', price: '' });
  };

  return (
    <article className="card form-card">
      <h2>{product ? 'Editar producto' : 'Agregar producto'}</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Categoría
          <input name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Cantidad
          <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
        </label>
        <label>
          Precio
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary full-width">
            {product ? 'Actualizar producto' : 'Agregar producto'}
          </button>
          {product && (
            <button type="button" className="btn secondary full-width" onClick={() => { setForm({ name: '', category: '', quantity: '', price: '' }); onClear(); }}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </article>
  );
}

export default ProductForm;
