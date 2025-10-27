import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [useSupabase, setUseSupabase] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { legacyAdminLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLegacySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (legacyAdminLogin(password)) {
      toast.success('Welcome, Admin!');
      navigate('/admin/menu');
    } else {
      toast.error('Invalid password');
      setPassword('');
    }
  };

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await adminLogin(email, password);
      if (success) {
        toast.success('Welcome, Admin!');
        navigate('/admin/menu');
      } else {
        toast.error('Invalid credentials or not an admin account');
        setPassword('');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-copper/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-copper" />
          </div>
          <h1 className="text-3xl font-playfair text-copper mb-2">Admin Login</h1>
          <p className="text-warm-cream">
            {useSupabase
              ? 'Sign in with your admin account'
              : 'Enter your password to access the admin panel'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setUseSupabase(false)}
            className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
              !useSupabase
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-dark-secondary/60'
            }`}
          >
            Quick Login
          </button>
          <button
            onClick={() => setUseSupabase(true)}
            className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
              useSupabase
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-dark-secondary/60'
            }`}
          >
            Admin Account
          </button>
        </div>

        {!useSupabase ? (
          <form onSubmit={handleLegacySubmit} className="space-y-6">
            <div>
              <label className="block text-warm-cream mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSupabaseSubmit} className="space-y-6">
            <div>
              <label className="block text-warm-cream mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-copper/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                  placeholder="Enter your admin email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-warm-cream mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-copper/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
