import  { useState  } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useToast } from '../utils/ToastProvider';
import { useAuth } from '../auth/AuthProvider';
import { Input } from '../components/Input';
export const LoginPage = ({ onSwitch }) => {
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
