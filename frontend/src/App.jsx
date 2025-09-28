import  { useState , useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DonorDashboard } from './Dashboard/DonorDashboard';
import { NGODashboard } from './Dashboard/NGODashboard';
import { AdminDashboard } from './Dashboard/AdminDashboard';
import { FundDonationModal } from './Dashboard/FundDonationalModal';

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const handleFundDonation = () => setShowFundModal(true);
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



export default App;