

import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { DollarSign } from "lucide-react";
import { Loading } from '../components/Loading';
import { Navbar } from '../components/Navbar';
export const NGODashboard = () => {
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
                <span className={`px-2 py-1 rounded text-xs ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
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
          {activeTab === 'browse-food' && renderBrowseFood()}
          {activeTab === 'my-orders' && renderMyOrders()}
        </div>
      </div>
    </div>
  );
};
