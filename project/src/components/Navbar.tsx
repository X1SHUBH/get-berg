import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu as MenuIcon, Info, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="glass-card rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/download.jpeg" alt="Get Berg" className="w-12 h-12 rounded-lg object-contain" />
          <div>
            <h2 className="text-xl font-playfair text-copper font-bold">Get Berg</h2>
            <p className="text-warm-cream/60 text-xs">Good Food Good Mood</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {!isAdminRoute ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/menu"
                className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
              >
                <MenuIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Menu</span>
              </Link>
              <Link
                to="/about"
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">About</span>
              </Link>
              {!isAdmin ? (
                <Link
                  to="/admin/login"
                  className="nav-link"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              ) : (
                <Link
                  to="/admin/menu"
                  className="nav-link bg-copper/20"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/admin/menu"
                className={`nav-link ${isActive('/admin/menu') ? 'active' : ''}`}
              >
                <MenuIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Menu</span>
              </Link>
              <Link
                to="/admin/orders"
                className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link
                to="/admin/about"
                className={`nav-link ${isActive('/admin/about') ? 'active' : ''}`}
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">About</span>
              </Link>
              <Link
                to="/"
                className="nav-link"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="nav-link bg-red-500/20 hover:bg-red-500/30"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
