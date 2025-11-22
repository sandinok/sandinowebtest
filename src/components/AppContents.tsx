import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Monitor } from 'lucide-react';

// Sub-componente para Portfolio
const PortfolioContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="group relative aspect-video rounded-lg overflow-hidden bg-black/20 border border-white/10 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-bold text-white">Project Alpha {i}</h3>
            <p className="text-sm text-white/60">React • TypeScript • Tailwind</p>
          </div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  </div>
);

// Sub-componente para About Me
const AboutContent = () => (
  <div className="flex flex-col md:flex-row gap-8 items-start">
    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shrink-0 shadow-2xl ring-4 ring-white/10" />
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Hi, I'm Sandino</h2>
      <p className="text-lg text-white/80 leading-relaxed">
        Creative Developer & UI/UX Enthusiast. I build digital experiences that blend 
        performance with aesthetic perfection. Specialized in the React ecosystem and 3D web technologies.
      </p>
      <div className="flex gap-3 pt-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
          <Github size={18} /> GitHub
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b5]/80 hover:bg-[#0077b5] transition-colors border border-white/10">
          <Linkedin size={18} /> LinkedIn
        </button>
      </div>
    </div>
  </div>
);

// Sub-componente para Skills/Animations
const SkillsContent = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[
      { icon: Code2, label: "React / Next.js", color: "text-blue-400" },
      { icon: Palette, label: "Tailwind CSS", color: "text-cyan-400" },
      { icon: Monitor, label: "Three.js / R3F", color: "text-orange-400" },
    ].map((skill, i) => (
      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors">
        <skill.icon size={32} className={skill.color} />
        <span className="font-medium">{skill.label}</span>
      </div>
    ))}
  </div>
);

interface AppContentsProps {
  id: string;
}

export const AppContents: React.FC<AppContentsProps> = ({ id }) => {
  // Animación suave al cambiar de contenido
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  let content;

  switch (id) {
    case 'portfolio':
      content = <PortfolioContent />;
      break;
    case 'about':
      content = <AboutContent />;
      break;
    case 'animations':
    case 'inspiration':
      content = <SkillsContent />;
      break;
    case 'contact':
      content = (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <Mail size={64} className="text-white/20" />
          <h2 className="text-2xl font-bold">Let's work together</h2>
          <a href="mailto:contact@sandino.dev" className="text-blue-400 hover:underline text-lg">
            contact@sandino.dev
          </a>
        </div>
      );
      break;
    default:
      content = (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <Code2 size={48} className="mb-4 opacity-50" />
          <p>Content for {id} is under construction.</p>
        </div>
      );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={contentVariants}
      className="h-full"
    >
      {content}
    </motion.div>
  );
};