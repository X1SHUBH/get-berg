import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAbout from './pages/admin/AdminAbout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-primary">
          <Toaster position="top-right" theme="dark" />
          <div className="container mx-auto px-4 py-6">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/menu"
                  element={
                    <ProtectedRoute>
                      <AdminMenu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/about"
                  element={
                    <ProtectedRoute>
                      <AdminAbout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
