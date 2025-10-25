import { Link } from 'react-router-dom';
import { ChefHat, MapPin, Clock, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img
            src="/download.jpeg"
            alt="Get Berg Logo"
            className="w-48 h-48 mx-auto object-contain mb-6 rounded-2xl"
          />
          <h1 className="text-6xl md:text-7xl font-bold text-copper mb-4 font-playfair">
            Get Berg
          </h1>
          <p className="text-3xl md:text-4xl text-warm-cream font-playfair italic mb-6">
            Good Food Good Mood
          </p>
        </div>

        <div className="space-y-4 text-warm-cream mb-10">
          <div className="flex items-center justify-center gap-3">
            <MapPin className="text-copper w-6 h-6" />
            <p className="text-lg">Near Satashi School, Rudrapur U.P.</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Clock className="text-copper w-6 h-6" />
            <p className="text-lg">Open Daily: 9:00 AM - 10:00 PM</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Phone className="text-copper w-6 h-6" />
            <p className="text-lg">Contact: +91 XXXXX XXXXX</p>
          </div>
        </div>

        <div className="bg-dark-secondary/40 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-copper/20">
          <ChefHat className="w-16 h-16 text-copper mx-auto mb-4" />
          <h2 className="text-2xl font-playfair text-copper mb-4">Welcome to Our Restaurant</h2>
          <p className="text-warm-cream leading-relaxed">
            Experience the perfect blend of traditional flavors and modern culinary excellence.
            At Get Berg, every dish is prepared with passion and served with love.
            Join us for an unforgettable dining experience where good food truly creates good moods.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/menu"
            className="btn-primary text-lg px-8 py-4 rounded-xl"
          >
            View Menu
          </Link>
          <Link
            to="/about"
            className="btn-secondary text-lg px-8 py-4 rounded-xl"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
