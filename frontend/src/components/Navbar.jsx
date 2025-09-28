import { useAuth  } from '../auth/AuthProvider';
import { LogOut, Menu, X } from 'lucide-react';
import  { useState} from 'react';
import { Button } from './Button';
export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = {
    donor: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'My Donations', href: '#my-donations' },
      { name: 'Donate Funds', href: '#donate-funds' }
    ],
    ngo: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Browse Food', href: '#browse-food' },
      { name: 'My Orders', href: '#my-orders' },
      { name: 'Donate Funds', href: '#donate-funds' }
    ],
    admin: [
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Users', href: '#users' },
      { name: 'Food Items', href: '#food-items' },
      { name: 'Fund Donations', href: '#fund-donations' }
    ]
  };

  return (
    <nav className="bg-deep-gray text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-green-400">FoodLink</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user && navigationItems[user.role]?.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-green-400 text-gray-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 ml-auto">
              <span className=" text-gray-400">Welcome, {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-gray-200 border-gray-500 hover:border-green-400 hover:text-green-400 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          </div>


          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && navigationItems[user.role]?.map(item => (
              <a key={item.name} href={item.href} className="block px-3 py-2 hover:text-green-400">
                {item.name}
              </a>
            ))}
            <button onClick={logout} className="block w-full text-left px-3 py-2 hover:text-green-400">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};