import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ sending: false, success: null, message: '' });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'A valid email is required.';
    if (!form.message.trim()) return 'Message cannot be empty.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ sending: false, success: false, message: error });
      return;
    }

    setStatus({ sending: true, success: null, message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      setStatus({
        sending: false,
        success: true,
        message: data.message || 'Message sent successfully.',
      });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus({
        sending: false,
        success: false,
        message: 'Failed to send message. Please try again later.',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-20">

        {/* HERO */}
        <section className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Get in <span className="text-indigo-600">Touch</span>
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions, suggestions, or feedback? Send us a message and we’ll respond promptly.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* FORM */}
          <div className="lg:w-2/3 bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Send a Message</h2>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                placeholder="Your Message..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={status.sending}
                className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {status.sending ? 'Sending…' : 'Send Message'}
              </button>

              {status.message && (
                <p
                  className={`mt-4 text-center font-medium ${
                    status.success ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="lg:w-1/3 flex flex-col gap-6">

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Info</h3>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-indigo-600" />
                  <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">
                    support@example.com
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <PhoneIcon className="w-6 h-6 text-indigo-600" />
                  <a href="tel:+10000000000" className="text-indigo-600 hover:underline">
                    +1 (000) 000-0000
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <MapPinIcon className="w-6 h-6 text-indigo-600" />
                  <span>123 Learning Street, Knowledge City</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
