import React, { useState, useContext, createContext, useEffect } from 'react';
import { User, Plus, Eye, Settings, Users, DollarSign, Package, Bell, LogOut, Menu, X } from 'lucide-react';


const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.REACT_APP_API_URL || 'https://your-backend-link.com/api';

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

// Toast Context
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-2 rounded text-white ${
            toast.type === 'success' ? 'bg-green-500' : 
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

// Components
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent ${className} ${error ? 'border-red-500' : ''}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300 ${className} ${error ? 'border-red-500' : ''}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Loading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

// Navigation Components
const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = {
    donor: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'My Donations', href: '#my-donations' },
      { name: 'Donate Funds', href: '#donate-funds' }
    ],
    ngo: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Browse Food', href: '#browse-food' },
      { name: 'My Orders', href: '#my-orders' },
      { name: 'Donate Funds', href: '#donate-funds' }
    ],
    admin: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Users', href: '#users' },
      { name: 'Food Items', href: '#food-items' },
      { name: 'Fund Donations', href: '#fund-donations' }
    ]
  };

  return (
    <nav className="bg-deep-gray text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-green-400">FoodLink</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {user && navigationItems[user.role]?.map(item => (
              <a key={item.name} href={item.href} className="hover:text-green-400 transition-colors">
                {item.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 ml-8">
              <span className="text-sm">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="text-gray-300 border-gray-500 hover:bg-gray-700">
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && navigationItems[user.role]?.map(item => (
              <a key={item.name} href={item.href} className="block px-3 py-2 hover:text-green-400">
                {item.name}
              </a>
            ))}
            <button onClick={logout} className="block w-full text-left px-3 py-2 hover:text-green-400">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Auth Pages
const LoginPage = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      showToast(result.message, 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-500 mb-2">FoodLink</h1>
          <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Button 
            type="submit" 
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="text-green-500 hover:underline font-medium">
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

const SignupPage = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'donor'
  });
  const [errors, setErrors] = useState({});
  const { signup, loading } = useAuth();
  const { showToast } = useToast();

  const roles = [
    { value: 'donor', label: 'Food Donor' },
    { value: 'ngo', label: 'NGO' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(formData);
    if (result.success) {
      showToast('Account created successfully! Please login.', 'success');
      onSwitch();
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-500 mb-2">FoodLink</h1>
          <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Select
            name="role"
            label="Account Type"
            value={formData.role}
            onChange={handleChange}
            options={roles}
            error={errors.role}
          />
          <Button 
            type="submit" 
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-green-500 hover:underline font-medium">
            Sign in
          </button>
        </p>
      </Card>
    </div>
  );
};

// Dashboard Components
const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [foods, setFoods] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, API_URL } = useAuth();
  const { showToast } = useToast();

  const [foodForm, setFoodForm] = useState({
    name: '', type: 'fruits', quantity: '', expiryDate: '', price: '', description: '', image: ''
  });

  const foodTypes = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'prepared', label: 'Prepared Food' }
  ];

  useEffect(() => {
    if (activeTab === 'my-donations') {
      fetchMyFoods();
    }
  }, [activeTab]);

  const fetchMyFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/foods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFoods(data.filter(food => food.donorId === 'currentUserId')); // Filter by actual donor ID
      }
    } catch (error) {
      showToast('Failed to fetch donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(foodForm)
      });
      
      if (response.ok) {
        showToast('Food donation added successfully!', 'success');
        setFoodForm({
          name: '', type: 'fruits', quantity: '', expiryDate: '', price: '', description: '', image: ''
        });
      } else {
        showToast('Failed to add food donation', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const handleFoodChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600">Total Donations</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-gray-600">Active Listings</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹2,450</p>
              <p className="text-gray-600">Fund Donations</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAddFood = () => (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Add Food Donation</h3>
      <form onSubmit={handleAddFood} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Food Name"
            value={foodForm.name}
            onChange={handleFoodChange}
            required
          />
          <Select
            name="type"
            label="Food Type"
            value={foodForm.type}
            onChange={handleFoodChange}
            options={foodTypes}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="quantity"
            label="Quantity"
            value={foodForm.quantity}
            onChange={handleFoodChange}
            required
          />
          <Input
            name="expiryDate"
            label="Expiry Date"
            type="date"
            value={foodForm.expiryDate}
            onChange={handleFoodChange}
            required
          />
          <Input
            name="price"
            label="Price (₹)"
            type="number"
            value={foodForm.price}
            onChange={handleFoodChange}
            required
          />
        </div>
        <Input
          name="description"
          label="Description"
          value={foodForm.description}
          onChange={handleFoodChange}
        />
        <Input
          name="image"
          label="Image URL"
          value={foodForm.image}
          onChange={handleFoodChange}
        />
        <Button type="submit" variant="secondary">
          <Plus size={16} className="mr-2" />
          Add Food Donation
        </Button>
      </form>
    </Card>
  );

  const renderMyDonations = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Food Donations</h3>
        <Button onClick={fetchMyFoods} size="sm">Refresh</Button>
      </div>
      
      {loading ? <Loading /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map(food => (
            <Card key={food.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{food.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  food.status === 'available' ? 'bg-green-100 text-green-800' :
                  food.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {food.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{food.description}</p>
              <div className="text-xs text-gray-500">
                <p>Type: {food.type}</p>
                <p>Quantity: {food.quantity}</p>
                <p>Price: ₹{food.price}</p>
                <p>Expires: {food.expiryDate}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
        </div>
        
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'add-food', label: 'Add Food' },
              { id: 'my-donations', label: 'My Donations' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'add-food' && renderAddFood()}
          {activeTab === 'my-donations' && renderMyDonations()}
        </div>
      </div>
    </div>
  );
};

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, API_URL } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'browse-food') {
      fetchAvailableFoods();
    } else if (activeTab === 'my-orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchAvailableFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/foods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFoods(data.filter(food => food.status === 'available'));
      }
    } catch (error) {
      showToast('Failed to fetch food items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderFood = async (foodId) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ foodId })
      });
      
      if (response.ok) {
        showToast('Order placed successfully!', 'success');
        fetchAvailableFoods();
      } else {
        showToast('Failed to place order', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">25</p>
              <p className="text-gray-600">Available Foods</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-gray-600">My Orders</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹1,200</p>
              <p className="text-gray-600">Total Spent</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderBrowseFood = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Available Food Donations</h3>
        <Button onClick={fetchAvailableFoods} size="sm">Refresh</Button>
      </div>
      
      {loading ? <Loading /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map(food => (
            <Card key={food.id} className="hover:shadow-md transition-shadow">
              <div className="mb-4">
                {food.image && (
                  <img src={food.image} alt={food.name} className="w-full h-32 object-cover rounded" />
                )}
                <h4 className="font-medium text-gray-900 mt-2">{food.name}</h4>
                <p className="text-sm text-gray-600">{food.description}</p>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                <p>Type: {food.type}</p>
                <p>Quantity: {food.quantity}</p>
                <p>Price: ₹{food.price}</p>
                <p>Expires: {food.expiryDate}</p>
                <p>Donor: {food.donorName}</p>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => handleOrderFood(food.id)}
              >
                Order Now
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyOrders = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Orders</h3>
      {loading ? <Loading /> : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{order.foodName}</h4>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total: ₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-500">Ordered on: {order.orderDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </Card>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
        </div>
        
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'browse-food', label: 'Browse Food' },
              { id: 'my-orders', label: 'My Orders' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'browse-food' && renderBrowseFood()}
          {activeTab === 'my-orders' && renderMyOrders()}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [fundDonations, setFundDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, API_URL } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'food-items') {
      fetchAllFoods();
    } else if (activeTab === 'fund-donations') {
      fetchFundDonations();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/foods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFoods(data);
      }
    } catch (error) {
      showToast('Failed to fetch food items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFundDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/funds`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFundDonations(data);
      }
    } catch (error) {
      showToast('Failed to fetch fund donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        showToast(`User ${action}d successfully`, 'success');
        fetchUsers();
      } else {
        showToast(`Failed to ${action} user`, 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-gray-600">Food Items</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹45,230</p>
              <p className="text-gray-600">Fund Donations</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600">Pending Approvals</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registration', user: 'John Doe', time: '2 hours ago' },
              { action: 'Food donation added', user: 'Green Grocers', time: '3 hours ago' },
              { action: 'Fund donation received', user: 'Anonymous', time: '5 hours ago' },
              { action: 'NGO approval request', user: 'Help Foundation', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-4">System Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Donors</span>
              <span className="font-medium">78</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Registered NGOs</span>
              <span className="font-medium">34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Orders</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Platform Usage</span>
              <span className="font-medium text-green-600">↑ 15%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={fetchUsers} size="sm">Refresh</Button>
      </div>
      
      {loading ? <Loading /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleUserAction(user.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  const renderFoodItems = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Food Items Management</h3>
        <Button onClick={fetchAllFoods} size="sm">Refresh</Button>
      </div>
      
      {loading ? <Loading /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map(food => (
            <Card key={food.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{food.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  food.status === 'available' ? 'bg-green-100 text-green-800' :
                  food.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  food.status === 'collected' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {food.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{food.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Donor: {food.donorName}</p>
                <p>Type: {food.type}</p>
                <p>Quantity: {food.quantity}</p>
                <p>Price: ₹{food.price}</p>
                <p>Expires: {food.expiryDate}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderFundDonations = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fund Donations</h3>
        <Button onClick={fetchFundDonations} size="sm">Refresh</Button>
      </div>
      
      {loading ? <Loading /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fundDonations.map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{donation.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.donationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'food-items', label: 'Food Items' },
              { id: 'fund-donations', label: 'Fund Donations' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'food-items' && renderFoodItems()}
          {activeTab === 'fund-donations' && renderFundDonations()}
        </div>
      </div>
    </div>
  );
};

// Fund Donation Component
const FundDonationModal = ({ isOpen, onClose }) => {
  const [donationData, setDonationData] = useState({
    amount: '', purpose: 'general', paymentMethod: 'upi'
  });
  const [loading, setLoading] = useState(false);
  const { token, API_URL } = useAuth();
  const { showToast } = useToast();

  const purposes = [
    { value: 'general', label: 'General Fund' },
    { value: 'emergency', label: 'Emergency Relief' },
    { value: 'education', label: 'Education Support' },
    { value: 'healthcare', label: 'Healthcare' }
  ];

  const paymentMethods = [
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'netbanking', label: 'Net Banking' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donationData)
      });
      
      if (response.ok) {
        showToast('Fund donation submitted successfully!', 'success');
        setDonationData({ amount: '', purpose: 'general', paymentMethod: 'upi' });
        onClose();
      } else {
        showToast('Failed to process donation', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDonationData({ ...donationData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Make a Fund Donation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            name="amount"
            label="Donation Amount (₹)"
            type="number"
            min="1"
            value={donationData.amount}
            onChange={handleChange}
            required
          />
          <Select
            name="purpose"
            label="Donation Purpose"
            value={donationData.purpose}
            onChange={handleChange}
            options={purposes}
          />
          <Select
            name="paymentMethod"
            label="Payment Method"
            value={donationData.paymentMethod}
            onChange={handleChange}
            options={paymentMethods}
          />
          
          <div className="flex space-x-3">
            <Button 
              type="submit" 
              variant="secondary" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Donate Now'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// Main App Component
const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const { user } = useAuth();

  // Add fund donation button to navbar
  useEffect(() => {
    const handleFundDonation = () => setShowFundModal(true);
    
    // This would typically be handled by routing, but for this demo we'll use hash navigation
    const handleHashChange = () => {
      if (window.location.hash === '#donate-funds') {
        setShowFundModal(true);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'donor':
        return <DonorDashboard />;
      case 'ngo':
        return <NGODashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  if (!user) {
    return (
      <div>
        {showLogin ? (
          <LoginPage onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignupPage onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div>
      {renderDashboard()}
      <FundDonationModal 
        isOpen={showFundModal} 
        onClose={() => setShowFundModal(false)} 
      />
    </div>
  );
};

// Root Component with Providers
const Root = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
};

export default Root;