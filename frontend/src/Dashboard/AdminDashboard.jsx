

import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { DollarSign } from "lucide-react";
import { Loading } from '../components/Loading';
import { Navbar } from '../components/Navbar';
import { Users, Package, Bell } from "lucide-react";
export const AdminDashboard = () => {
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
                // console.log(data);
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
    if (action === "delete") {
      // Delete user
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        showToast(result.message || "User deleted successfully", "success");
        fetchUsers();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to delete user", "error");
      }
    } else if (action === "grant" || action === "revoke") {
      // Toggle access
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ access: action === "grant" }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        showToast(
          `Access ${updatedUser.access ? "granted" : "revoked"} successfully`,
          "success"
        );
        fetchUsers();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to update access", "error");
      }
    }
  } catch (error) {
    showToast("Network error", "error");
  }
};

    const handleDeleteFood = async (foodId) => {
        try {
            const response = await fetch(`${API_URL}/foods/${foodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                showToast(result.message || 'Food deleted successfully', 'success');
                fetchAllFoods(); // refresh after deletion
            } else {
                const errorData = await response.json();
                showToast(errorData.message || 'Failed to delete food', 'error');
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  {/* User info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{user.role}</span>
                  </td>

                  {/* Access */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.access
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.access ? "Granted" : "Revoked"}
                    </span>
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()} {/* assumes createdAt exists */}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          handleUserAction(
                            user._id,
                            user.access ? "revoke" : "grant"
                          )
                        }
                      >
                        {user.access ? "Revoke Access" : "Grant Access"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUserAction(user._id, "delete")}
                      >
                        Delete
                      </Button>
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
                        <Card key={food._id} className="hover:shadow-md transition-shadow p-4">
                            {/* Food Image */}
                            {food.imageUrl && (
                                <img
                                    src={food.imageUrl}
                                    alt={food.name}
                                    className="w-full h-32 object-cover rounded mb-3"
                                />
                            )}

                            {/* Header with name + status */}
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{food.name}</h4>
                                <span
                                    className={`px-2 py-1 rounded text-xs ${food.status === 'available'
                                            ? 'bg-green-100 text-green-800'
                                            : food.status === 'reserved'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : food.status === 'collected'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {food.status}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-2">{food.description}</p>

                            {/* Metadata */}
                            <div className="text-xs text-gray-500 space-y-1">
                                {/* <p>Donor: {food.donor.name}</p> */}
                                <p>Type: {food.type}</p>
                                <p>Quantity: {food.quantity}</p>
                                <p>Price: ₹{food.price}</p>
                                <p>Expires: {food.expiryDate}</p>
                            </div>

                            {/* Delete button */}
                            <div className="mt-3 flex justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteFood(food._id)}
                                >
                                    Delete
                                </Button>
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
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.status === 'completed' ? 'bg-green-100 text-green-800' :
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
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'food-items' && renderFoodItems()}
                    {activeTab === 'fund-donations' && renderFundDonations()}
                </div>
            </div>
        </div>
    );
};
