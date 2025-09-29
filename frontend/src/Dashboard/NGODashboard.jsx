import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { DollarSign, Package, Eye } from "lucide-react";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";

export const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, API_URL, user } = useAuth();
  const { showToast } = useToast();

  // Fetch foods or orders on tab change or initial load
  useEffect(() => {
    if (activeTab === "browse-food") {
      fetchAvailableFoods();
    }
    if (activeTab === "my-orders" || activeTab === "overview") {
      fetchMyOrders();
    }
  }, [activeTab]);

  // Fetch available foods
  const fetchAvailableFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/foods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFoods(data.filter((f) => f.status === "available"));
      } else {
        showToast("Failed to fetch foods", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch NGO's orders
  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(
          data.map((o) => ({
            ...o,
            foodName: o.food.name,
            orderDate: new Date(o.createdAt).toLocaleString(),
          }))
        );
      } else {
        showToast("Failed to fetch orders", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to call the status update API
  const updateOrderStatusOnServer = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMyOrders(); // Refresh the orders list to show the change
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Place an order and start the simulation
  const handleOrderFood = async (foodId) => {
    if (!user.access) {
      showToast("Your access has been revoked. Cannot place orders.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity: 1, deliveryAddress: "NGO HQ" }),
      });

      if (res.ok) {
        showToast("Order placed! Starting delivery simulation...", "success");
        const newOrder = await res.json(); // Get the newly created order

        // --- SIMULATION LOGIC ---
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const simulate = async () => {
          await delay(3000); // Mark as 'confirmed' after 3 seconds
          await updateOrderStatusOnServer(newOrder._id, "confirmed");

          await delay(5000); // Mark as 'in-transit' after 5 seconds
          await updateOrderStatusOnServer(newOrder._id, "in-transit");

          await delay(5000); // Mark as 'delivered' after another 5 seconds
          await updateOrderStatusOnServer(newOrder._id, "delivered");

          showToast(`Order #${newOrder._id.slice(-6)} delivered!`, "success");
        };

        simulate();
     

        fetchAvailableFoods(); 
        fetchMyOrders();
      } else {
        showToast("Failed to place order", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{foods.length}</p>
              <p className="text-gray-600">Available Foods</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-gray-600">My Orders</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ₹{orders.reduce((sum, o) => sum + o.amount, 0)}
              </p>
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
        <Button onClick={fetchAvailableFoods} size="sm">
          Refresh
        </Button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <Card key={food._id} className="hover:shadow-md transition-shadow">
              {food.imageUrl && (
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <h4 className="font-medium text-gray-900 mt-2">{food.name}</h4>
              <p className="text-sm text-gray-600">{food.description}</p>
              <div className="text-xs text-gray-500 my-4 space-y-1">
                <p>Type: {food.type}</p>
                <p>Quantity: {food.quantity}</p>
                <p>Price: ₹{food.price}</p>
                <p>Expires: {new Date(food.expiryDate).toLocaleDateString()}</p>
                <p>Donor: {food.donor.name}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => handleOrderFood(food._id)}
              >
                Order Now
              </Button>
            </Card>
          ))}
          {foods.length === 0 && !loading && (
            <p className="text-gray-500 text-center col-span-full py-8">
              No food donations available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderMyOrders = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Orders</h3>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{order.foodName}</h4>
                  <p className="text-sm text-gray-600">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total: ₹{order.amount}</p>
                  <p className="text-sm text-gray-500">Ordered on: {order.orderDate}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    {
                      pending: "bg-yellow-100 text-yellow-800",
                      confirmed: "bg-green-100 text-green-800",
                      "in-transit": "bg-orange-100 text-orange-800",
                      delivered: "bg-blue-100 text-blue-800",
                      cancelled: "bg-red-100 text-red-800",
                    }[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </Card>
          ))}
          {orders.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">NGO Dashboard</h1>
        <nav className="flex space-x-8 mb-6 border-b">
          {[
            { id: "overview", label: "Overview" },
            { id: "browse-food", label: "Browse Food" },
            { id: "my-orders", label: "My Orders" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "browse-food" && renderBrowseFood()}
          {activeTab === "my-orders" && renderMyOrders()}
        </div>
      </div>
    </div>
  );
};