import { useState, useEffect } from 'react';
import { Facebook, Instagram, Heart, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AboutInfo } from '../lib/database.types';

export default function About() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
      setAboutInfo(data);
    } catch (error) {
      console.error('Failed to load about info:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-playfair text-copper mb-8 text-center">
        About Get Berg
      </h1>

      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-copper" />
            <h2 className="text-2xl font-playfair text-copper">Our Story</h2>
          </div>
          <p className="text-warm-cream leading-relaxed text-lg whitespace-pre-wrap">
            {aboutInfo?.story ||
              'Welcome to Get Berg, where good food meets good mood! Located in the heart of Rudrapur, we serve delicious meals crafted with love and the finest ingredients.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-copper" />
            <h2 className="text-2xl font-playfair text-copper">Our Mission</h2>
          </div>
          <p className="text-warm-cream leading-relaxed text-lg whitespace-pre-wrap">
            {aboutInfo?.mission ||
              'Our mission is to bring joy to every meal and create memorable dining experiences for our community.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-playfair text-copper mb-6 text-center">Connect With Us</h2>
          <div className="flex justify-center gap-6">
            {aboutInfo?.facebook_url && (
              <a
                href={aboutInfo.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-secondary/40 hover:bg-copper/20 text-warm-cream hover:text-copper transition-all"
              >
                <Facebook className="w-6 h-6" />
                <span>Facebook</span>
              </a>
            )}
            {aboutInfo?.instagram_url && (
              <a
                href={aboutInfo.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-secondary/40 hover:bg-copper/20 text-warm-cream hover:text-copper transition-all"
              >
                <Instagram className="w-6 h-6" />
                <span>Instagram</span>
              </a>
            )}
          </div>
          {!aboutInfo?.facebook_url && !aboutInfo?.instagram_url && (
            <p className="text-center text-warm-cream/60">Social media links coming soon!</p>
          )}
        </div>

        <div className="glass-card rounded-2xl p-8 text-center">
          <img
            src="/download.jpeg"
            alt="Get Berg Logo"
            className="w-32 h-32 mx-auto object-contain mb-4 rounded-xl"
          />
          <p className="text-warm-cream text-lg mb-2">Near Satashi School, Rudrapur U.P.</p>
          <p className="text-copper text-xl font-playfair italic">Good Food Good Mood</p>
        </div>
      </div>
    </div>
  );
}
