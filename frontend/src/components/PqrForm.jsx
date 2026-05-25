import { useState } from 'react';
import { sendPqr } from '../services/pqrService';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PqrForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
    setStatus('');
  };

  const validatePqr = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Por favor completa todos los campos.');
      return false;
    }
    if (!emailPattern.test(form.email)) {
      setError('Ingresa un correo válido.');
      return false;
    }
    if (form.message.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePqr()) {
      return;
    }

    try {
      const response = await sendPqr(form);
      setStatus(response.message || 'PQR enviada correctamente.');
      setError('');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al enviar la PQR.');
      setStatus('');
    }
  };

  return (
    <div className="pqr-card">
      <form className="pqr-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Correo
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Mensaje
          <textarea name="message" rows="4" value={form.message} onChange={handleChange} required />
        </label>
        <button type="submit" className="btn primary full-width">
          Enviar PQR
        </button>
      </form>
      {error && <p className="form-status form-status--error">{error}</p>}
      {status && <p className="form-status form-status--success">{status}</p>}
    </div>
  );
}

export default PqrForm;
