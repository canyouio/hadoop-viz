import React from 'react';
import { motion } from 'framer-motion';

interface StageCardProps {
  label: string;
  value?: string | number;
  subtext?: string;
  delay?: number;
  highlight?: boolean;
}

export const StageCard: React.FC<StageCardProps> = ({ label, value, subtext, delay = 0, highlight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.05, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -5, boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.1)" }}
      className={`
        relative overflow-hidden rounded-3xl p-5 border transition-all duration-300
        flex flex-col justify-between min-w-[140px] min-h-[90px]
        ${highlight 
          ? 'bg-white border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-2 ring-purple-500/10' 
          : 'bg-white border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-200'
        }
      `}
    >
      {/* Decorative gradient blob */}
      {highlight && (
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 blur-3xl opacity-40 pointer-events-none" />
      )}

      <div className="flex justify-between items-start w-full gap-3 relative z-10">
        <span className="font-semibold text-zinc-800 text-sm md:text-base truncate" title={label}>{label}</span>
        {value !== undefined && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${highlight ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
            {value}
          </span>
        )}
      </div>
      
      {subtext && (
        <div className="mt-3 text-xs text-zinc-400 font-medium relative z-10">
          {subtext}
        </div>
      )}
    </motion.div>
  );
};