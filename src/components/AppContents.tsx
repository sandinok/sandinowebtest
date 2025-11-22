import React from 'react';
import { motion } from 'framer-motion';

export const PortfolioContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white/50 group-hover:text-white transition-colors font-medium">Project {i}</span>
            </motion.div>
        ))}
    </div>
);

export const YouTubeContent = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 text-center">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/20">
            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Sandino</h2>
            <p className="text-white/60 max-w-md mx-auto">
                Creating digital art, tutorials, and visual experiences. Subscribe to stay updated.
            </p>
        </div>
        <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
            Visit Channel
        </button>
    </div>
);

export const AboutContent = () => (
    <div className="flex flex-col items-center text-center space-y-6 p-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-xl mb-4" />
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Sandino</h2>
            <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
                Digital Artist & Content Creator passionate about creating immersive visual experiences and pushing the boundaries of web design.
            </p>
        </div>
        <div className="flex gap-4 pt-4">
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
    <div className="flex flex-col items-center justify-center h-full p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
        <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
                <label className="text-sm text-white/70 ml-1">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-white placeholder:text-white/20 transition-colors" placeholder="hello@example.com" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-white/70 ml-1">Message</label>
                <textarea className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-white placeholder:text-white/20 h-32 resize-none transition-colors" placeholder="Let's create something amazing..." />
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-cyan-500/25 transition-shadow hover:scale-[1.02] active:scale-[0.98]">
                Send Message
            </button>
        </form>
    </div>
);

export const PlaceholderContent = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-white/30">
        <span className="text-4xl mb-4">✨</span>
        <p>Content for {title} coming soon</p>
    </div>
);
