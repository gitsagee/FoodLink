import { useState } from "react";
import { Card } from "../components/Card";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Select } from "../components/Select";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export const SignupPage = ({ onSwitch }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'donor'
    });
    const [errors, setErrors] = useState({});
    const { signup, loading } = useAuth();
    const { showToast } = useToast();

    const roles = [
        { value: 'donor', label: 'Food Donor' },
        { value: 'ngo', label: 'NGO' }
        // , 
        // {value: 'admin', label: 'Admin'}
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
