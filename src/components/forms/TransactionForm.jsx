import React, { useContext, useEffect, useState } from 'react';
import {
    DollarSign,
    Calendar,
    FileText,
    Tag,
    X,
    Check,
    Plus,
    Minus,
    Receipt,
    Sparkles,
    AlertCircle,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { TransactionContext } from '../../context/TransactionContext';
import { useNavigate, useParams } from 'react-router-dom';

const TransactionForm = () => {
    const { addTransaction, getTransactionsById, transactionsById, updateTransaction } = useContext(TransactionContext)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate('/')

    useEffect(() => {
        if (id) {
            getTransactionsById(id)
            setIsEditMode(true)
        } else {
            setIsEditMode(false)
        }
    }, [id])

    useEffect(() => {
        if (transactionsById && id) {
            setFormData({
                amount: transactionsById.amount || '',
                category: transactionsById.category || '',
                description: transactionsById.description || '',
                date: transactionsById.date || new Date().toISOString().split('T')[0],
                type: transactionsById.type || 'expense'
            });
        }
    }, [transactionsById, id]);

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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

    const validateField = (name, value) => {
        switch (name) {
            case 'amount':
                if (!value) return 'Amount is required';
                if (isNaN(value) || parseFloat(value) <= 0) return 'Amount must be greater than 0';
                return '';
            case 'category':
                if (!value) return 'Category is required';
                return '';
            case 'date':
                if (!value) return 'Date is required';
                if (formData.type === 'expense' && new Date(value) > new Date()) {
                    return 'Expense date cannot be in the future';
                }
                return '';
            case 'description':
                if (value.length > 200) return 'Description must be less than 200 characters';
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async () => {
        // Validate all fields
        const newErrors = {};
        const newTouched = {};

        Object.keys(formData).forEach(key => {
            newTouched[key] = true;
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        setTouched(newTouched);

        if (Object.keys(newErrors).some(key => newErrors[key])) return;

        setIsSubmitting(true);
        try {
            const formattedData = {
                ...formData,
                id: Date.now(),
                amount: parseFloat(formData.amount),
                submittedAt: new Date().toISOString()
            };
            if (isEditMode) {
                updateTransaction(id, formData)
            } else {
                addTransaction(formData)
            }
            setTimeout(() => {
                resetForm();
                setIsEditMode(false)
                navigate('/')
            }, 2000);

        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            type: 'expense'
        });
        setErrors({});
        setTouched({});
        setIsEditMode(false);
    };

    const getFieldError = (fieldName) => touched[fieldName] && errors[fieldName];

    const getSelectedCategory = () => {
        return categories.find(cat => cat.name === formData.category);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isDarkMode
                ? 'bg-black'
                : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
            }`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className={`${isDarkMode
                        ? 'bg-gray-800/80 border-gray-700'
                        : 'bg-white/80 border-white/20'
                    } backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden mb-8`}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                                    <Receipt className="mr-3 w-10 h-10" />
                                    Add Transaction
                                </h1>
                                <p className="text-indigo-100 text-lg">
                                    Track your income and expenses with ease
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                    <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                                    <p className="text-white/80 text-sm font-medium">Quick & Simple</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className={`${isDarkMode
                        ? 'bg-gray-800/80 border-gray-700'
                        : 'bg-white/80 border-white/20'
                    } backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden`}>
                    <div className="p-8">

                        {/* Transaction Type Toggle */}
                        <div className="mb-8">
                            <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                Transaction Type
                            </label>
                            <div className={`flex rounded-2xl p-2 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                                } shadow-inner`}>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('type', 'expense')}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform flex items-center justify-center space-x-3 ${formData.type === 'expense'
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl scale-105'
                                            : `${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} hover:bg-white/50`
                                        }`}
                                >
                                    <Minus className="w-6 h-6" />
                                    <span>Expense</span>
                                    <TrendingDown className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('type', 'income')}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform flex items-center justify-center space-x-3 ${formData.type === 'income'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl scale-105'
                                            : `${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} hover:bg-white/50`
                                        }`}
                                >
                                    <Plus className="w-6 h-6" />
                                    <span>Income</span>
                                    <TrendingUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Amount Field */}
                            <div className="lg:col-span-2">
                                <label htmlFor="amount" className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    Amount *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <DollarSign className={`w-6 h-6 ${getFieldError('amount') ? 'text-red-500' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    <input
                                        type="number"
                                        id="amount"
                                        step="0.01"
                                        min="0"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        className={`w-full pl-14 pr-6 py-6 text-2xl font-bold rounded-2xl border-2 transition-all duration-300 ${getFieldError('amount')
                                                ? `border-red-300 ${isDarkMode ? 'bg-red-900/20 text-white focus:border-red-400' : 'bg-red-50 text-red-900 focus:border-red-500'} focus:ring-4 focus:ring-red-100`
                                                : `${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                                                } focus:ring-4`
                                            } focus:outline-none shadow-lg hover:shadow-xl`}
                                        placeholder="0.00"
                                    />
                                    {getFieldError('amount') && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {getFieldError('amount') && (
                                    <div className="mt-3 flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {errors.amount}
                                    </div>
                                )}
                            </div>

                            {/* Category Field */}
                            <div>
                                <label htmlFor="category" className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    Category *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        {getSelectedCategory() ? (
                                            <span className="text-2xl">{getSelectedCategory().icon}</span>
                                        ) : (
                                            <Tag className={`w-6 h-6 ${getFieldError('category') ? 'text-red-500' : 'text-gray-400'
                                                }`} />
                                        )}
                                    </div>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className={`w-full pl-14 pr-6 py-4 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 ${getFieldError('category')
                                                ? `border-red-300 ${isDarkMode ? 'bg-red-900/20 text-white focus:border-red-400' : 'bg-red-50 text-red-900 focus:border-red-500'} focus:ring-4 focus:ring-red-100`
                                                : `${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                                                } focus:ring-4`
                                            } focus:outline-none shadow-lg hover:shadow-xl cursor-pointer`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.name} value={category.name}>
                                                {category.icon} {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getFieldError('category') && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {getFieldError('category') && (
                                    <div className="mt-3 flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {errors.category}
                                    </div>
                                )}
                            </div>

                            {/* Date Field */}
                            <div>
                                <label htmlFor="date" className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    Date *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <Calendar className={`w-6 h-6 ${getFieldError('date') ? 'text-red-500' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    <input
                                        type="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        max={formData.type === 'expense' ? new Date().toISOString().split('T')[0] : undefined}
                                        className={`w-full pl-14 pr-6 py-4 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 ${getFieldError('date')
                                                ? `border-red-300 ${isDarkMode ? 'bg-red-900/20 text-white focus:border-red-400' : 'bg-red-50 text-red-900 focus:border-red-500'} focus:ring-4 focus:ring-red-100`
                                                : `${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                                                } focus:ring-4`
                                            } focus:outline-none shadow-lg hover:shadow-xl`}
                                    />
                                    {getFieldError('date') && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {getFieldError('date') && (
                                    <div className="mt-3 flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {errors.date}
                                    </div>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="lg:col-span-2">
                                <label htmlFor="description" className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    Description (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 z-10">
                                        <FileText className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        maxLength={200}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className={`w-full pl-14 pr-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 resize-none ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900/20'
                                                : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-100'
                                            } focus:ring-4 focus:outline-none shadow-lg hover:shadow-xl`}
                                        placeholder="Add a note about this transaction..."
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div></div>
                                    <span className={`text-sm font-medium ${formData.description.length > 180
                                            ? 'text-orange-500'
                                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {formData.description.length}/200
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || Object.values(errors).some(error => error)}
                                className={`flex-1 group relative overflow-hidden py-5 px-8 text-xl font-bold rounded-2xl transition-all duration-300 transform ${isSubmitting || Object.values(errors).some(error => error)
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : formData.type === 'expense'
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95'
                                    }`}
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            {formData.type === 'expense' ? (
                                                <Minus className="w-6 h-6" />
                                            ) : (
                                                <Plus className="w-6 h-6" />
                                            )}
                                            <span>{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</span>
                                        </>
                                    )}
                                </div>

                                {/* Button shine effect */}
                                {!isSubmitting && !Object.values(errors).some(error => error) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                )}
                            </button>

                            <button
                                onClick={resetForm}
                                className={`flex-1 sm:flex-none py-5 px-8 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 ${isDarkMode
                                        ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'
                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                                    } shadow-lg hover:shadow-xl`}
                            >
                                <X className="w-5 h-5" />
                                <span>Reset Form</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className={`mt-8 ${isDarkMode
                        ? 'bg-gray-800/60 border-gray-700'
                        : 'bg-white/60 border-white/20'
                    } backdrop-blur-xl rounded-2xl shadow-xl border p-6`}>
                    <div className="flex items-center space-x-3 mb-4">
                        <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-indigo-500'}`} />
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Quick Tips
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            💡 <strong>Be specific:</strong> Add clear descriptions to track spending patterns
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            🎯 <strong>Categories matter:</strong> Choose the right category for better insights
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            📅 <strong>Date accuracy:</strong> Use the actual transaction date for better tracking
                        </p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            ⚡ <strong>Quick entry:</strong> Add transactions immediately to avoid forgetting
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;