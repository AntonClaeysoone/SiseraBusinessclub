import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/formatCurrency';
import { FaFileInvoice, FaDownload, FaCalendarAlt, FaEuroSign } from 'react-icons/fa';

interface InvoicesListProps {
  customerId: string | null;
}

const InvoicesList = ({ customerId }: InvoicesListProps) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      loadInvoices();
    }
  }, [customerId]);

  const loadInvoices = async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('business_club_invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('invoice_date', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setInvoices(data || []);
    } catch (err: any) {
      setError(err.message || 'Fout bij laden facturen');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Geen datum';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const downloadInvoice = async (fileUrl: string, invoiceNumber: string | null, invoiceId: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use invoice number
      const urlParts = fileUrl.split('/');
      const filename = invoiceNumber 
        ? `factuur-${invoiceNumber}.pdf`
        : urlParts[urlParts.length - 1] || `invoice-${invoiceId}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Fout bij downloaden factuur. Probeer het opnieuw.');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-gray-600">Facturen laden...</div>
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
        <FaFileInvoice className="text-gray-700" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Facturen</h2>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaFileInvoice className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>Geen facturen gevonden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const amount = parseFloat(invoice.amount || 0);

            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="text-lg sm:text-xl flex-shrink-0 text-blue-600">
                    <FaFileInvoice />
                  </div>
                  <div className="flex-1 min-w-0">
                    {invoice.invoice_number && (
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        Factuur #{invoice.invoice_number}
                      </div>
                    )}
                    {!invoice.invoice_number && (
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        Factuur
                      </div>
                    )}
                    {invoice.description && (
                      <div className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                        {invoice.description}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {invoice.invoice_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaCalendarAlt />
                          <span>{formatDate(invoice.invoice_date)}</span>
                        </div>
                      )}
                      {amount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaEuroSign />
                          <span>{formatCurrency(amount, true)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {amount > 0 && (
                    <div className="text-base sm:text-lg font-bold text-gray-900 hidden sm:block">
                      {formatCurrency(amount, true)}
                    </div>
                  )}
                  {invoice.file_url && (
                    <motion.button
                      onClick={() => downloadInvoice(invoice.file_url, invoice.invoice_number, invoice.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download factuur"
                      aria-label="Download factuur"
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

export default InvoicesList;

