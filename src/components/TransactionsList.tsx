import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/formatCurrency';
import { FaHistory, FaArrowUp, FaArrowDown, FaReceipt, FaDownload } from 'react-icons/fa';

interface TransactionsListProps {
  customerId: string | null;
}

const TransactionsList = ({ customerId }: TransactionsListProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      loadTransactions();
    }
  }, [customerId]);

  const loadTransactions = async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('business_club_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('transaction_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message || 'Fout bij laden transacties');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
      case 'refund':
        return <FaArrowUp className="text-green-500" />;
      case 'sale':
      case 'invoice':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaReceipt className="text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'credit':
        return 'Krediet';
      case 'sale':
        return 'Verkoop';
      case 'refund':
        return 'Terugbetaling';
      case 'invoice':
        return 'Factuur';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadReceipt = async (receiptUrl: string, transactionId: string) => {
    try {
      const response = await fetch(receiptUrl);
      if (!response.ok) throw new Error('Failed to fetch receipt');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use transaction ID
      const urlParts = receiptUrl.split('/');
      const filename = urlParts[urlParts.length - 1] || `receipt-${transactionId}.jpeg`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Fout bij downloaden bon. Probeer het opnieuw.');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-gray-600">Transacties laden...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-red-600">{error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <FaHistory className="text-gray-700" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transactie Geschiedenis</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Geen transacties gevonden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isCredit = transaction.type === 'credit' || transaction.type === 'refund';
            const amount = parseFloat(transaction.amount);
            const absoluteAmount = Math.abs(amount);

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="text-lg sm:text-xl flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {getTransactionLabel(transaction.type)}
                    </div>
                    {transaction.description && (
                      <div className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                        {transaction.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(transaction.transaction_date || transaction.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className={`text-base sm:text-lg font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(absoluteAmount, true)}
                  </div>
                  {transaction.receipt_url && (
                    <motion.button
                      onClick={() => downloadReceipt(transaction.receipt_url, transaction.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                      title="Download bon"
                      aria-label="Download bon"
                    >
                      <FaDownload className="text-sm sm:text-base" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsList;



