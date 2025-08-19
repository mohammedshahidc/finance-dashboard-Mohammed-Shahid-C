import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { DollarSign, Calendar, FileText, Tag, Plus, Edit3, X, Check } from 'lucide-react';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
const TransactionForm = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  dayjs.extend(isSameOrBefore);
  const categories = [
    'Food',
    'Transport', 
    'Entertainment',
    'Bills',
    'Shopping',
    'Salary',
    'Freelance',
    'Other'
  ];

  // Validation Schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be greater than 0')
      .typeError('Amount must be a valid number'),
    category: Yup.string()
      .required('Category is required')
      .oneOf(categories, 'Please select a valid category'),
    description: Yup.string().max(200, 'Description must be less than 200 characters'),
    date: Yup.string()
      .required('Date is required')
      .test('not-future-expense', 'Expense date cannot be in the future', function (value) {
        const { type } = this.parent;
        if (type === 'expense' && value) {
          return dayjs(value).isSameOrBefore(dayjs(), 'day');
        }
        return true;
      }),
    type: Yup.string()
      .required('Transaction type is required')
      .oneOf(['income', 'expense'], 'Invalid transaction type')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: '',
      category: '',
      description: '',
      date: dayjs().format('YYYY-MM-DD'),
      type: 'expense'
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formattedData = {
          ...values,
          amount: parseFloat(values.amount),
          date: dayjs(values.date).format('YYYY-MM-DD'),
          submittedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        console.log('Submitting transaction:', formattedData);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          formik.resetForm();
          setIsEditMode(false);
        }, 2000);

      } catch (error) {
        console.error('Error submitting transaction:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const resetForm = () => {
    formik.resetForm();
    setIsEditMode(false);
  };

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  const getFieldClasses = (fieldName) => {
    const hasError = getFieldError(fieldName);
    return `w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 ${
      hasError
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-purple-500'
    }`;
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        {/* Success Message */}
        {showSuccess && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Transaction {isEditMode ? 'updated' : 'added'} successfully on {dayjs().format('MMM D, YYYY')}!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              
              {/* Transaction Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Transaction Type
                </label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('type', 'expense')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      formik.values.type === 'expense'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('type', 'income')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      formik.values.type === 'income'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      step="0.01"
                      min="0"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={getFieldClasses('amount')}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={getFieldClasses('category')}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      max={dayjs().format('YYYY-MM-DD')}
                      className={getFieldClasses('date')}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      maxLength="200"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Add a note about this transaction..."
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formik.values.description.length}/200
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={formik.handleSubmit}
                  disabled={isSubmitting || !formik.isValid}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ${
                    isSubmitting || !formik.isValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : formik.values.type === 'expense'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/25'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500/25'
                  } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  {isSubmitting ? 'Processing...' : isEditMode ? 'Update Transaction' : 'Add Transaction'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <X className="h-5 w-5 mr-2 inline" />
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
