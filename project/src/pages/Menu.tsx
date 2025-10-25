import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MenuItem, OrderItem } from '../lib/database.types';
import { toast } from 'sonner';

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      toast.error('Failed to load menu items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please provide your name and phone number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderNumber = generateOrderNumber();

    try {
      const { error } = await supabase.from('orders').insert([{
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart,
        total_amount: getTotalAmount(),
        status: 'pending',
        payment_status: 'unpaid',
      }] as any);

      if (error) throw error;

      setOrderConfirmation(orderNumber);
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setShowCheckout(false);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-copper text-xl">Loading menu...</div>
      </div>
    );
  }

  if (orderConfirmation) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-playfair text-copper mb-4">Order Confirmed!</h2>
          <p className="text-warm-cream text-lg mb-2">Your order has been placed successfully.</p>
          <p className="text-copper text-2xl font-bold mb-6">Order Number: {orderConfirmation}</p>
          <div className="bg-dark-secondary/40 rounded-xl p-6 mb-6 text-warm-cream">
            <p className="mb-2">We'll prepare your order shortly.</p>
            <p>Please keep your order number for reference.</p>
          </div>
          <button
            onClick={() => setOrderConfirmation(null)}
            className="btn-primary px-8 py-3 rounded-xl"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-playfair text-copper">Our Menu</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="btn-primary relative px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-copper text-dark-primary w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {showCart && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-playfair text-copper">Your Cart</h2>
            <button onClick={() => setShowCart(false)} className="text-warm-cream hover:text-copper">
              <X className="w-6 h-6" />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-warm-cream text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-dark-secondary/40 rounded-xl p-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-warm-cream font-medium">{item.name}</h3>
                      <p className="text-copper">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-dark-primary hover:bg-copper/20 text-copper flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-warm-cream font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-dark-primary hover:bg-copper/20 text-copper flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-copper/20 pt-4 mb-4">
                <div className="flex justify-between items-center text-xl">
                  <span className="text-warm-cream font-medium">Total:</span>
                  <span className="text-copper font-bold">₹{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="btn-primary w-full py-3 rounded-xl text-lg"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {showCheckout && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-playfair text-copper mb-6">Checkout</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-warm-cream mb-2">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-warm-cream mb-2">Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCheckout(false)}
              className="btn-secondary flex-1 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button onClick={handlePlaceOrder} className="btn-primary flex-1 py-3 rounded-xl">
              Place Order
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl overflow-hidden group hover-lift">
            <div className="aspect-video overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-playfair text-copper mb-2">{item.name}</h3>
              {item.description && (
                <p className="text-warm-cream/80 text-sm mb-4">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-copper">₹{item.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12 text-warm-cream">
          <p className="text-xl">No menu items available at the moment.</p>
        </div>
      )}
    </div>
  );
}
