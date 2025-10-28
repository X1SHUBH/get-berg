import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check admin role from admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", data.user?.id)
        .single();

      if (adminError || !adminUser) {
        throw new Error("You are not authorized as an admin");
      }

      navigate("/admin/orders");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-copper-700 text-white rounded-full p-3 mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-semibold text-copper-400">Admin Login</h2>
          <p className="text-neutral-400 mt-2">Sign in with your admin account</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-neutral-500" size={18} />
            <input
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-copper-500 outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-neutral-500" size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-copper-500 outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-copper-600 hover:bg-copper-500 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
