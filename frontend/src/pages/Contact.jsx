import React, { useState } from 'react';

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
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row gap-16">
        {/* Form Section */}
        <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
          <p className="mb-6 text-gray-600">
            If you have questions or feedback, please send us a message and we’ll get back to you.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={status.sending}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status.sending ? 'Sending…' : 'Send Message'}
            </button>

            {status.message && (
              <p className={`mt-2 text-center font-medium ${status.success ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Other ways to reach us</h2>
            <ul className="text-gray-700 space-y-2">
              <li>Email: <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a></li>
              <li>Phone: <a href="tel:+10000000000" className="text-blue-600 hover:underline">+1 (000) 000-0000</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Office</h2>
            <p>123 Learning Street</p>
            <p>Knowledge City, Edu 56789</p>
          </div>
        </div>
      </div>
    </main>
  );
}
