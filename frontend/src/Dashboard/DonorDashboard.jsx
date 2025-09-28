
import { useState,useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { DollarSign } from "lucide-react";
import { Loading } from '../components/Loading';
import { Navbar } from '../components/Navbar';
import { Package } from "lucide-react";
import { Eye } from "lucide-react";

export const DonorDashboard = () => {
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
        setFoods(data.filter(food => food.donorId === 'currentUserId')); 
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
                <span className={`px-2 py-1 rounded text-xs ${food.status === 'available' ? 'bg-green-100 text-green-800' :
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
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
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
