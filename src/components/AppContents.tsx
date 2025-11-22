import React from 'react';
import { motion } from 'framer-motion';

export const PortfolioContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white/50 group-hover:text-white transition-colors">Project {i}</span>
            </motion.div>
        ))}
    </div>
);

export const YouTubeContent = () => (
    <div className="space-y-4">
        <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-white/10">
            <span className="text-white/70">Featured Video</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-white/5 rounded-lg" />
            <div className="aspect-video bg-white/5 rounded-lg" />
        </div>
    </div>
);

export const AboutContent = () => (
    <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-xl" />
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sandino</h2>
            <p className="text-white/70 max-w-md">
                Digital Artist & Content Creator passionate about creating immersive visual experiences and pushing the boundaries of web design.
            </p>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
                Resume
            </button>
            <button className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
                Portfolio
            </button>
        </div>
    </div>
);

export const ContactContent = () => (
    <form className="space-y-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-white placeholder:text-white/20" placeholder="hello@example.com" />
        </div>
        <div className="space-y-2">
            <label className="text-sm text-white/70">Message</label>
            <textarea className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-white placeholder:text-white/20 h-32 resize-none" placeholder="Let's create something amazing..." />
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-cyan-500/25 transition-shadow">
            Send Message
        </button>
    </form>
);

export const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-white/30">
        <span className="text-4xl mb-4">✨</span>
        <p>Content for {title} coming soon</p>
    </div>
);
