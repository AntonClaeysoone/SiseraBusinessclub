import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import ProfileSettings from '../components/ProfileSettings';
import TransactionsList from '../components/TransactionsList';
import InvoicesList from '../components/InvoicesList';
import { formatCurrency } from '../lib/formatCurrency';
import { FaSignOutAlt, FaUser, FaCoins, FaFileInvoice } from 'react-icons/fa';

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'credit' | 'invoices'>('profile');
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadCustomerData();
    }
  }, [user]);

  const loadCustomerData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_club_customers')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading customer:', error);
      }

      if (data) {
        setCustomerId(data.id);
        setCustomerData(data);
      }
    } catch (error) {
      console.error('Error loading customer ID:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tegoeden = customerData ? parseFloat(customerData.tegoeden || 0) : 0;
  const opgebruikt = customerData ? parseFloat(customerData.opgebruikt || 0) : 0;
  const beschikbaar = Math.max(0, tegoeden - opgebruikt);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Mijn Profiel
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="luxury-divider"
              />
            </div>
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaSignOutAlt />
              Uitloggen
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser />
              Profielgegevens
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'credit'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCoins />
              Tegoed
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaFileInvoice />
              Facturen
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSettings />
            </motion.div>
          )}

          {activeTab === 'credit' && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Credit Balance Card */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <FaCoins className="text-yellow-500" />
                  Resterend Tegoed
                </h2>
                <div className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">Beschikbaar Krediet</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                    {formatCurrency(beschikbaar, true)}
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <TransactionsList customerId={customerId} />
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicesList customerId={customerId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Profile;


