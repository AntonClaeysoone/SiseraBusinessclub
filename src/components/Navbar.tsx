import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 md:py-6">
        <div className="relative flex items-center justify-between lg:justify-start">
          {/* Left Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8 flex-1">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/over-ons"
                className="text-black uppercase text-sm font-medium tracking-wide hover:text-gray-700 transition-colors"
              >
                OVER ONS
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/leden"
                className="text-black uppercase text-sm font-medium tracking-wide hover:text-gray-700 transition-colors"
              >
                LEDEN
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/board-contact"
                className="text-black uppercase text-sm font-medium tracking-wide hover:text-gray-700 transition-colors"
              >
                BOARD & CONTACT
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button - Left side */}
          <div className="lg:hidden flex-shrink-0">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="text-black p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </motion.button>
          </div>

          {/* Center Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${mobileMenuOpen ? 'hidden lg:block' : ''} absolute left-1/2 transform -translate-x-1/2 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2`}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center justify-center cursor-pointer py-2 sm:py-3"
              >
                <img 
                  src="/SB_LOGO_ZWART.png" 
                  alt="SISERA Business Club Logo" 
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain"
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right Side: Agenda, Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-end">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/agenda"
                className="text-black uppercase text-sm font-medium tracking-wide hover:text-gray-700 transition-colors"
              >
                AGENDA
              </Link>
            </motion.div>
            
            {!loading && !user && (
              <Link to="/word-lid">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-full uppercase text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
                >
                  WORD LID
                </motion.button>
              </Link>
            )}
            
            {!loading && (
              <>
                {user ? (
                  <Link to="/profile">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <FaUserCircle className="text-2xl text-black hover:text-gray-700 transition-colors" />
                    </motion.div>
                  </Link>
                ) : (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-300 rounded-full uppercase text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
                    >
                      LOGIN
                    </motion.button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile: Right side with Profile Icon - MUST be last in DOM order */}
          <div className="lg:hidden flex-shrink-0 ml-auto">
            {!loading && user && (
              <Link to="/profile" className="text-black">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <FaUserCircle className="text-2xl" />
                </motion.div>
              </Link>
            )}
            {!loading && !user && (
              <Link to="/login" className="text-black">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 border border-gray-300 rounded-full uppercase text-xs font-medium text-black bg-white hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  LOGIN
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/over-ons"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
              >
                OVER ONS
              </Link>
              <Link
                to="/leden"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
              >
                LEDEN
              </Link>
              <Link
                to="/board-contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
              >
                BOARD & CONTACT
              </Link>
              <Link
                to="/agenda"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
              >
                AGENDA
              </Link>
              {!loading && !user && (
                <Link
                  to="/word-lid"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
                >
                  WORD LID
                </Link>
              )}
              {!loading && !user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-black uppercase text-sm font-medium tracking-wide py-3 min-h-[44px] flex items-center hover:text-gray-700 transition-colors"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

