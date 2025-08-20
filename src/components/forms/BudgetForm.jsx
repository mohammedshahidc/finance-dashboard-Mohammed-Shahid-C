import React, { useContext, useState } from 'react';
import {
  Save,
  IndianRupee,
  AlertCircle,
  UtensilsCrossed,
  Car,
  Film,
  Zap,
  Heart,
  ShoppingBag,
  GraduationCap,
  Home,
  Shield,
  PiggyBank,
  Package
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { BudgetContext } from '../../context/budgetContext';

const BudgetForm = () => {
  const { addBudget } = useContext(BudgetContext);

  const categories = [
    { name: 'Food', icon: UtensilsCrossed, color: 'from-orange-400 to-red-500' },
    { name: 'Transport', icon: Car, color: 'from-blue-400 to-blue-600' },
    { name: 'Entertainment', icon: Film, color: 'from-purple-400 to-pink-500' },
    { name: 'Utilities', icon: Zap, color: 'from-yellow-400 to-orange-500' },
    { name: 'Healthcare', icon: Heart, color: 'from-green-400 to-emerald-500' },
    { name: 'Shopping', icon: ShoppingBag, color: 'from-pink-400 to-rose-500' },
    { name: 'Education', icon: GraduationCap, color: 'from-indigo-400 to-purple-500' },
    { name: 'Rent', icon: Home, color: 'from-teal-400 to-cyan-500' },
    { name: 'Insurance', icon: Shield, color: 'from-slate-400 to-gray-500' },
    { name: 'Savings', icon: PiggyBank, color: 'from-emerald-400 to-green-600' },
    { name: 'Miscellaneous', icon: Package, color: 'from-gray-400 to-slate-500' }
  ];

  const initialValues = categories.reduce((acc, category) => {
    acc[category.name] = '';
    return acc;
  }, {});

  const validationSchema = Yup.object(
    categories.reduce((acc, category) => {
      acc[category.name] = Yup.number()
        .typeError('Enter a valid number')
        .positive('Must be a positive number')
        .required('Budget amount is required');
      return acc;
    }, {})
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const now = dayjs();
      const month = now.month() + 1;
      const year = now.year();

      const budgetData = {
        categories: values,
        month,
        year,
        total: getTotalBudget(values)
      };

      addBudget(budgetData);

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        resetForm();
      }, 3000);
    }
  });

  const getTotalBudget = (values = formik.values) =>
    categories.reduce((total, category) => {
      const amount = parseFloat(values[category.name]) || 0;
      return total + amount;
    }, 0);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-green-100 p-10 rounded-2xl shadow-lg text-center">
          <Save className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-700">Budget Saved!</h2>
          <p className="text-green-600 mt-2">
            Your total monthly budget is ₹{getTotalBudget().toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={formik.handleSubmit}>
          {/* Category Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => (
              <div key={category.name} className="p-6 border rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>

                {/* Input Field */}
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name={category.name}
                    value={formik.values[category.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amount"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                      formik.touched[category.name] && formik.errors[category.name]
                        ? 'border-red-400'
                        : 'border-gray-200'
                    }`}
                  />
                  {formik.touched[category.name] && formik.errors[category.name] && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {formik.errors[category.name]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total + Submit */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-bold">
              Total: ₹{getTotalBudget().toLocaleString('en-IN')}
            </p>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
            >
              <Save className="inline w-5 h-5 mr-2" />
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
