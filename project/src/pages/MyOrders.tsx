import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, Package, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Order, OrderItem } from '../lib/database.types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'preparing':
        return <Package className="w-6 h-6 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'preparing':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'preparing':
        return 'Preparing Your Food';
      case 'delivered':
        return 'Order Delivered';
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card rounded-2xl p-12">
          <Package className="w-20 h-20 text-copper mx-auto mb-6" />
          <h2 className="text-3xl font-playfair text-copper mb-4">Sign in to View Orders</h2>
          <p className="text-warm-cream mb-8">
            Please sign in to track your orders and view order history.
          </p>
          <Link to="/login" className="btn-primary px-8 py-3 rounded-xl inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-copper text-xl">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-playfair text-copper mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Package className="w-20 h-20 text-copper/40 mx-auto mb-6" />
          <h2 className="text-2xl font-playfair text-copper mb-4">No Orders Yet</h2>
          <p className="text-warm-cream mb-8">Start ordering delicious food from our menu!</p>
          <Link to="/menu" className="btn-primary px-8 py-3 rounded-xl inline-block">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = order.items as OrderItem[];
            return (
              <div key={order.id} className="glass-card rounded-2xl p-6 hover-lift">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-playfair text-copper mb-2">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-warm-cream/60 text-sm">
                      {new Date(order.created_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-2xl font-bold text-copper">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {order.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                    </span>
                  </div>
                </div>

                <div className={`border-2 rounded-xl p-4 mb-6 ${getStatusColor(order.status)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(order.status)}
                    <h4 className="text-lg font-semibold">{getStatusText(order.status)}</h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-full h-2 rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-400/20'
                          : order.status === 'preparing'
                          ? 'bg-blue-400/20'
                          : 'bg-green-400/20'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          order.status === 'pending'
                            ? 'bg-yellow-400 w-1/3'
                            : order.status === 'preparing'
                            ? 'bg-blue-400 w-2/3'
                            : 'bg-green-400 w-full'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Preparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-secondary/40 rounded-xl p-4 mb-4">
                  <h4 className="text-copper font-medium mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between text-warm-cream">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.delivery_address && (
                  <div className="flex items-start gap-2 text-warm-cream/80 text-sm">
                    <MapPin className="w-4 h-4 text-copper mt-1 flex-shrink-0" />
                    <span>{order.delivery_address}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
