import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Instagram, Camera, Grid, Users } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  hasLiked: boolean;
}

const INITIAL_POSTS: InstagramPost[] = [
  {
    id: 'i1',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600',
    likes: 312,
    comments: 18,
    caption: 'Focal coffee meets midnight sprints. 💻✨ #DesignersParadise #LivestreamCoffee',
    hasLiked: false
  },
  {
    id: 'i2',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    likes: 428,
    comments: 29,
    caption: 'The precision flow rate of our morning V60. Light body, fruity floral explosion. ☕🍯 #SpecialtyCoffee',
    hasLiked: false
  },
  {
    id: 'i3',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600',
    likes: 215,
    comments: 12,
    caption: 'Velvety New York style cheesecake, backed by deep jazz beats. Open till midnight. 🍰🌙 #DessertLover',
    hasLiked: false
  },
  {
    id: 'i4',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    likes: 512,
    comments: 42,
    caption: 'Perfect 1:1 Cortado symmetry inside the serene ground lobby of Park Inn Radisson. 🏛️🖤 #RadissonSpecialty',
    hasLiked: false
  }
];

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>(INITIAL_POSTS);

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          };
        }
        return post;
      })
    );
  };

  return (
    <section className="py-24 bg-[#0a0a0a] text-brand-cream relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Instagram Brand Card header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold font-mono text-xs tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            SOCIAL DIALOGUE
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-cream leading-tight">
            Moments Worth <span className="font-serif italic font-semibold text-brand-gold">Sharing</span>
          </h2>
          <p className="mt-2 text-brand-cream/65 font-mono text-sm tracking-wide">
            #LivestreamCoffee
          </p>
        </div>

        {/* Profile Card Header Simulation */}
        <div className="max-w-3xl mx-auto bg-[#121212] rounded-2xl border border-brand-cream/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12 shadow-xl">
          {/* Logo frame */}
          <div className="w-20 h-20 rounded-full bg-brand-brown/40 border-2 border-brand-gold p-1 shrink-0 flex items-center justify-center text-brand-gold relative select-none">
            <Instagram className="w-10 h-10" />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[#121212] flex items-center justify-center text-[8px] font-bold text-white uppercase">
              LIVE
            </span>
          </div>

          {/* Statistics profile */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h3 className="text-xl font-serif font-semibold text-brand-cream">livestream.coffee</h3>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg text-[10px] font-mono leading-none tracking-widest uppercase font-bold rounded mx-auto md:mx-0 transition-colors"
              >
                <Instagram className="w-3 h-3" />
                <span>Follow</span>
              </a>
            </div>

            <div className="flex justify-center md:justify-start gap-6 mt-4 text-xs font-manrope font-light text-[#a1a1a1]">
              <div>
                <strong className="text-brand-cream font-medium">184</strong> Posts
              </div>
              <div>
                <strong className="text-brand-cream font-medium">10.4K</strong> Followers
              </div>
              <div>
                <strong className="text-brand-cream font-medium">125+</strong> Reviews
              </div>
            </div>

            <p className="text-xs text-brand-cream/80 font-manrope mt-3 leading-relaxed max-w-xl">
              🍂 Ground Lobby, Park Inn by Radisson, Surat. <br />
              Specialty Micro-Lots • Midnight Conversations • Cozy Coworking.
            </p>
          </div>
        </div>

        {/* Luxury post grid - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#121212] border border-brand-cream/10 rounded-xl overflow-hidden group shadow-lg flex flex-col h-full relative"
            >
              {/* Image with overlay action */}
              <div className="aspect-square relative overflow-hidden bg-neutral-900 select-none">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Hover Banner Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  {/* Hearts action button */}
                  <button
                    onClick={(e) => toggleLike(post.id, e)}
                    className="flex items-center gap-2 text-brand-cream hover:text-brand-gold font-mono text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-6 h-6 ${post.hasLiked ? 'text-red-500 fill-red-500' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-2 text-brand-cream font-mono text-sm font-semibold">
                    <MessageCircle className="w-6 h-6" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Caption description */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <p className="text-xs text-brand-cream/80 font-nanrope font-light leading-relaxed mb-4 line-clamp-3">
                  {post.caption}
                </p>

                {/* Simulated Like heart indicator at bottom */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-cream/5 text-[10px] font-mono text-[#a1a1a1]">
                  <span>INSTAGRAM DIALOGUE</span>
                  <button
                    onClick={(e) => toggleLike(post.id, e)}
                    className={`flex items-center gap-1 hover:text-brand-gold cursor-pointer transition-colors ${
                      post.hasLiked ? 'text-brand-gold' : ''
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.hasLiked ? 'Liked' : 'Like'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
