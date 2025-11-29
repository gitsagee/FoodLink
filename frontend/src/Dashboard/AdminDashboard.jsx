import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";
import { Users, Package, DollarSign, Trophy, Bell } from "lucide-react";

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [users, setUsers] = useState([]);
    const [foods, setFoods] = useState([]);
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(false);

    const { token, API_URL } = useAuth();
    const { showToast } = useToast();

    // -----------------------
    // FETCH FUNCTIONS
    // -----------------------

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setUsers(data);
        } catch {
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/foods`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setFoods(data);
        } catch {
            showToast("Failed to load foods", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchFunds = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/funds`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setFunds(data);
        } catch {
            showToast("Failed to load funds", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "food-items") fetchFoods();
        if (activeTab === "fund-donations") fetchFunds();
        if (activeTab === "leaderboard") {
            fetchFoods();
            fetchFunds();
        }
    }, [activeTab]);

    // -----------------------
    // ACTIONS
    // -----------------------

    const handleUserAction = async (id, action) => {
        try {
            if (action === "delete") {
                const res = await fetch(`${API_URL}/users/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const msg = await res.json();
                showToast(msg.message, "success");
                fetchUsers();
            } else {
                const res = await fetch(`${API_URL}/users/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ access: action === "grant" }),
                });
                const data = await res.json();
                showToast(
                    `Access ${data.access ? "granted" : "revoked"} successfully`,
                    "success"
                );
                fetchUsers();
            }
        } catch {
            showToast("Action failed", "error");
        }
    };

    const handleDeleteFood = async (id) => {
        try {
            const res = await fetch(`${API_URL}/foods/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const msg = await res.json();
            showToast(msg.message, "success");
            fetchFoods();
        } catch {
            showToast("Failed to delete food", "error");
        }
    };

    // -----------------------
    // RENDER FUNCTIONS
    // -----------------------

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-2xl font-bold">{users.length}</p>
                            <p>Total Users</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <Package className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-2xl font-bold">{foods.length}</p>
                            <p>Food Items</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-2xl font-bold">
                                ₹{funds.reduce((sum, f) => sum + f.amount, 0)}
                            </p>
                            <p>Total Funds</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <Bell className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-2xl font-bold">0</p>
                            <p>Pending Approvals</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderUsers = () => (
        <Card>
            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Access</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-b">
                                    {/* NAME */}
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {u.name}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="px-4 py-3 text-gray-700">{u.email}</td>

                                    {/* ROLE */}
                                    <td className="px-4 py-3 capitalize">{u.role}</td>

                                    {/* ACCESS BADGE */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-semibold ${u.access
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {u.access ? "Granted" : "Revoked"}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">

                                            {/* GRANT / REVOKE BUTTON */}
                                            <Button
                                                size="sm"
                                                variant={u.access ? "destructive" : "primary"}
                                                onClick={() =>
                                                    handleUserAction(
                                                        u._id,
                                                        u.access ? "revoke" : "grant"
                                                    )
                                                }
                                            >
                                                {u.access ? "Revoke Access" : "Grant Access"}
                                            </Button>

                                            {/* DELETE BUTTON */}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleUserAction(u._id, "delete")
                                                }
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
            )}
        </Card>
    );


    const renderFoodItems = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
                <Loading />
            ) : (
                foods.map((f) => (
                    <Card key={f._id} className="p-4 flex flex-col h-full">
                        <div className="flex-grow">
                            {f.imageUrl && (
                                <img
                                    src={f.imageUrl}
                                    className="w-full h-32 object-cover rounded"
                                />
                            )}

                            <h3 className="font-semibold mt-2">{f.name}</h3>
                            <p className="text-sm text-gray-600">{f.description}</p>

                            <p className="text-xs mt-2">Type: {f.type}</p>
                            <p className="text-xs">Qty: {f.quantity}</p>
                            <p className="text-xs">Price: ₹{f.price}</p>
                        </div>

                        <div className="mt-3 text-right">
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFood(f._id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>

                ))
            )}
        </div>
    );

    const renderFundDonations = () => (
        <Card>
            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3">Donor</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Purpose</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {funds.map((f) => (
                                <tr key={f._id} className="border-b ">
                                    <td className="px-4 py-3 text-center">{f.donor?.name}</td>
                                    <td className="px-4 py-3 text-center">₹{f.amount}</td>
                                    <td className="px-4 py-3 text-center">{f.purpose}</td>
                                    <td className="px-4 py-3 text-center">
                                        {new Date(f.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    // -----------------------
    // LEADERBOARD
    // -----------------------

    const renderLeaderboard = () => {
        // Aggregate food counts by donor
        const foodLeaderboard = foods.reduce((acc, f) => {
            const donor = f.donor?.name || "Unknown";
            acc[donor] = (acc[donor] || 0) + 1;
            return acc;
        }, {});

        const fundLeaderboard = funds.reduce((acc, f) => {
            const donor = f.donor?.name || "Unknown";
            acc[donor] = (acc[donor] || 0) + f.amount;
            return acc;
        }, {});

        const foodSorted = Object.entries(foodLeaderboard).sort(
            (a, b) => b[1] - a[1]
        );

        const fundSorted = Object.entries(fundLeaderboard).sort(
            (a, b) => b[1] - a[1]
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold flex items-center">
                        <Trophy className="mr-2 text-yellow-500" /> Top Food Donors
                    </h2>

                    <ul className="mt-4 space-y-2">
                        {foodSorted.map(([name, count]) => (
                            <li
                                key={name}
                                className="flex justify-between border-b pb-2 text-sm"
                            >
                                <span>{name}</span>
                                <span>{count} items</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold flex items-center">
                        <Trophy className="mr-2 text-blue-500" /> Top Fund Donors
                    </h2>

                    <ul className="mt-4 space-y-2">
                        {fundSorted.map(([name, amt]) => (
                            <li
                                key={name}
                                className="flex justify-between border-b pb-2 text-sm"
                            >
                                <span>{name}</span>
                                <span>₹{amt}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        );
    };

    // -----------------------
    // FINAL RETURN
    // -----------------------

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {/* NAV */}
                <nav className="flex space-x-8 mb-6">
                    {[
                        ["overview", "Overview"],
                        ["users", "Users"],
                        ["food-items", "Food Items"],
                        ["fund-donations", "Fund Donations"],
                        ["leaderboard", "Leaderboard"],
                    ].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`py-2 px-1 border-b-2 ${activeTab === id
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                {/* RENDER */}
                {activeTab === "overview" && renderOverview()}
                {activeTab === "users" && renderUsers()}
                {activeTab === "food-items" && renderFoodItems()}
                {activeTab === "fund-donations" && renderFundDonations()}
                {activeTab === "leaderboard" && renderLeaderboard()}
            </div>
        </div>
    );
};
