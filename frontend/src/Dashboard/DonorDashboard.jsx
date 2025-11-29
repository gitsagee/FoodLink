import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";

import { Navbar } from "../components/Navbar";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";

import { DollarSign, Package, Eye, Plus } from "lucide-react";

export const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [foods, setFoods] = useState([]);
  const [funds, setFunds] = useState([]); // ⭐ FUND HISTORY
  const [loading, setLoading] = useState(false);

  const { user, token, API_URL } = useAuth();
  const { showToast } = useToast();

  // -----------------------------------------
  // FOOD FORM
  // -----------------------------------------
  const [foodForm, setFoodForm] = useState({
    name: "",
    type: "fruits",
    quantity: "",
    expiryDate: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const foodTypes = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "grains", label: "Grains" },
    { value: "dairy", label: "Dairy" },
    { value: "meat", label: "Meat" },
    { value: "prepared", label: "Prepared Food" },
  ];

  // -----------------------------------------
  // FUND FORM
  // -----------------------------------------
  const [fundForm, setFundForm] = useState({
    amount: "",
    paymentMethod: "upi",
    purpose: "",
  });

  const handleFundChange = (e) => {
    setFundForm({ ...fundForm, [e.target.name]: e.target.value });
  };

  const handleFundDonation = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/funds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fundForm),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Fund donation successful!", "success");
        setFundForm({ amount: "", paymentMethod: "upi", purpose: "" });
        fetchMyFunds(); // ⭐ refresh history
      } else {
        showToast(data.message || "Failed to donate funds", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    }
  };

  // -----------------------------------------
  // FETCH MY FOOD DONATIONS
  // -----------------------------------------
  const fetchMyFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/foods/my-foods`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) setFoods(data);
      else showToast("Failed to fetch food donations", "error");

    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // FETCH MY FUND DONATIONS ⭐
  // -----------------------------------------
  const fetchMyFunds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/funds/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setFunds(data);
      else showToast("Failed to fetch fund history", "error");

    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load when tab changes
  useEffect(() => {
    if (activeTab === "my-donations") fetchMyFoods();
    if (activeTab === "my-funds") fetchMyFunds();
  }, [activeTab]);

  // -----------------------------------------
  // ADD FOOD
  // -----------------------------------------
  const handleFoodChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    if (!user.access) {
      showToast("Admin has not granted food donation access", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foodForm),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Food donation added!", "success");
        setFoodForm({
          name: "",
          type: "fruits",
          quantity: "",
          expiryDate: "",
          price: "",
          description: "",
          imageUrl: "",
        });
      } else {
        showToast(data.message || "Failed to add food donation", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    }
  };

  // -----------------------------------------
  // TABS UI
  // -----------------------------------------
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-center">
          <Package className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{user.totalFoodDonated || 0}</p>
            <p className="text-gray-600">Total Food (kg)</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">₹{user.totalFundsDonated || 0}</p>
            <p className="text-gray-600">Fund Donations</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <Eye className="h-8 w-8 text-orange-500" />
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{foods.length}</p>
            <p className="text-gray-600">Active Food Listings</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAddFood = () => (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Add Food Donation</h3>
      <form onSubmit={handleAddFood} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" label="Food Name" value={foodForm.name} onChange={handleFoodChange} required />
         
        </div>

        
        <Input name="imageUrl" label="Image URL" value={foodForm.imageUrl} onChange={handleFoodChange} />

        <Button type="submit" variant="secondary">
          <Plus size={16} className="mr-2" /> Add Food Donation
        </Button>
      </form>
    </Card>
  );
  
    
  const renderMyDonations = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Food Donations</h3>
        <Button size="sm" onClick={fetchMyFoods}>Refresh</Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <Card key={food._id} className="p-4 flex flex-col h-full">
                          <div className="flex-grow">
                              {food.imageUrl && (
                                  <img
                                      src={food.imageUrl}
                                      className="w-full h-32 object-cover rounded"
                                  />
                              )}
              <h4 className="font-semibold text-gray-900">{food.name}</h4>
              <p className="text-gray-600 text-sm">{food.description}</p>
              <div className="text-sm mt-2 text-gray-500">
              </div>
                <p>Type: {food.type}</p>
                <p>Quantity: {food.quantity} kg</p>
                <p>Price: ₹{food.price}</p>
                <p>Expiry: {food.expiryDate}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // -----------------------------------------
  // FUND DONATION HISTORY ⭐
  // -----------------------------------------
  const renderMyFunds = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Fund Donations</h3>
        <Button size="sm" onClick={fetchMyFunds}>Refresh</Button>
      </div>

      {loading ? (
        <Loading />
      ) : funds.length === 0 ? (
        <p className="text-gray-500">No fund donations yet.</p>
      ) : (
        <div className="space-y-4">
          {funds.map((fund) => (
            <Card key={fund._id}>
              <h4 className="font-semibold text-gray-900">₹{fund.amount}</h4>
              <p className="text-gray-600 text-sm">{fund.paymentMethod.toUpperCase()}</p>
              <p className="text-gray-500 text-sm">Purpose: {fund.purpose || "—"}</p>
              <p className="text-gray-400 text-xs mt-2">
                Date: {new Date(fund.createdAt).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderFundDonation = () => (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Donate Funds</h3>

      <form onSubmit={handleFundDonation} className="space-y-4">
        <Input
          name="amount"
          type="number"
          label="Amount (₹)"
          value={fundForm.amount}
          onChange={handleFundChange}
          required
        />

        <Select
          name="paymentMethod"
          label="Payment Method"
          value={fundForm.paymentMethod}
          onChange={handleFundChange}
          options={[
            { value: "upi", label: "UPI" },
            { value: "card", label: "Card" },
            { value: "cash", label: "Cash" },
            { value: "netbanking", label: "Net Banking" },
          ]}
        />

        <Input
          name="purpose"
          label="Purpose (Optional)"
          value={fundForm.purpose}
          onChange={handleFundChange}
          placeholder="Ex: feed children"
        />

        <Button type="submit" variant="primary">
          <DollarSign size={16} className="mr-2" /> Donate Now
        </Button>
      </form>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Donor Dashboard</h1>

        <nav className="flex space-x-8 mb-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "add-food", label: "Add Food" },
            { id: "my-donations", label: "My Donations" },
            { id: "fund-donation", label: "Donate Funds" },
            { id: "my-funds", label: "Fund History" }, // ⭐ NEW TAB
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "add-food" && renderAddFood()}
        {activeTab === "my-donations" && renderMyDonations()}
        {activeTab === "fund-donation" && renderFundDonation()}
        {activeTab === "my-funds" && renderMyFunds()}
      </div>
    </div>
  );
};
