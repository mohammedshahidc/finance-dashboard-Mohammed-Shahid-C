import React, { useState, useMemo, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Tag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Sparkles,
  Eye,
  Plus
} from 'lucide-react';
import { TransactionContext } from '../../context/TransactionContext';
import { useNavigate } from 'react-router-dom';

const TransactionsList = ({ itemsPerPage = 10}) => {
  const { transactions, deleteTransaction } = useContext(TransactionContext);
const navigate=useNavigate()
const [isDarkMode,setIsDarkMode]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
        setIsDarkMode(storedDarkMode === "true");
    }

    const checkAndUpdateDarkMode = () => {
        const currentStoredValue = localStorage.getItem("darkMode") === "true";
        if (currentStoredValue !== isDarkMode) {
            setIsDarkMode(currentStoredValue);
        }
    };

    const handleStorageChange = (e) => {
        if (e.key === 'darkMode' && e.newValue !== null) {
            const newDarkMode = e.newValue === "true";
            setIsDarkMode(newDarkMode);
        }
    };

    const handleCustomDarkModeChange = (e) => {
        setIsDarkMode(e.detail.isDarkMode);
    };

    const handleFocus = () => {
        checkAndUpdateDarkMode();
    };

    const pollInterval = setInterval(checkAndUpdateDarkMode, 500);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('darkModeChange', handleCustomDarkModeChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            checkAndUpdateDarkMode();
        }
    });

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('darkModeChange', handleCustomDarkModeChange);
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', checkAndUpdateDarkMode);
        clearInterval(pollInterval);
    };
}, [isDarkMode]);

// Apply theme changes
useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}, [isDarkMode]);
  const categories = [
    { name: 'Food', icon: '🍕', color: 'from-orange-400 to-red-500' },
    { name: 'Transport', icon: '🚗', color: 'from-blue-400 to-blue-600' },
    { name: 'Entertainment', icon: '🎬', color: 'from-purple-400 to-pink-500' },
    { name: 'Bills', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { name: 'Shopping', icon: '🛍️', color: 'from-pink-400 to-rose-500' },
    { name: 'Salary', icon: '💰', color: 'from-green-400 to-emerald-500' },
    { name: 'Freelance', icon: '💻', color: 'from-indigo-400 to-purple-500' },
    { name: 'Other', icon: '📦', color: 'from-gray-400 to-slate-500' }
  ];

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
    if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);

    if (dateRange.start) filtered = filtered.filter(t => dayjs(t.date).isAfter(dayjs(dateRange.start).subtract(1, 'day')));
    if (dateRange.end) filtered = filtered.filter(t => dayjs(t.date).isBefore(dayjs(dateRange.end).add(1, 'day')));

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'amount': aValue = a.amount; bValue = b.amount; break;
        case 'date': aValue = dayjs(a.date); bValue = dayjs(b.date); break;
        case 'category': aValue = a.category; bValue = b.category; break;
        default: aValue = dayjs(a.date); bValue = dayjs(b.date);
      }

      if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
      else return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [transactions, searchTerm, filterCategory, filterType, dateRange, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString) =>
    dayjs(dateString).format('MMM D, YYYY');

  const getCategoryInfo = (categoryName) =>
    categories.find(c => c.name === categoryName) || categories[categories.length - 1];

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden mb-8`}>
  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
          <Receipt className="mr-3 w-10 h-10" />
          Transaction History
        </h1>
        <p className="text-indigo-100 text-lg">
          View and manage all your financial transactions
        </p>
      </div>

      {/* Right section with count + button */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Eye className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white/80 text-sm font-medium">
              {filteredTransactions.length} Transactions
            </p>
          </div>
        </div>

        <button 
          onClick={() =>navigate('/addtransaction')}
          className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-5 py-3 rounded-2xl shadow-md hover:bg-indigo-50 transition"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>
    </div>
  </div>
</div>


        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-xl rounded-3xl shadow-2xl border mb-8`}>
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Filter className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Filter & Search
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                    } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Tag className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                    } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl cursor-pointer`}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                    } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl cursor-pointer`}
                  >
                    <option value="all">All Types</option>
                    <option value="income">💰 Income</option>
                    <option value="expense">💸 Expense</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Date</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                    } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Date</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20' 
                        : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                    } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden`}>
          {/* Table Header */}
          <div className={`px-8 py-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</h3>
              <div className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-purple-900/20 text-purple-300' : 'bg-indigo-100 text-indigo-700'} text-sm font-semibold`}>
                {filteredTransactions.length} results
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {paginatedTransactions.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Receipt className={`w-10 h-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No transactions found</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search criteria or add some transactions</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTransactions.map((transaction, index) => {
                  const categoryInfo = getCategoryInfo(transaction.category);
                  return (
                    <div key={transaction.id} className={`p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200 ${index % 2 === 0 ? 'bg-transparent' : isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50/30'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Transaction Type Icon */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-red-500'} shadow-lg`}>
                            {transaction.type === 'income' ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
                          </div>

                          {/* Transaction Details - Horizontal Layout */}
                          <div className="flex-1">
                            {/* Description */}
                            <div className="mb-3">
                              <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {transaction.description || 'No description'}
                              </h4>
                            </div>

                            {/* Category, Date, and Type in horizontal layout */}
                            <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                              {/* Category */}
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${categoryInfo.color} text-white shadow-md`}>
                                <span className="text-base">{categoryInfo.icon}</span>
                                <span>{transaction.category}</span>
                              </div>

                              {/* Date */}
                              <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(transaction.date)}</span>
                              </span>

                              {/* Type */}
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                {transaction.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Amount and Actions */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                              className={`p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100'}`}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className={`p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'}`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-gray-700 text-white disabled:text-gray-500' : 'bg-gray-100 text-gray-700 disabled:text-gray-400'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-gray-700 text-white disabled:text-gray-500' : 'bg-gray-100 text-gray-700 disabled:text-gray-400'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;