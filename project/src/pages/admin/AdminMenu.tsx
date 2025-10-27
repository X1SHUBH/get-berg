import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MenuItem } from '../../lib/database.types';
import { toast } from 'sonner';

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: '',
    description: '',
    is_available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: formData.name,
            price,
            image_url: formData.image_url,
            description: formData.description,
            is_available: formData.is_available,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Menu item updated successfully');
      } else {
        const { error } = await supabase.from('menu_items').insert({
          name: formData.name,
          price,
          image_url: formData.image_url,
          description: formData.description,
          is_available: formData.is_available,
        });

        if (error) throw error;
        toast.success('Menu item added successfully');
      }

      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to save menu item');
      console.error(error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      image_url: item.image_url,
      description: item.description,
      is_available: item.is_available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);

      if (error) throw error;
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image_url: '',
      description: '',
      is_available: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-copper text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-playfair text-copper">Manage Menu</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-playfair text-copper">
              {editingItem ? 'Edit Menu Item' : 'Add New Item'}
            </h2>
            <button onClick={resetForm} className="text-warm-cream hover:text-copper">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-warm-cream mb-2">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                  required
                />
              </div>
              <div>
                <label className="block text-warm-cream mb-2">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-warm-cream mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                required
              />
            </div>

            <div>
              <label className="block text-warm-cream mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="is_available" className="text-warm-cream">
                Available for customers
              </label>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={resetForm} className="btn-secondary flex-1 py-3 rounded-xl">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-playfair text-copper">{item.name}</h3>
                {!item.is_available && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                    Unavailable
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-warm-cream/80 text-sm mb-4">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-copper">₹{item.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-copper/20 hover:bg-copper/30 text-copper"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12 text-warm-cream">
          <p className="text-xl">No menu items yet. Add your first item!</p>
        </div>
      )}
    </div>
  );
}
