import React, { useState } from 'react';
import '../App.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ sending: false, success: null, message: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email is required.';
    if (!form.message.trim()) return 'Message cannot be empty.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus({ sending: false, success: false, message: validationError });
      return;
    }

    setStatus({ sending: true, success: null, message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setStatus({ sending: false, success: true, message: data.message || 'Message sent successfully.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ sending: false, success: false, message: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <main className="page-container">
      <h1>Contact Us</h1>
      <p>If you have questions or feedback, please send us a message and we’ll get back to you.</p>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} type="text" required />
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </label>

        <label>
          Message
          <textarea name="message" value={form.message} onChange={handleChange} rows="6" required />
        </label>

        <button type="submit" disabled={status.sending}>
          {status.sending ? 'Sending…' : 'Send Message'}
        </button>

        {status.message && (
          <p className={status.success ? 'success' : 'error'}>{status.message}</p>
        )}
      </form>

      <section className="contact-info">
        <h2>Other ways to reach us</h2>
        <ul>
          <li>Email: <a href="mailto:support@example.com">support@example.com</a></li>
          <li>Phone: <a href="tel:+10000000000">+1 (000) 000-0000</a></li>
        </ul>
      </section>
    </main>
  );
}