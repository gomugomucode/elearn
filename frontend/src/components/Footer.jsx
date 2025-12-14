import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">LearnHub</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners worldwide with high-quality, interactive online courses.
              Build skills, gain confidence, and advance your career — anytime, anywhere.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social Icons - you can update these hrefs later if needed */}
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-2.483 1.195a3.95 3.95 0 00-6.925 3.593A11.206 11.206 0 003.558 3.18a3.953 3.953 0 001.222 5.275c-.814-.025-1.582-.25-2.252-.622v.05c0 1.904 1.354 3.493 3.153 3.854-.332.09-.682.139-1.042.139-.255 0-.503-.025-.745-.073.503 1.57 1.97 2.71 3.707 2.742-1.358 1.064-3.068 1.697-4.925 1.697-.32 0-.635-.019-.945-.056 1.755 1.126 3.846 1.783 6.087 1.783 7.303 0 11.295-6.052 11.295-11.295 0-.172-.004-.344-.011-.514.775-.56 1.447-1.257 1.98-2.05z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05a3.85 3.85 0 00-6.56 3.51A10.91 10.91 0 004.04 4.1a3.85 3.85 0 001.19 5.14c-.64-.02-1.24-.2-1.76-.49v.05c0 1.86 1.32 3.41 3.07 3.76-.32.09-.66.14-1.01.14-.25 0-.49-.02-.73-.07.49 1.53 1.92 2.64 3.61 2.68-1.32 1.04-2.99 1.66-4.8 1.66-.31 0-.62-.02-.92-.07 1.71 1.1 3.74 1.74 5.92 1.74 7.1 0 10.98-5.88 10.98-10.98 0-.17 0-.33-.01-.5.75-.54 1.4-1.22 1.92-1.99z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.86 8.14 6.83 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62 0-.62 0-.62 1 .07 1.53 1.03 1.53 1.03 .89 1.52 2.34 1.08 2.91.83 .09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 012.5-.34c.85.01 1.71.13 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02 .55 1.38.2 2.4.1 2.65 .64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93 .36.31.68 1.07.68 2.16 0 1.56-.01 2.82-.01 3.2 0 .26.18.58.69.48 3.97-1.35 6.83-5.08 6.83-9.49 0-5.5-4.46-9.96-9.96-9.96z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.75 3H4.25C3.01 3 2 4.01 2 5.25v14.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V5.25C22 4.01 20.99 3 19.75 3zm-9 15.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm7.38-11.88c-.84 0-1.52-.68-1.52-1.52s.68-1.52 1.52-1.52 1.52.68 1.52 1.52-.68 1.52-1.52 1.52z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/course" className="hover:text-white transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Support</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-indigo-400">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest course updates and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Link to ="/contact" ><button className="px-6 py-3 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition">
                Subscribe
              </button></Link>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; 2025 LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}