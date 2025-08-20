import React, { useState } from 'react';
import {
  Settings,
  User,
  DollarSign,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  Save,
  Edit,
  Check,
  X,
  AlertTriangle,
  FileText,
  Palette,
  Shield,
  IndianRupee,
  Euro,
  PoundSterling,
  PiggyBank
} from 'lucide-react';

const SettingsComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currency: 'INR'
  });
  const [editProfile, setEditProfile] = useState(profile);

  const [budgets, setBudgets] = useState({});

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', icon: IndianRupee },
    { code: 'USD', symbol: '$', name: 'US Dollar', icon: DollarSign },
    { code: 'EUR', symbol: '€', name: 'Euro', icon: Euro },
    { code: 'GBP', symbol: '£', name: 'British Pound', icon: PoundSterling }
  ];

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '₹';
  };

  const handleProfileSave = () => {
    setProfile(editProfile);
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setEditProfile(profile);
    setIsEditingProfile(false);
  };

  const handleBudgetChange = (category, value) => {
    // This function is no longer needed since budget management is in a separate component
  };

  const handleExportData = () => {
    const data = {
      profile,
      budgets,
      settings: { isDarkMode },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.profile) setProfile(data.profile);
          if (data.settings && typeof data.settings.isDarkMode === 'boolean') {
            setIsDarkMode(data.settings.isDarkMode);
          }
          setShowImportSuccess(true);
          setTimeout(() => setShowImportSuccess(false), 3000);
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    setProfile({ name: '', email: '', currency: 'INR' });
    setShowClearConfirm(false);
  };

  const getTotalBudget = () => {
    // Return a placeholder since budget data comes from your separate component
    return 45000; // You can replace this with actual data if needed
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    } p-4`}>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-white/20'
        } backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden mb-8`}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                  <Settings className="mr-3 w-10 h-10" />
                  Settings & Preferences
                </h1>
                <p className="text-indigo-100 text-lg">
                  Manage your profile, budgets, and app preferences
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <p className="text-white/80 text-sm font-medium mb-1">TOTAL BUDGET</p>
                  <p className="text-3xl font-bold text-white">
                    {getCurrencySymbol(profile.currency)}{getTotalBudget().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {showExportSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center animate-pulse">
            <Check className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">Data exported successfully!</span>
          </div>
        )}

        {showImportSuccess && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center animate-pulse">
            <Check className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-blue-800">Data imported successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile & Theme */}
          <div className="space-y-8">
            {/* User Profile Section */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl shadow-xl border p-8`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                  <User className="mr-3 w-6 h-6" />
                  User Profile
                </h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } focus:outline-none focus:ring-4 focus:ring-indigo-100`}
                    />
                  ) : (
                    <p className={`px-4 py-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                    } font-medium`}>
                      {profile.name || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } focus:outline-none focus:ring-4 focus:ring-indigo-100`}
                    />
                  ) : (
                    <p className={`px-4 py-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                    } font-medium`}>
                      {profile.email || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Currency Preference
                  </label>
                  {isEditingProfile ? (
                    <select
                      value={editProfile.currency}
                      onChange={(e) => setEditProfile(prev => ({ ...prev, currency: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } focus:outline-none focus:ring-4 focus:ring-indigo-100`}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className={`px-4 py-3 rounded-xl ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                    } font-medium flex items-center`}>
                      {getCurrencySymbol(profile.currency)} {currencies.find(c => c.code === profile.currency)?.name}
                    </p>
                  )}
                </div>

                {isEditingProfile && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleProfileSave}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleProfileCancel}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                        isDarkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Toggle Section */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl shadow-xl border p-8`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <Palette className="mr-3 w-6 h-6" />
                Appearance
              </h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-yellow-500/20' : 'bg-gray-100'
                  }`}>
                    {isDarkMode ? (
                      <Moon className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isDarkMode ? 'Easy on the eyes' : 'Classic bright theme'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                    isDarkMode ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                      isDarkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Data Management Section */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl shadow-xl border p-8`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <Shield className="mr-3 w-6 h-6" />
                Data Management
              </h2>

              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Export Data
                </button>

                <label className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center cursor-pointer">
                  <Upload className="w-5 h-5 mr-3" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 mr-3" />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            {/* Budget Management Link */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl shadow-xl border p-8 mb-8`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <DollarSign className="mr-3 w-6 h-6" />
                Budget Management
              </h2>

              <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-700 hover:border-purple-500' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <PiggyBank className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Set Monthly Budgets
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Configure spending limits for all categories
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Navigate to budget component
                      console.log('Navigate to budget planner');
                      // You can replace this with your navigation logic
                      // e.g., router.push('/budget') or setActiveComponent('budget')
                    }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center group"
                  >
                    <span className="mr-2">Manage Budgets</span>
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className={`mt-4 p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800/50' 
                    : 'bg-white/50'
                }`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    💡 <strong>Tip:</strong> Set realistic budgets based on your income and track your spending patterns
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } backdrop-blur-xl rounded-2xl shadow-xl border p-8`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <FileText className="mr-3 w-6 h-6" />
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-sm">View Reports</p>
                  </div>
                </button>

                <button className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Save className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-sm">Backup Data</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl border shadow-2xl p-8 max-w-md w-full`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Clear All Data?
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This will permanently delete all your profile data and budget settings. This action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleClearData}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsComponent;