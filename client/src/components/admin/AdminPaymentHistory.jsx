import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { CreditCard, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminPaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('completed');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/history`, {
          timeout: 10000,
        });
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format received from server');
        }
        setPayments(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch payment history. Please try again later.');
        console.error('Payment fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const statusMatch = filter === 'all' || payment.status === filter;
    const searchMatch = () => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        payment.email?.toLowerCase().includes(query) ||
        payment.phone?.toLowerCase().includes(query) ||
        payment.courseName?.toLowerCase().includes(query) ||
        payment.razorpayPaymentId?.toLowerCase().includes(query)
      );
    };
    return statusMatch && searchMatch();
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPayments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExportExcel = () => {
    if (filteredPayments.length === 0) {
      alert('No records to export for the current filter.');
      return;
    }
    
    // 1. Add S.No. to Excel export data
    const dataToExport = filteredPayments.map((p, index) => ({
      'S.No.': index + 1,
      Date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A',
      Email: p.email || 'N/A',
      Phone: p.phone || 'N/A',
      'Course Name': p.courseName || 'N/A',
      'Amount (INR)': p.amount ? `₹${p.amount.toFixed(2)}` : 'N/A',
      Status: p.status || 'N/A',
      'Payment ID': p.razorpayPaymentId || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, `payment_history_${filter}_${Date.now()}.xlsx`);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="Go back to Admin page"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <CreditCard className="mr-2" size={24} /> Payment History
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="completed">Completed</option>
              <option value="created">Created</option>
              <option value="failed">Failed</option>
              <option value="all">All</option>
            </select>
            <button
              onClick={handleExportExcel}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              Export to Excel
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center p-10 text-gray-600">Loading payment history...</div>
        ) : error ? (
          <div className="text-center p-10 text-red-500">{error}</div>
        ) : currentRecords.length === 0 ? (
          <div className="text-center p-10 text-gray-500">No payment records found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    {/* 2. Add S.No. table header */}
                    <th className="p-4 text-left text-sm font-semibold">S.No.</th>
                    <th className="p-4 text-left text-sm font-semibold">Email</th>
                    <th className="p-4 text-left text-sm font-semibold">Phone</th>
                    <th className="p-4 text-left text-sm font-semibold">Course Name</th>
                    <th className="p-4 text-left text-sm font-semibold">Amount (INR)</th>
                    <th className="p-4 text-left text-sm font-semibold">Status</th>
                    <th className="p-4 text-left text-sm font-semibold">Payment ID</th>
                    <th className="p-4 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
                    >
                      {/* 3. Add S.No. table data cell with calculation */}
                      <td className="p-4 text-gray-700">{indexOfFirstRecord + index + 1}</td>
                      <td className="p-4 text-gray-700">{payment.email || 'N/A'}</td>
                      <td className="p-4 text-gray-700">{payment.phone || 'N/A'}</td>
                      <td className="p-4 text-gray-700">{payment.courseName || 'N/A'}</td>
                      <td className="p-4 text-gray-700">{payment.amount ? `₹${payment.amount.toFixed(2)}` : 'N/A'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 font-mono">{payment.razorpayPaymentId || 'N/A'}</td>
                      <td className="p-4 text-gray-700">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition duration-200`}
                >
                  <ChevronLeft className="mr-2" size={18} /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === currentPage ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition duration-200`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition duration-200`}
                >
                  Next <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentHistory;