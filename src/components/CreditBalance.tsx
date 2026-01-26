import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/formatCurrency';
import { FaCoins, FaArrowUp, FaArrowDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface CreditBalanceProps {
  customerId: string | null;
}

const CreditBalance = ({ customerId }: CreditBalanceProps) => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadCustomerData();
      if (customerId) {
        loadRecentTransactions();
      }
    }
  }, [user, customerId]);

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

  const loadRecentTransactions = async () => {
    if (!customerId) return;

    try {
      const { data, error } = await supabase
        .from('business_club_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-gray-600">Loading balance...</div>
      </motion.div>
    );
  }

  if (!customerData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-gray-600">Geen gegevens beschikbaar</div>
      </motion.div>
    );
  }

  const tegoeden = parseFloat(customerData.tegoeden || 0);
  const opgebruikt = parseFloat(customerData.opgebruikt || 0);
  const saldo = parseFloat(customerData.saldo || 0);
  const factuur = parseFloat(customerData.factuur || 0);
  const beschikbaar = Math.max(0, tegoeden - opgebruikt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaCoins className="text-yellow-500" />
          Financiële Overzicht
        </h2>
      </div>

      {/* Main Balance */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
        <div className="text-sm text-gray-600 mb-1">Beschikbaar Krediet</div>
        <div className="text-4xl font-bold text-gray-900">
          {formatCurrency(beschikbaar, true)}
        </div>
      </div>

      {/* Financial Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Tegoeden</span>
          <span className="text-lg font-bold text-green-600">{formatCurrency(tegoeden, true)}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Opgebruikt</span>
          <span className="text-lg font-bold text-red-600">{formatCurrency(opgebruikt, true)}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Saldo</span>
          <span className="text-lg font-bold text-blue-600">{formatCurrency(saldo, true)}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">Factuur</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(factuur, true)}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-700">FA Ontvangen</span>
          <span className="text-lg">
            {customerData.fa_ontv ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </span>
        </div>
      </div>

      {recentTransactions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Recente Transacties
          </h3>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => {
              const isCredit = transaction.type === 'credit' || transaction.type === 'refund';
              const amount = parseFloat(transaction.amount);
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {isCredit ? (
                      <FaArrowUp className="text-green-500" />
                    ) : (
                      <FaArrowDown className="text-red-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.type === 'credit' && 'Krediet'}
                        {transaction.type === 'sale' && 'Verkoop'}
                        {transaction.type === 'refund' && 'Terugbetaling'}
                        {transaction.type === 'invoice' && 'Factuur'}
                      </div>
                      {transaction.description && (
                        <div className="text-xs text-gray-500">{transaction.description}</div>
                      )}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(Math.abs(amount), true)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreditBalance;




