import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, CreditCard, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem } from '../../lib/database.types';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: Order['payment_status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Payment status updated to ${paymentStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error(error);
    }
  };

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF();
    const items = order.items as OrderItem[];

    doc.setFontSize(24);
    doc.text('GET BERG', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Good Food Good Mood', 105, 28, { align: 'center' });
    doc.text('Near Satashi School, Rudrapur U.P.', 105, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.text('_________________________________________________', 20, 42);

    doc.setFontSize(14);
    doc.text('INVOICE', 105, 52, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Order Number: ${order.order_number}`, 20, 62);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 69);
    doc.text(`Customer: ${order.customer_name}`, 20, 76);
    doc.text(`Phone: ${order.customer_phone}`, 20, 83);

    doc.text('_________________________________________________', 20, 88);

    let yPos = 98;
    doc.setFontSize(12);
    doc.text('Items:', 20, yPos);

    yPos += 7;
    doc.setFontSize(10);
    items.forEach((item) => {
      const itemText = `${item.name} x ${item.quantity}`;
      const priceText = `Rs. ${(item.price * item.quantity).toFixed(2)}`;
      doc.text(itemText, 20, yPos);
      doc.text(priceText, 180, yPos, { align: 'right' });
      yPos += 7;
    });

    doc.text('_________________________________________________', 20, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text('TOTAL:', 20, yPos);
    doc.text(`Rs. ${order.total_amount.toFixed(2)}`, 180, yPos, { align: 'right' });

    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, 20, yPos);

    yPos += 20;
    doc.text('Thank you for your order!', 105, yPos, { align: 'center' });
    doc.text('Visit us again!', 105, yPos + 7, { align: 'center' });

    doc.save(`invoice-${order.order_number}.pdf`);
    toast.success('Invoice generated successfully');
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'preparing':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'preparing':
        return 'bg-blue-500/20 text-blue-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-copper text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-playfair text-copper mb-8">Manage Orders</h1>

      <div className="glass-card rounded-2xl p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-copper/20'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-xl transition-all ${
              filter === 'pending'
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-copper/20'
            }`}
          >
            Pending ({orders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-6 py-2 rounded-xl transition-all ${
              filter === 'preparing'
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-copper/20'
            }`}
          >
            Preparing ({orders.filter((o) => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-6 py-2 rounded-xl transition-all ${
              filter === 'delivered'
                ? 'bg-copper text-dark-primary'
                : 'bg-dark-secondary/40 text-warm-cream hover:bg-copper/20'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const items = order.items as OrderItem[];
          return (
            <div key={order.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-playfair text-copper">
                      {order.order_number}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-warm-cream mb-1">Customer: {order.customer_name}</p>
                  <p className="text-warm-cream mb-1">Phone: {order.customer_phone}</p>
                  <p className="text-warm-cream/60 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-copper" />
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                  {order.payment_status === 'paid' && (
                    <button
                      onClick={() => generateInvoice(order)}
                      className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Invoice
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-dark-secondary/40 rounded-xl p-4 mb-6">
                <h4 className="text-copper font-medium mb-3">Order Items:</h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-warm-cream">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-copper/20 mt-3 pt-3 flex justify-between">
                  <span className="text-copper font-bold">Total:</span>
                  <span className="text-copper font-bold text-xl">
                    ₹{order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-warm-cream text-sm mb-2">Order Status:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      disabled={order.status === 'pending'}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        order.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-dark-secondary/40 text-warm-cream hover:bg-yellow-500/10'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      disabled={order.status === 'preparing'}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        order.status === 'preparing'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-dark-secondary/40 text-warm-cream hover:bg-blue-500/10'
                      }`}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={order.status === 'delivered'}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        order.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-dark-secondary/40 text-warm-cream hover:bg-green-500/10'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-warm-cream text-sm mb-2">Payment Status:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePaymentStatus(order.id, 'unpaid')}
                      disabled={order.payment_status === 'unpaid'}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        order.payment_status === 'unpaid'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-dark-secondary/40 text-warm-cream hover:bg-red-500/10'
                      }`}
                    >
                      Unpaid
                    </button>
                    <button
                      onClick={() => updatePaymentStatus(order.id, 'paid')}
                      disabled={order.payment_status === 'paid'}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                        order.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-dark-secondary/40 text-warm-cream hover:bg-green-500/10'
                      }`}
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-warm-cream">
          <p className="text-xl">No orders found.</p>
        </div>
      )}
    </div>
  );
}
