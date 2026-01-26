import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaGlobe, FaStore, FaCalendar } from 'react-icons/fa';

const CustomerInfo = () => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

      if (error) throw error;
      setCustomerData(data);
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-gray-600">Gegevens laden...</div>
      </motion.div>
    );
  }

  if (!customerData) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Bedrijfsinformatie</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <FaBuilding className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Bedrijfsnaam</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.company_name || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaUser className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Naam</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.name || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaEnvelope className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Email</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.email || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaPhone className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Telefoon</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.phone || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaBuilding className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Bedrijf</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.company || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaGlobe className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Website</div>
            <div className="text-sm font-medium text-gray-900">
              {customerData.website ? (
                <a href={customerData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {customerData.website}
                </a>
              ) : '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaStore className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Store</div>
            <div className="text-sm font-medium text-gray-900 uppercase">
              {customerData.store || '-'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FaCalendar className="text-gray-400 mt-1" />
          <div>
            <div className="text-xs uppercase text-gray-500 mb-1">Datum</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(customerData.datum)}
            </div>
          </div>
        </div>

        {customerData.description && (
          <div className="md:col-span-2 flex items-start gap-3">
            <div className="w-full">
              <div className="text-xs uppercase text-gray-500 mb-1">Beschrijving</div>
              <div className="text-sm text-gray-700">
                {customerData.description}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerInfo;



