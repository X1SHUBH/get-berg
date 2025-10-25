import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AboutInfo } from '../../lib/database.types';
import { toast } from 'sonner';

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    story: '',
    mission: '',
    facebook_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAboutId(data.id);
        setFormData({
          story: data.story,
          mission: data.mission,
          facebook_url: data.facebook_url,
          instagram_url: data.instagram_url,
        });
      }
    } catch (error) {
      toast.error('Failed to load about info');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (aboutId) {
        const { error } = await supabase
          .from('about_info')
          .update(formData)
          .eq('id', aboutId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('about_info').insert(formData);

        if (error) throw error;
      }

      toast.success('About information updated successfully');
      fetchAboutInfo();
    } catch (error) {
      toast.error('Failed to update about information');
      console.error(error);
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-4xl font-playfair text-copper mb-8">Edit About Page</h1>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-warm-cream mb-2 text-lg font-medium">
              Restaurant Story
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
              rows={6}
              placeholder="Tell your restaurant's story..."
            />
          </div>

          <div>
            <label className="block text-warm-cream mb-2 text-lg font-medium">
              Mission Statement
            </label>
            <textarea
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
              rows={4}
              placeholder="What is your restaurant's mission?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-warm-cream mb-2 text-lg font-medium">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                placeholder="https://facebook.com/getberg"
              />
            </div>

            <div>
              <label className="block text-warm-cream mb-2 text-lg font-medium">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-secondary/40 border border-copper/20 text-warm-cream focus:outline-none focus:border-copper"
                placeholder="https://instagram.com/getberg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
