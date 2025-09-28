
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "../utils/ToastProvider";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";

export const FundDonationModal = ({ isOpen, onClose }) => {
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
