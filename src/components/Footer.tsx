import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription here
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Navigation */}
          <div>
            <h3 className="text-black uppercase text-sm font-semibold mb-4 tracking-wide">
              Navigatie
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/over-ons"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Over Ons
                </Link>
              </li>
              <li>
                <Link
                  to="/leden"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Leden
                </Link>
              </li>
              <li>
                <Link
                  to="/board-contact"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Board & Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/agenda"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Agenda
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-black uppercase text-sm font-semibold mb-4 tracking-wide">
              Juridisch
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link
                  to="/algemene-voorwaarden"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Algemene Voorwaarden
                </Link>
              </li>
              <li>
                <Link
                  to="/cookiebeleid"
                  className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Cookiebeleid
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-black uppercase text-sm font-semibold mb-3 sm:mb-4 tracking-wide">
              Nieuwsbrief
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
              Blijf op de hoogte van exclusieve evenementen en updates
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Uw e-mailadres"
                required
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-full uppercase text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                {submitted ? 'Ingeschreven!' : 'Inschrijven'}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              <motion.a
                href="#facebook"
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={14} />
              </motion.a>
              <motion.a
                href="#instagram"
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </motion.a>
              <motion.a
                href="#linkedin"
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={14} />
              </motion.a>
            </div>

            {/* Copyright */}
            <p className="text-gray-600 text-xs sm:text-sm text-center">
              © SISERA Business Club Alle rechten voorbehouden. Site mogelijk gemaakt door © Art - O - Graph
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

